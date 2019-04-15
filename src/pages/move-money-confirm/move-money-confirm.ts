import { Component } from '@angular/core';
import { Events, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';

declare var cordova: any;

/**
 * Generated class for the MoveMoneyConfirmPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-move-money-confirm',
  templateUrl: 'move-money-confirm.html',
})
export class MoveMoneyConfirmPage {

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
  saveBenef: boolean = false;
  banks: any = [];
  currency1: string = '';
  currency2: string = '';
  transa: any;

  test: boolean = true;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController, public userProvider: UserProvider, public api: ApiProvider) {
    this.data_ = navParams.get('data');
    this.user = userProvider.getUser();
    this.test = api.isTest;
  }

  ionViewDidLoad() {
    if (this.data_.extras.service.movemoneyid !== '99') {
      this.fetchBanks();
    } else {
      this.confirm();
    }
  }

  pinChange() {
    if (this.pass.length === 6) {
      this.confirmFinal();
    }
  }

  getCurrency(code, v) {
    let self = this;
    cordova.plugins.aesEnc(JSON.stringify({ "metode": "listcurrencies", "accid": this.user.accid }), this.user.rkey).then((data) => {
      self.api.query(data, self.user, 'listcurrencies', true).then(data_ => {
        let dt: any = data_;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data__) => {
            let accts: any = JSON.parse(data__);

            for (var acct in accts.currencies) {
              if (accts.currencies[acct].currency.code === code) {
                self[v] = accts.currencies[acct].currency.isocode;
              }
            }
          }).catch((err) => { })
        } else {
          if (dt.kbankResponse.retcode < 606) {
            this.userProvider.logOut();
          }
        }
      });
    }).catch((error) => {

    });
  }




  fetchBanks() {
    this.fetching = true;
    this.error = false;
    //let data = { 'foo': 'bar', 'signedIn': true };
    //this.viewCtrl.dismiss(data);

    let data = JSON.stringify({ "metode": "bankslist", "accid": this.user.accid });

    let self = this;

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      self.api.query(data_, self.user, 'bankslist', true).then(data__ => {
        self.fetching = false;
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {
            let accts: any = JSON.parse(data___);
            self.banks = [];
            for (var acct in accts.banks) {
              self.banks.push(accts.banks[acct].bank);
            }

            self.confirm();
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

  success_() {
    this.viewCtrl.dismiss({ success: true });
  }

  confirmFinal() {
    this.fetchingC = true;
    this.errorC = false;
    this.successC = false;
    this.ret = '';
    //let data = { 'foo': 'bar', 'signedIn': true };
    //this.viewCtrl.dismiss(data);

    let data = JSON.stringify({ "saveben": this.saveBenef ? '1' : '0', "pass": btoa(this.pass), "trantraceid": this.data_.extras.service.movemoneyid === '99' ? this.data_.beneficiaryid : this.transa.transaction.trantraceid, "metode": "tsfrconfirm", "accid": this.user.accid, "movemoneyid": this.data_.extras.service.movemoneyid });

    let self = this;

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      self.api.query(data_, self.user, 'tsfrconfirm', false).then(data__ => {
        self.fetchingC = false;
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

  confirm() {
    if (this.data_.extras.service.movemoneyid !== '99') {
      this.fetching = true;
      this.error = false;
      this.success = false;
      this.ret = '';

      let data: any = JSON.stringify({
        "metode": this.data_.metode,
        "accid": this.data_.accid,
        "movemoneyid": this.data_.movemoneyid,
        "debitaccount": this.data_.debitaccount,
        "creditaccount": this.data_.creditaccount,
        "beneficiary": this.data_.beneficiary,
        "benphone": this.data_.benphone,
        "bank": this.data_.bank,
        "currency": this.data_.currency,
        "amount": this.data_.amount,
        "description": this.data_.description,
        "secretquestion": this.data_.secretquestion,
        "secretanswer": this.data_.secretanswer,
        "country": this.data_.country,
        "beneficiaryid": this.data_.beneficiaryid,
        "moboperatorid": this.data_.moboperatorid
      });

      cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
        this.api.query(data_, this.user, this.data_.metode, false).then(data__ => {
          this.fetching = false;
          let dt: any = data__;
          if (dt.kbankResponse.retcode === 0) {
            cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data___) => {
              let d: any = JSON.parse(data___);

              this.getCurrency(d.accounts.mycurr, 'currency1');
              this.getCurrency(d.accounts.destcurr, 'currency2');

              this.transa = d.accounts;
              this.transa.transaction = d.transaction;

              this.success = true;
              this.ret = 'Tap to confirm your transaction';
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
    } else {
      this.success = true;
      this.fetching = false;
    }
  }

  successPage(data: any) {
    this.viewCtrl.dismiss(data);
  }

  logOut() {
    this.userProvider.logOut();
  }

}
