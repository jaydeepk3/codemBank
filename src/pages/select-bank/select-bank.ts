import { Component } from '@angular/core';
import { Events, NavController, NavParams, ViewController } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';

declare var cordova: any;

/**
 * Generated class for the SelectBankPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-select-bank',
  templateUrl: 'select-bank.html',
})
export class SelectBankPage {

  banks: any = [];
  user: any;
  ret: string = '';

  fetching: boolean = true;
  error: boolean = false;

  message: string = '';

  test: boolean = true;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public api: ApiProvider, public userProvider: UserProvider) {
    this.user = userProvider.getUser();
    this.message = navParams.get('message');
    this.test = api.isTest;
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.fetchBanks();
    }, 300);
  }

  fetchBanks() {
    this.fetching = true;
    this.error = false;

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
              if (accts.banks[acct].bank.swift !== 'MOMORWRW' && accts.banks[acct].bank.swift !== 'PREPAIDRWRW') {
                self.banks.push(accts.banks[acct].bank);
              }
            }

            if (self.banks.length === 0) {
              self.ret = "No banks";
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

  selectBank(bank: any) {
    let data = { bank: bank };
    this.viewCtrl.dismiss(data);
  }

  hideModal() {
    this.viewCtrl.dismiss(null);
  }

}
