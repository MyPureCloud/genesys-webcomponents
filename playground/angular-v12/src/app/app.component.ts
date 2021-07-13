import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
  // styleUrls: ['./app.component.less']
})
export class AppComponent {
  secondSectionExists = true;
  secondSectionExistsBeta = true;

  toggleSecondSectionExisting(): void {
    this.secondSectionExists = !this.secondSectionExists;
  }

  toggleSecondSectionExistingBeta(): void {
    this.secondSectionExistsBeta = !this.secondSectionExistsBeta;
  }
}
