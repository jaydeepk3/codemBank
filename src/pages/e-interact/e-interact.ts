import { Component } from '@angular/core';
import { Events, ModalController, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { AlertSuccessPage } from './../alert-success/alert-success';

declare var cordova: any;

/**
 * Generated class for the EInteractPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-e-interact',
  templateUrl: 'e-interact.html',
})
export class EInteractPage {

  successModal;

  message: string = '';
  subject: string = '';
  user: any;
  ret: string = '';

  fetching: boolean = false;
  error: boolean = false;
  test: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public events: Events, public api: ApiProvider, public userProvider: UserProvider) {
    this.user = userProvider.getUser();
    this.test = api.isTest;
  }

  ionViewDidLoad() {

  }

  sendMessage() {
    this.fetching = true;
    this.error = false;

    let data = JSON.stringify({ "metode": "einteract", "accid": this.user.accid, "emessage": this.message, "esubject": this.subject });

    let self = this;

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      self.api.query(data_, self.user, 'einteract', false).then(data__ => {

        self.fetching = false;
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {
            let accts: any = JSON.parse(data___);
            self.showSuccess(accts.einteractreturn.message);
          }).catch((err) => {
            self.ret = 'Unknown error!';
            self.error = true;
          });
        } else {
          if (dt.kbankResponse.retcode < 606) {
            this.userProvider.logOut();
          }
          self.error = true;
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {
            self.ret = data___;
          }).catch((err) => {
            self.ret = dt.kbankResponse.reply;
          });
        }

      }).catch(error => {
        self.fetching = false;
        self.ret = 'An error occurred!';
        self.error = true;
      });
    }).catch((err) => {
      self.fetching = false;
      self.ret = 'Unknown error!';
      self.error = true;
    });
  }

  showSuccess(message: string) {
    this.successModal = this.modalCtrl.create(AlertSuccessPage, {
      title: 'e-Interact',
      message: message
    });

    this.successModal.onDidDismiss(data => {
      this.navCtrl.pop();
      //this.navCtrl.parent.select(0);
    });

    setTimeout(() => {
      this.successModal.present();
    }, 300);
  }

  logOut() {
    this.userProvider.logOut();
  }

}
