#! /usr/bin/env node

const fs = require('fs').promises;
const glob = require('glob');
const path = require('path');

async function listComponentTracking() {
  const files = glob.sync('src/components/@(beta|stable|legacy)/*/*.tsx');

  const output = await Promise.all(
    files.map(async file => {
      const contents = await await fs.readFile(file, 'utf8');

      const importsTracking = contents.includes(
        'import { trackComponent } from'
      )
        ? '✅'
        : '❌';
      const definedRoot = contents.includes(' root:') ? '✅' : '❌';
      const callTracking = contents.includes('trackComponent(this.root')
        ? '✅'
        : '❌';

      return { file, importsTracking, definedRoot, callTracking };
    })
  );

  console.table(output, [
    'file',
    'importsTracking',
    'definedRoot',
    'callTracking'
  ]);
}

listComponentTracking();
