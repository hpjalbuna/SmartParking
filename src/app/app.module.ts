import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicPageModule, IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http'; 
import { AngularFireModule } from 'angularfire2';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthProvider } from '../providers/auth/auth';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    ReactiveFormsModule, 
    IonicPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFirestore,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AppModule {}
