import { DateProvider } from './../../providers/date/date';
import { SelectDatePage } from './../select-date/select-date';
import { AlertSuccessPage } from './../alert-success/alert-success';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

declare var cordova: any;

/**
 * Generated class for the NewToTheAppPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-new-to-the-app',
  templateUrl: 'new-to-the-app.html',
})
export class NewToTheAppPage {

  successModal;

  test: boolean = true;

  data: any = {
    fname: '',
    lname: '',
    accountnumber: '',
    gender: '',
    dob: '',
    phone: '',
    email: '',
    nid: '',
    hascard: 'No',
    cardnumber: '',
    otype: 2
  };

  authenticating = false;

  ret: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController, public api: ApiProvider, public date: DateProvider) {
    this.test = api.isTest;
  }

  ionViewDidLoad() {

  }

  openAccount() {
    this.ret = '';
    this.authenticating = true;

    let data = JSON.stringify(this.data);

    cordova.plugins.aesEnc(data, this.api.api().key).then((data_) => {
      this.api.query(data_, null, 'walletopen', false).then(data__ => {
        this.authenticating = false;
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.api.api().key).then((data___) => {

            let coge: any = JSON.parse(data___);
            this.showSuccess(coge);
          }).catch((err) => {
            this.ret = 'Unknown error!';
          });
        } else {
          this.ret = dt.kbankResponse.reply;
        }

      }).catch(error => {
        this.authenticating = false;
        this.ret = 'An error occurred!';
      });
    }).catch((err) => {
      this.authenticating = false;
      this.ret = 'Unknown error!';
    });
  }

  showSuccess(data: any) {
    this.successModal = this.modalCtrl.create(AlertSuccessPage, {
      title: 'Open Wallet Account',
      message: data.transreturn
    });

    this.successModal.onDidDismiss(data => {
      this.hideModal();
    });

    setTimeout(() => {
      this.successModal.present();
    }, 300);
  }

  hideModal() {
    this.navCtrl.pop();
  }

  selectDate() {
    this.date.show(this.data.dob).then(date => {
      if (date !== null) {
        this.data.dob = date;
      }
    });
  }

}
