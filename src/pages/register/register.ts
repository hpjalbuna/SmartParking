import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})


export class RegisterPage {
  user = {} as User;

  constructor(private alertCtrl: AlertController, private afStore: AngularFirestore, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
  }

  alert(message: string){
    this.alertCtrl.create({
      title: "Register Error",
      message: message,
      buttons: ['OK']
    }).present();
  }
       
  async register(user: User){
    this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
    .then ( auth => {
      this.alert('Sucess! You\'re registered!');
      this.navCtrl.setRoot('ProfilePage');
    }).catch( error => {
      this.alert(error.message);
    });     
  }
}
