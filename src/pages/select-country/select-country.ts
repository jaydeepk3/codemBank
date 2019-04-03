import { Component } from '@angular/core';
import { Events, NavController, NavParams, ViewController } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';

declare var cordova: any;

/**
 * Generated class for the SelectCountryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-select-country',
  templateUrl: 'select-country.html',
})
export class SelectCountryPage {

  countries: any = [];
  user: any;
  ret: string = '';

  fetching: boolean = true;
  error: boolean = false;

  message: string = '';

  test: boolean = true;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public userProvider: UserProvider, public api: ApiProvider) {
    this.user = userProvider.getUser();
    this.message = navParams.get('message');
    this.test = api.isTest;
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.fetchBeneficials();
    }, 300);
  }

  fetchBeneficials() {
    this.fetching = true;
    this.error = false;

    let data = JSON.stringify({ "metode": "listcountries", "accid": this.user.accid });

    let self = this;

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      self.api.query(data_, self.user, 'listcountries', false).then(data__ => {
        self.fetching = false;
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {
            let accts: any = JSON.parse(data___);
            self.countries = [];
            for (var acct in accts.ibihugu) {
              self.countries.push(accts.ibihugu[acct].igihugu);
            }

            if (self.countries.length === 0) {
              self.ret = "No countries";
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

  selectCountry(country: any) {
    let data = { country: country };
    this.viewCtrl.dismiss(data);
  }

  hideModal() {
    this.viewCtrl.dismiss(null);
  }

}
