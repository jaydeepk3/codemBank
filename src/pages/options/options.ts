import { UserProvider } from './../../providers/user/user';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';

import { ChangePassword } from './../change-password/change-password';

/**
 * Generated class for the Options page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-options',
  templateUrl: 'options.html',
})
export class Options {

  test: boolean = true

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public api: ApiProvider, public userProvider: UserProvider) {
    this.test = api.isTest;
  }

  ionViewDidLoad() {

  }
  openPassword() {
    this.navCtrl.push(ChangePassword);
  }
  logOut() {
    this.userProvider.logOut();
  }

  back() {
    this.navCtrl.parent.select(0);
  }

}
