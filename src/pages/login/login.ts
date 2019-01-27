import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})


export class LoginPage {
  user = {} as User;
  constructor(private alertCtrl: AlertController, private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
  }

  alert(message: string){
    this.alertCtrl.create({
      title: "Alert",
      subTitle: message,
      buttons: ['OK']
    }).present();
  }

  async login(user: User) {
    try{
      this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
        if(user.email === 'admin@test.com' && user.password === 'admin1'){
          this.navCtrl.setRoot('AdminPage');
        }else{
          this.alert('Sucess! You\'re logged in!');
          this.navCtrl.setRoot('MenuPage');
        }
    }catch(error){
      this.alert(error);
    }
         
  }

  register() {
    this.navCtrl.push('RegisterPage');
  }

  ionViewWillLoad(){

  }

}
