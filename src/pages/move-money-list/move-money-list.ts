import { ForceUpdateProvider } from './../../providers/force-update/force-update';
import { MoveMoneyServicePage } from './../move-money-service/move-money-service';
import { MoveMoney } from './../move-money/move-money';
import { UserProvider } from './../../providers/user/user';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

declare var cordova: any;

/**
 * Generated class for the MoveMoneyListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-move-money-list',
  templateUrl: 'move-money-list.html',
})
export class MoveMoneyListPage {

  services = [];

  user: any;
  ret: string = '';

  fetching: boolean = true;
  error: boolean = false;

  apiLink: string = '';

  test: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public api: ApiProvider, public userProvider: UserProvider, public forceUpdate: ForceUpdateProvider) {
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

    let data = JSON.stringify({ "metode": "movemoneylist", "accid": this.user.accid });

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      this.api.query(data_, this.user, 'movemoneylist', refresher !== null ? false : true).then(data__ => {
        if (refresher !== null) {
          refresher.complete();
        }

        this.fetching = false;

        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data___) => {
            let accts: any = JSON.parse(data___);
            this.services = [];
            for (var acct in accts.movemoneys) {
              this.services.push(accts.movemoneys[acct].movemoney);
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
    this.navCtrl.push(MoveMoneyServicePage, { service: service });
  }

  back() {
    this.navCtrl.parent.select(0);
  }

  logOut() {
    this.userProvider.logOut();
  }

}
