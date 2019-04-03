import { Component } from '@angular/core';
import { Events, NavController, NavParams, ViewController } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';

declare var cordova: any;

/**
 * Generated class for the SelectOperatorPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-select-operator',
  templateUrl: 'select-operator.html',
})
export class SelectOperatorPage {

  operators: any = [];
  user: any;
  ret: string = '';

  fetching: boolean = true;
  error: boolean = false;

  message: string = '';
  movemoneyid: string = '';

  test: boolean = true;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public api: ApiProvider, public userProvider: UserProvider) {
    this.user = userProvider.getUser();
    this.message = navParams.get('message');
    this.movemoneyid = navParams.get('movemoneyid');
    this.test = api.isTest;
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.fetchOperators();
    }, 300);
  }

  fetchOperators() {
    this.fetching = true;
    this.error = false;

    let data = JSON.stringify({ "metode": "operators", "accid": this.user.accid, "movemoneyid": this.movemoneyid });

    let self = this;

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      self.api.query(data_, self.user, 'operators_' + this.movemoneyid, true).then(data__ => {
        self.fetching = false;
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {
            let accts: any = JSON.parse(data___);
            self.operators = [];
            for (var acct in accts.operators) {
              self.operators.push(accts.operators[acct].operator);
            }

            if (self.operators.length === 0) {
              self.ret = "No operators";
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

  selectOperator(operator: any) {
    let data = { operator: operator };
    this.viewCtrl.dismiss(data);
  }

  hideModal() {
    this.viewCtrl.dismiss(null);
  }

}
