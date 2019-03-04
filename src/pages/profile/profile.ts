import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../models/user';
// import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {
  user = {} as User;
  firstname = null;
  lastname = null;
  userForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private alertCtrl: AlertController, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.userForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      platenum: ['', Validators.compose([Validators.required, Validators.pattern('^[A-Z]{3}\\s{1}\\d{3,4}$')])],
      birthday: ['', Validators.required]

    });
  }

  ionViewDidLoad() {
  }

  ionViewWillLoad() { 
  }

  alert(message: string){
    this.alertCtrl.create({
      title: "Notice",
      message: message,
      buttons: ['OK'],
      mode: "ios"
    }).present();
  }

  validate(): boolean {
    if (this.userForm.valid) {
      return true;
    }

    let errorMsg = '';

    let control = this.userForm.controls['platenum'];
    if (!control.valid) {
      if (control.errors.pattern) {
        errorMsg = 'Plate number must follow this format: AAA 123 or AAA 1234';
        this.alert(errorMsg);
        console.log(control.errors.pattern);
        console.log(this.userForm.value['platenum']);
      }
    }
    return false;
  }

  createProfile(user: User){
    if (this.validate()){
      try {
        this.afAuth.authState.take(1).subscribe(auth => {
          const userRef: firebase.database.Reference = this.afDatabase.database.ref(`users/${auth.uid}`);
          userRef.set(user).then (auth => {
            this.alert('Sucess! You\'re registered!');
            this.navCtrl.setRoot('MenuPage');
          })
        })
      }catch(error){
        this.alert(error.message)
      }
    }    
  }   
}
