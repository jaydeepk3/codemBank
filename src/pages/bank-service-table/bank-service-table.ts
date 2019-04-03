import { Component } from '@angular/core';
import { Events, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';

declare var cordova: any;

/**
 * Generated class for the BankServiceTablePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-bank-service-table',
  templateUrl: 'bank-service-table.html',
})
export class BankServiceTablePage {

  confirmModal;

  res: any;

  service: any;

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

  data: any = [];

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController, public userProvider: UserProvider, public api: ApiProvider) {
    this.service = navParams.get('service');
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

  fetchInfo() {
    this.fetching = true;
    this.error = false;

    let data = JSON.stringify({
      "accid": this.user.accid,
      "metode": "bankservcheck",
      "debitaccount": '',
      "sdate": '',
      "edate": '',
      "email": '',
      "utilityid": this.service.bankserviceid,
      "reason": '',
      "branch": ''
    });

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      this.api.query(data_, this.user, 'bankservcheck', false).then(data__ => {
        this.fetching = false;

        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data___) => {
            let ab: any = JSON.parse(data___);

            if ('' + ab.utilcheck.retdata.status === '0') {
              this.res = '';
              this.data = [];
              let accts = JSON.parse(ab.utilcheck.retdata.message);

              for (var acct in accts.rates) {
                this.data.push(accts.rates[acct].currency);
              }

              if (this.data.length === 0) {
                this.ret = "No rates";
              }

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

}
