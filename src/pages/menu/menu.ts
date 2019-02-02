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
  public spaces: Array<any> = [];

  catRef: firebase.database.Reference = this.afDatabase.database.ref(`categories`);
  spaceRef: firebase.database.Reference = this.afDatabase.database.ref(`spaces`);
  
  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    
  }

  alert(message: string){
    this.alertCtrl.create({
      title: "Alert",
      message: message,
      buttons: ['OK']
    }).present();
  }

  ionViewWillLoad() {
   
  }
  
  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(auth => {
      const userRef: firebase.database.Reference = this.afDatabase.database.ref(`/users/${auth.uid}`);
      userRef.on('value', userSnapshot => {
        this.user = userSnapshot.val();
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

  findSpace(input: string){    
    var space = "";
    let alert = this.alertCtrl.create();
    this.spaceRef.orderByKey().on("value", function(snapshot){
      snapshot.forEach(childSnapshot => {       
        if((childSnapshot.child('category').val() === input)){
          space = childSnapshot.key;
        }
      });      
    });
   
    alert.setTitle("Recommendation");
    alert.setSubTitle("We suggest space "+ space + "!");
    alert.addInput({
      name: 'start',
      type: 'time',
      value: '00:00'
    });
    alert.addInput({
      name: 'end',
      type: 'time',
      value: '00:00'
    });


    alert.addButton('No, Thanks');
    alert.addButton({
      text: 'Reserve',
      handler: data => {
        this.reserveSpace(data.start, data.end, space)
        
      }
    });    
    alert.present();  
    
  } 

  reserveSpace(start: any, end: any, space: string){    
    const reservationRef: firebase.database.Reference = this.afDatabase.database.ref(`reservations/${space}`);
    let reservation = {} as Reservation;
    var isValid: boolean;
    var successful: boolean;
    let format = 'hh:mm';
    var startTime = moment(start, format);
    reservationRef.orderByKey().on("value", function(snapshot){
      snapshot.forEach(childSnapshot => {      
        var startFound = moment(childSnapshot.child('start').val(), format);
        var endFound = moment(childSnapshot.child('end').val(), format);
        if (startTime.isBetween(startFound, endFound) || startTime.isSame(startFound)){
          console.log(startTime.isBetween(startFound, endFound))
          isValid = false
          return true
        }else{
          isValid = true
        }
      }); 
    });
    if (!isValid){
      this.alert("This time slot is already reserved. Please try again");
    }else{
      
      this.afAuth.authState.take(1).subscribe(auth => {
        reservation.user = auth.uid;
        reservation.start = start;
        reservation.end = end;
        
        reservationRef.push(reservation).then (() => {
          this.alert("Congratulations");      
        });
        const userRef: firebase.database.Reference = this.afDatabase.database.ref(`users/${auth.uid}`);
        userRef.update({ hasReserved: true });  
        successful = true;    
      });           
    }  
    setInterval(function(){
     
      if(successful){
        var now = moment();
        console.log("running");
        if (startTime.diff(now, 'minutes') <= 30){
          var diff: Number = startTime.diff(now, 'minutes') + 1
          this.alert("You have " + diff + " minutes left. Arrive on time to avoid cancellation.");
        } 
      }      
    }, 10000)

  }
  
  async logOut(){
    this.afAuth.auth.signOut().then();
    this.navCtrl.setRoot('LoginPage');

  }
  
}
