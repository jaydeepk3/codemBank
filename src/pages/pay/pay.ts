import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { UtilityPage } from './../utility/utility';

declare var cordova: any;

/**
 * Generated class for the Pay page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class Pay {

  utils: any = [];
  user: any;
  ret: string = '';

  fetching: boolean = true;
  error: boolean = false;

  apiLink: string = '';

  test: boolean = true;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public userProvider: UserProvider) {
    this.user = userProvider.getUser();
    this.apiLink = api.getLink();
    this.test = api.isTest;
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.fetchUtils(null);
    }, 300);
  }

  fetchUtils(refresher) {
    this.fetching = true;
    this.error = false;

    let data = JSON.stringify({ "metode": "utilist", "accid": this.user.accid });

    let self = this;

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      self.api.query(data_, self.user, 'utilist', refresher !== null ? false : true).then(data__ => {
        if (refresher !== null) {
          refresher.complete();
        }

        self.fetching = false;

        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {
            let accts: any = JSON.parse(data___);
            self.utils = [];
            for (var acct in accts.utilities) {
              self.utils.push(accts.utilities[acct].utility);
            }

            if (self.utils.length === 0) {
              self.ret = "No Utilities";
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

  selectUtil(util: any) {
    this.navCtrl.push(UtilityPage, { util: util });
  }

  logOut() {
    this.userProvider.logOut();
  }

  back() {
    this.navCtrl.parent.select(0);
  }

}
