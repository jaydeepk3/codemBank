import { BankServiceTablePage } from './../bank-service-table/bank-service-table';
import { BankServiceMapPage } from './../bank-service-map/bank-service-map';
import { BankServiceStatementPage } from './../bank-service-statement/bank-service-statement';
import { BankServicePage } from './../bank-service/bank-service';
import { UserProvider } from './../../providers/user/user';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

declare var cordova: any;

/**
 * Generated class for the BankServicesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-bank-services',
  templateUrl: 'bank-services.html',
})
export class BankServicesPage {

  services = [];

  user: any;
  ret: string = '';

  fetching: boolean = true;
  error: boolean = false;

  apiLink: string = '';

  test: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public api: ApiProvider, public userProvider: UserProvider) {
    this.user = userProvider.getUser();
    this.apiLink = api.getLink();
    this.test = api.isTest;
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.fetchServices(null);
    }, 300);
  }

  fetchServices(refresher) {
    this.fetching = true;
    this.error = false;

    let data = JSON.stringify({ "metode": "bankservlist", "accid": this.user.accid });

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      this.api.query(data_, this.user, 'bankservlist', refresher !== null ? false : true).then(data__ => {
        if (refresher !== null) {
          refresher.complete();
        }

        this.fetching = false;

        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data___) => {
            let accts: any = JSON.parse(data___);
            this.services = [];
            for (var acct in accts.bankservices) {
              this.services.push(accts.bankservices[acct].bankservice);
            }

            if (this.services.length === 0) {
              this.ret = "No Services";
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
        if (refresher !== null) {
          refresher.complete();
        }
        this.fetching = false;
        this.ret = 'An error occurred!';
        this.error = true;
      });
    }).catch((err) => {
      if (refresher !== null) {
        refresher.complete();
      }
      this.fetching = false;
      this.ret = 'Unknown error!';
      this.error = true;
    });
  }

  selectService(service: any) {
    if (service.fieldtype === 'S') {
      this.navCtrl.push(BankServiceStatementPage, { service: service });
    } else if (service.fieldtype === 'M') {
      this.navCtrl.push(BankServiceMapPage, { service: service });
    } else if (service.fieldtype === 'L') {
      this.navCtrl.push(BankServiceTablePage, { service: service });
    } else {
      this.navCtrl.push(BankServicePage, { service: service });
    }
  }

  logOut() {
    this.userProvider.logOut();
  }

}
