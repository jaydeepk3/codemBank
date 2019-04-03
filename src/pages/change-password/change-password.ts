import { Component } from '@angular/core';
import { Events, ModalController, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { AlertSuccessPage } from './../alert-success/alert-success';

declare var cordova: any;

/**
 * Generated class for the ChangePassword page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePassword {
  successModal;

  user: any;
  ret: string = '';

  pass: string = '';
  newpass: string = '';
  confirmnewpass: string = '';

  fetching: boolean = false;
  error: boolean = false;

  tim: any;
  test: boolean = true;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public events: Events, public userProvider: UserProvider, public api: ApiProvider) {
    this.user = userProvider.getUser();
    this.test = api.isTest;
  }

  ionViewDidLoad() {

  }

  newPassChange() {
    try {
      this.tim.clearTimeout();
    } catch (exc) { }

    if (this.newpass.length > 6) {
      this.tim = setTimeout(() => {
        this.newpass = this.newpass.substr(0, 6);
      }, 1000);
    }
  }

  change() {
    this.fetching = true;
    this.error = false;
    //let data = { 'foo': 'bar', 'signedIn': true };
    //this.viewCtrl.dismiss(data);

    let data = JSON.stringify({ "metode": "pinchange", "accid": this.user.accid, "pass": btoa(this.pass), "newpass": btoa(this.newpass) });

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      this.api.query(data_, this.user, 'pinchange', false).then(data__ => {
        this.fetching = false;
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data___) => {
            let accts: any = JSON.parse(data___);

            this.showSuccess()

          }).catch((err) => {
            this.ret = 'Unknown error!';
            this.error = true;
          });
        } else {
          if (dt.kbankResponse.retcode < 606) {
            this.userProvider.logOut();
          }
          this.error = true;
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data___) => {
            this.ret = data___;
          }).catch((err) => {
            this.ret = dt.kbankResponse.reply;
          });
        }

      }).catch(error => {
        this.fetching = false;
        this.ret = 'An error occurred!';
        this.error = true;
      });
    }).catch((err) => {
      this.fetching = false;
      this.ret = 'Unknown error!';
      this.error = true;
    });
  }

  logOut() {
    this.userProvider.logOut();
  }

  showSuccess() {
    this.successModal = this.modalCtrl.create(AlertSuccessPage, {
      title: 'Change PIN',
      message: 'Your PIN was successfully changed!'
    });

    this.successModal.onDidDismiss(data => {
      this.userProvider.logOut();
    });

    setTimeout(() => {
      this.successModal.present();
    }, 300);
  }

}
