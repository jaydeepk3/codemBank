import { Component } from '@angular/core';
import { Events, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';

declare var cordova: any;

/**
 * Generated class for the BankServiceVerifyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-bank-service-verify',
  templateUrl: 'bank-service-verify.html',
})
export class BankServiceVerifyPage {

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

    this.data_ = navParams.get('data');
    this.user = userProvider.getUser();

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
      "metode": "bankservcheck",
      "debitaccount": this.data_.debitaccount.account,
      "sdate": this.data_.sdate,
      "edate": this.data_.edate,
      "email": this.data_.email,
      "utilityid": this.data_.service.bankserviceid,
      "reason": this.data_.reason,
      "branch": this.data_.branch.branchid
    });

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      this.api.query(data_, this.user, 'bankservcheck', false).then(data__ => {
        this.fetching = false;

        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data___) => {
            let ab: any = JSON.parse(data___);

            if ('' + ab.utilcheck.retdata.status === '0') {
              this.res = ab.utilcheck.retdata;
              this.success = true;
            } else {
              this.error = true;
              this.ret = ab.utilcheck.retdata.message;
            }
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

  hideModal() {
    this.viewCtrl.dismiss(null);
  }

  confirmFinal() {
    this.fetchingC = true;
    this.errorC = false;
    this.successC = false;
    this.ret = '';

    let data = JSON.stringify({
      "pass": btoa(this.pass),
      "trantraceid": this.res.trantraceid,
      "metode": "bankservconfirm",
      "accid": this.user.accid,
      "utilityid": this.data_.service.bankserviceid
    });

    let self = this;

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      self.api.query(data_, self.user, 'bankservconfirm', false).then(data__ => {
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
