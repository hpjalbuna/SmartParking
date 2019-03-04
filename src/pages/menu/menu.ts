import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../models/user';
import { Reservation } from '../../models/reservation';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  user = {} as User;
  reservation = {} as Reservation;
  public spaces: Array<any> = [];

  
  constructor(private afAuth: AngularFireAuth, public afDatabase: AngularFireDatabase, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {

  }

  alert(message: string, space: string){
    this.alertCtrl.create({
      title: "Cancellation",
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.cancelReservation(space);
          }        
        },
        {
          text: 'Cancel'
        }
      ]
    }).present();
  }
 

  ionViewWillLoad() {
   
  }
  
  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(auth => {
      this.afDatabase.database.ref(`/users/${auth.uid}`).on('value', userSnapshot => {
        this.user = userSnapshot.val();
        console.log(this.user.hasReserved);
        this.reservation = this.user.reservation;
      });
    });     
  }

  profilePage(){
    this.navCtrl.push('UserPage');
  }

  settingsPage(){
    this.navCtrl.push('SettingsPage');
  }

  beginParking(){
    const statusRef: firebase.database.Reference = this.afDatabase.database.ref(`spaces/A1`);
    this.afDatabase.database.ref(`spaces/A1/led_status`).once('value').then(function(snapshot){
      if(snapshot.val() === 1){
        statusRef.update({ led_status: 0})
      }else{
        statusRef.update({ led_status: 1})
      }
    });
  }

  reservationPage(){
    this.navCtrl.push('ReservePage');

    // let alert = this.alertCtrl.create();
    // var userId = this.afAuth.auth.currentUser.uid;
    // var hasReserved: boolean;    

    // this.afDatabase.database.ref(`users/${userId}/hasReserved`).once('value').then(function(snapshot){
    //   hasReserved = snapshot.val();
    //   console.log(hasReserved)      
    // });
  }

  showConfirm(reservation: Reservation){
    this.alert('Are you sure you want to cancel your reservation for space ' + reservation.space + ' from ' + reservation.start + ' to ' + reservation.end + '?', reservation.space);
  }

  cancelReservation(space: string){
    this.afAuth.authState.take(1).subscribe(auth => {
      let self = this;
      this.afDatabase.database.ref(`/users/${auth.uid}/reservation`).remove();
      this.afDatabase.database.ref(`/users/${auth.uid}`).update({hasReserved: false});

      this.afDatabase.database.ref(`reservations/${space}`).orderByKey().on('value', function(snapshot){
        snapshot.forEach(function(data){
          var reservationData = data.val();
          if(reservationData.user === auth.uid){
            self.afDatabase.database.ref(`reservations/${space}/${data.key}`).remove();
          }
        });
      });
    });  

    
  }
  
  async logOut(){
    this.afAuth.auth.signOut().then();
    this.navCtrl.setRoot('LoginPage');

  }
  
}
