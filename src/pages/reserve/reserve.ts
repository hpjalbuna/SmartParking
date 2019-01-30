import { Component, ContentChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase }from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Reservation } from '../../models/reservation';

/**
 * Generated class for the ReservePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reserve',
  templateUrl: 'reserve.html',
})
export class ReservePage {
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

  ngOnInit(){
    let alert = this.alertCtrl.create();
    alert.setTitle('What you will you do today?');

    this.catRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        alert.addInput({
          type: 'checkbox',
          label: itemSnap.val(),
          value: itemSnap.val()
        });
      });
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Next',
      handler: data => {
        this.findSpace(data.toString().toLowerCase());
      }
    });
    alert.present(); 
  }

  ionViewWillLoad(){
    this.catRef.on('value', itemSnapshot => {
      this.spaces = [];
      itemSnapshot.forEach( itemSnap => {
          this.spaces.push(itemSnap.val());
          return false;
      });
  });
  }

  ionViewDidLoad() {
       
  }

  findSpace(input: string){    
    var space = "";
    let alert = this.alertCtrl.create();
    this.spaceRef.orderByKey().on("value", function(snapshot){
      snapshot.forEach(childSnapshot => {       
        if((childSnapshot.child('category').val() === input) && (childSnapshot.child('status').val() === 'available')){
          space = childSnapshot.key;
        }    
      });
    });

    alert.setTitle("Recommendation");
    alert.setSubTitle("We suggest space "+ space + "!");
    alert.addInput({
      name: 'time',
      type: 'time',
      value: '12:00'
    });

    alert.addButton('No, Thanks');
    alert.addButton({
      text: 'Agree',
      handler: data => {
        this.reserveSpace(data.time, space);
      }
    });
    alert.present();
  }  

  reserveSpace(time: string, space: string){
    let reservation = {} as Reservation;
    this.afAuth.authState.take(1).subscribe(auth => {
      reservation.user = auth.uid; 
      // reservation.time = time;
      reservation.space = space;
      const reservationRef: firebase.database.Reference = this.afDatabase.database.ref(`reservations`);
      const statusRef: firebase.database.Reference = this.afDatabase.database.ref(`spaces/${space}`);
      reservationRef.push(reservation).then (() => {
        statusRef.update({status: "unavailable"});
        this.alert("Congratulations");
      });
    });


  }
  
}
