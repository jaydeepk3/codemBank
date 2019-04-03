import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { AccountInfoPage } from './../account-info/account-info';

declare var cordova: any;

/**
 * Generated class for the MyAccountsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-my-accounts',
  templateUrl: 'my-accounts.html',
})
export class MyAccountsPage {

  accounts: any = {
    C: {
      title: 'Current and Saving Accounts',
      accounts: []
    },
    T: {
      title: 'Term Deposit Accounts',
      accounts: []
    },
    L: {
      title: 'Loan Accounts',
      accounts: []
    }
  };
  user: any;
  ret: string = '';

  fetching: boolean = true;
  error: boolean = false;

  test: boolean = true;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public userProvider: UserProvider) {
    this.user = userProvider.getUser();
    this.test = api.isTest;
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.fetchAccounts(null);
    }, 300);
  }

  fetchAccounts(refresher) {
    this.fetching = true;
    this.error = false;

    let data = JSON.stringify({ "metode": "acclist", "accid": this.user.accid });

    let self = this;

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      self.api.query(data_, self.user, 'acclist', refresher !== null ? false : true).then(data__ => {
        if (refresher !== null) {
          refresher.complete();
        }

        self.fetching = false;
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {
            let accts: any = JSON.parse(data___);
            self.accounts.C.accounts = [];
            self.accounts.T.accounts = [];
            self.accounts.L.accounts = [];
            for (var acct in accts.accounts) {
              let sda = accts.accounts[acct].account;
              self.accounts[sda.tlist].accounts.push(sda);
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
        if (refresher !== null) {
          refresher.complete();
        }
        self.fetching = false;
        self.ret = 'An error occurred!';
        self.error = true;
      });
    }).catch((err) => {
      if (refresher !== null) {
        refresher.complete();
      }
      self.fetching = false;
      self.ret = 'Unknown error!';
      self.error = true;
    });
  }

  openAccount(account: any) {
    if (account.tlist === 'C') {
      this.navCtrl.push(AccountInfoPage, { account: account });
    }
  }

  back() {
    this.navCtrl.parent.select(0);
  }

  logOut() {
    this.userProvider.logOut();
  }

}
