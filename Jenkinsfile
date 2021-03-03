@Library('pipeline-library')
import com.genesys.jenkins.Service

def notifications = null
String[] mailingList = [
  "Matthew.Cheely@genesys.com",
  "Daragh.King@genesys.com"
]


def isActiveReleaseBranch() {
  return env.SHORT_BRANCH.equals('master');
}

def isMaintenanceReleaseBranch() {
  return env.SHORT_BRANCH.startsWith('maintenance/');
}

def isFeatureBranch() {
  return env.SHORT_BRANCH.startsWith('feature/');
}

def isReleaseBranch() {
  return isActiveReleaseBranch() || isMaintenanceReleaseBranch();
}


def isPublicBranch() {
  isReleaseBranch() || isFeatureBranch();
}

def uploadVersionOverride() {
    if (isFeatureBranch()) {
        return "--version ${env.SHORT_BRANCH}"
    } else {
        return ""
    }
}

pipeline {
  agent { label 'dev_mesos_v2' }
  options {
    quietPeriod(480)
    disableConcurrentBuilds()
  }

  environment {
    NPM_UTIL_PATH = "npm-utils"
    REPO_DIR = "repo"
    SHORT_BRANCH = env.GIT_BRANCH.replaceFirst(/^origin\//, '');
  }

  tools {
    nodejs "NodeJS 12.13.0"
  }

  stages {
    stage('Import notifications lib') {
      steps {
        script {
          // clone pipelines repo
          dir('pipelines') {
            git branch: 'master',
                url: 'git@bitbucket.org:inindca/pipeline-library.git',
                changelog: false

            notifications = load 'src/com/genesys/jenkins/Notifications.groovy'
          }
        }
      }
    }

    stage('Checkout') {
      steps {
        deleteDir()
        dir(env.REPO_DIR) {
          checkout scm
          // Make a local branch so we can work with history and push (there's probably a better way to do this)
          sh "git checkout -b ${env.SHORT_BRANCH}"
        }
      }
    }


    stage('Avoid Build Loop') {
      steps {
        script {
          dir(env.REPO_DIR) {
            def lastCommit = sh(script: 'git log -n 1 --format=%s', returnStdout: true).trim()
            if (lastCommit.startsWith('chore(release)')) {
              currentBuild.description = 'Skipped'
              currentBuild.result = 'ABORTED'
              error('Last commit was a release, exiting build process.')
            }
          }
        }
      }
    }

    stage('Prep') {
      steps {
        sh "git clone --single-branch -b master --depth=1 git@bitbucket.org:inindca/npm-utils.git ${env.NPM_UTIL_PATH}"
        dir(env.REPO_DIR) {
          sh "${env.WORKSPACE}/${env.NPM_UTIL_PATH}/scripts/jenkins-create-npmrc.sh"
          sh "cp .npmrc docs/.npmrc"
          sh "npm ci"
          sh "npm i --no-save @purecloud/web-app-deploy@latest"
        }
      }
    }

    stage('Check') {
      steps {
        dir(env.REPO_DIR) {
          sh "npm run lint"
          sh "npm run test.unit"
        }
      }
    }

    stage('Bump Version') {
      when {
        expression { isReleaseBranch() }
      }
      steps {
        dir(env.REPO_DIR) {
          script {
            sh "npm run release"
          }
        }
      }
    }

    stage('Build') {
      steps {
        dir(env.REPO_DIR) {
          // Generate manifest file with deployment metadata
          sh './scripts/generate-manifest'
          // Generate the CDN_URL for use in the docs and build everything.
          sh """
            export DOCS_CDN_URL=\$(npx cdn ${uploadVersionOverride()} --ecosystem pc --manifest docs-manifest.json)
            export CDN_URL=\$(npx cdn ${uploadVersionOverride()} --ecosystem pc --manifest library-manifest.json)

            npm run build
          """
          // Re-generate manifest file after building docs - required to find *.html in docs
          sh './scripts/generate-manifest'
        }
      }
    }

    stage('Upload Assets') {
      when {
        expression { isPublicBranch() }
      }
      steps {
        dir(env.REPO_DIR) {
          sh "echo Uploading static assets!"
          sh """
             npx upload \
                ${uploadVersionOverride()} \
                --ecosystem pc \
                --manifest library-manifest.json \
                --source-dir ./dist/genesys-webcomponents
          """
        }
      }
    }


    stage('Publish Library') {
      when {
        expression { isReleaseBranch()  }
      }
      steps {
        dir(env.REPO_DIR) {
          script {
            sh "npm publish"
            sshagent(credentials: ['3aa16916-868b-4290-a9ee-b1a05343667e']) {
              sh "git push --follow-tags -u origin ${env.SHORT_BRANCH}"
            }
          }
          script {
            publishedVersion = sh(script: 'node -e "console.log(require(\'./package.json\').version)"', returnStdout: true).trim()
            currentBuild.description = publishedVersion
          }
        }
      }
    }


    stage('Upload Docs') {
      when {
        expression { isPublicBranch() }
      }
      steps {
        sh "echo Uploading release!"
        dir (env.REPO_DIR) {
          sh './scripts/generate-versions-file'
          sh """
             npx upload \
                ${uploadVersionOverride()} \
                --ecosystem pc \
                --manifest docs-manifest.json \
                --source-dir ./docs/dist
          """
        }
      }
    }


    stage('Deploy Docs') {
      when {
        expression { isActiveReleaseBranch() }
      }
      steps {
        dir (env.REPO_DIR) {
          sh '''
             npx deploy \
                --ecosystem pc \
                --manifest docs-manifest.json \
                --dest-env dev
          '''
        }
      }
    }
  }

  post {
    fixed {
      script {
        notifications.emailResults(mailingList.join(" "))
      }
    }

    failure {
      script {
        notifications.emailResults(mailingList.join(" "))
      }
    }
  }

}
