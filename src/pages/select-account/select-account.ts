import { Component } from '@angular/core';
import { Events, NavController, NavParams, ViewController } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';

declare var cordova: any;

/**
 * Generated class for the SelectAccount page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-select-account',
  templateUrl: 'select-account.html',
})
export class SelectAccount {

  accounts: any = [];
  user: any;
  ret: string = '';

  fetching: boolean = true;
  error: boolean = false;

  message: string = '';
  action: string = '';

  test: boolean = true;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public api: ApiProvider, public userProvider: UserProvider) {
    this.user = userProvider.getUser();
    this.message = navParams.get('message');
    this.action = navParams.get('action');
    this.test = api.isTest;
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.fetchAccounts();
    }, 300);
  }

  fetchAccounts() {
    this.fetching = true;
    this.error = false;
    //let data = { 'foo': 'bar', 'signedIn': true };
    //this.viewCtrl.dismiss(data);

    let data = JSON.stringify({ "metode": this.action !== null ? this.action : "mytrxlist", "accid": this.user.accid });

    let self = this;

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      self.api.query(data_, self.user, self.action !== null ? self.action : "mytrxlist", true).then(data__ => {
        self.fetching = false;

        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {

            let accts: any = JSON.parse(data___);
            self.accounts = [];
            for (var acct in accts.accounts) {
              self.accounts.push(accts.accounts[acct].account);
            }

            if (self.accounts.length === 0) {
              self.ret = "No account";
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

  selectAccount(account: any) {
    let data = { account: account };
    this.viewCtrl.dismiss(data);
  }

  hideModal() {
    this.viewCtrl.dismiss(null);
  }

}
