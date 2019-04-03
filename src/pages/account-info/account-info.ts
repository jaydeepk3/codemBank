import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { TransactionDetailsPage } from './../transaction-details/transaction-details';

declare var cordova: any;

/**
 * Generated class for the AccountInfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-account-info',
  templateUrl: 'account-info.html',
})
export class AccountInfoPage {

  account: any;

  transactions: any = [];

  fetching: boolean = true;
  error: boolean = false;

  user: any;
  ret: string = '';

  test: boolean = true;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider, public api: ApiProvider) {
    this.test = api.isTest;
    this.account = navParams.get('account');
    this.user = userProvider.getUser();
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.fetchInfo();
    }, 300);
  }

  fetchInfo() {
    this.fetching = true;
    this.error = false;

    let data = JSON.stringify({ "metode": "acctinfo", "accid": this.user.accid, "account": this.account.account });

    let self = this;

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      self.api.query(data_, self.user, 'acctinfo', false).then(data__ => {
        self.fetching = false;
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {
            let transs: any = JSON.parse(data___);
            self.account.info = transs.account;
            self.transactions = [];
            for (var trans in transs['0'].transactions) {
              self.transactions.push(transs['0'].transactions[trans].transaction);
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

  showTransaction(trans) {
    this.navCtrl.push(TransactionDetailsPage, { transaction: trans, account: this.account })
  }

  logOut() {
    this.userProvider.logOut();
  }

}
