import { Component } from '@angular/core';
import { Events, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';

declare var cordova: any;

/**
 * Generated class for the UtilityVerifyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-utility-verify',
  templateUrl: 'utility-verify.html',
})
export class UtilityVerifyPage {

  confirmModal;

  res: any;

  data_: any;

  fetching: boolean = true;
  error: boolean = false;
  success: boolean = false;

  fetchingC: boolean = false;
  errorC: boolean = false;
  successC: boolean = false;

  user: any;
  ret: string = '';
  pass: string = '';

  test: boolean = true;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController, public userProvider: UserProvider, public api: ApiProvider) {
    try {
      this.data_ = navParams.get('data');
      this.user = userProvider.getUser();
    } catch (exc) {

    }

    this.test = api.isTest;
  }

  ionViewDidLoad() {
    setTimeout(() => {
      try {
        this.fetchInfo();
      } catch (exc) {
      }
    }, 300);
  }

  pinChange() {
    if (this.pass.length === 6) {
      this.confirmFinal();
    }
  }

  fetchInfo() {
    this.fetching = true;
    this.error = false;

    let data = JSON.stringify({
      "accid": this.user.accid,
      "metode": "utilcheck",
      "debitaccount": this.data_.sourceAccount.account,
      "creditaccount": this.data_.creditaccount,
      "beneficiary": this.data_.benefName,
      "benphone": this.data_.benPhone,
      "amount": this.data_.amount,
      "utilityid": this.data_.util.utilityid
    });

    let self = this;

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      self.api.query(data_, self.user, 'utilcheck', false).then(data__ => {
        self.fetching = false;

        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {
            let ab: any = JSON.parse(data___);
            if (ab.utilcheck.retdata.status === '0') {
              self.res = ab.utilcheck.retdata;
              self.success = true;
            } else {
              self.error = true;
              self.ret = ab.utilcheck.retdata.message;
            }
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

  hideModal() {
    this.viewCtrl.dismiss(null);
  }

  confirmFinal() {
    this.fetchingC = true;
    this.errorC = false;
    this.successC = false;
    this.ret = '';

    let data = JSON.stringify({
      "saveben": this.data_.saveBenef ? '1' : '0',
      "pass": btoa(this.pass),
      "trantraceid": this.res.trantraceid,
      "metode": "utilconfirm",
      "accid": this.user.accid,
      "utilityid": this.data_.util.utilityid,
      "amount": this.data_.amount
    });

    let self = this;

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      self.api.query(data_, self.user, 'utilconfirm', false).then(data__ => {
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {
            let accts: any = JSON.parse(data___);

            self.successPage(accts);
            self.successC = true;

          }).catch((err) => {
            self.ret = 'Unknown error!';
            self.errorC = true;
          });
        } else {
          if (dt.kbankResponse.retcode < 606) {
            this.userProvider.logOut();
          }
          self.fetchingC = false;
          self.errorC = true;
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {
            self.ret = data___;
          }).catch((err) => {
            self.ret = dt.kbankResponse.reply;
          });
        }

      }).catch(error => {
        self.fetchingC = false;
        self.ret = 'An error occurred!';
        self.errorC = true;
      });
    }).catch((err) => {
      self.fetchingC = false;
      self.ret = 'Unknown error!';
      self.errorC = true;
    });
  }

  successPage(data: any) {
    this.viewCtrl.dismiss(data);
  }

  logOut() {
    this.userProvider.logOut();
  }

}
