import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as moment from 'moment';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage:any = 'LoginPage';
  minTime = moment().set({hour: 8, minute: 0, seconds: 0}).toISOString();
  maxTime = moment().set({hour: 21, minute: 0, seconds: 0}).toISOString();
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit(){
    
  }
  
}
