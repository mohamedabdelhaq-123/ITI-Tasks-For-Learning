import { bootstrapApplication } from '@angular/platform-browser';  //entry point ==> Imports the function that starts Angular apps "has no relation to css framework just a name even if the project has tailwind or bootstrap or vanilla css"
import { appConfig } from './app/app.config'; // import my app config (how app should behave)
import { AppComponent } from './app/app.component'; //  AppComponent = first component to display (entry point of your UI)

bootstrapApplication(AppComponent, appConfig)  // launch AppComponent and apply the configs
  .catch((err) => console.error(err));         // show warining if app failed to start

