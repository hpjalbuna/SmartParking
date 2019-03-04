import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../models/user';

import * as firebase from 'firebase/app';

/**
 * Generated class for the EditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {

  user = {} as User;

  @ViewChild('fname') fname; 
  @ViewChild('lname') lname;
  @ViewChild('bday') bday;
  @ViewChild('platenum') platenum;

  userId: string;

  showFields = false;

  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.userId = this.afAuth.auth.currentUser.uid;
  }

  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(auth => {
      const userRef: firebase.database.Reference = this.afDatabase.database.ref(`/users/${auth.uid}`);
      userRef.on('value', userSnapshot => {
        this.user = userSnapshot.val();
      });
    });  
  }

  saveProfile(){
    firebase.database().ref('/users/' + this.userId + '/firstname/').set(this.fname.value);
    firebase.database().ref('/users/' + this.userId + '/lastname/').set(this.lname.value);
    firebase.database().ref('/users/' + this.userId + '/birthday/').set(this.bday.value);
    firebase.database().ref('/users/' + this.userId + '/platenum/').set(this.platenum.value);

    this.navCtrl.pop();
  }

}
