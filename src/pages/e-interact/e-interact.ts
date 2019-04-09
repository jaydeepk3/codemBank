import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { InboxPage } from './../inbox/inbox';
import { ClaimFromPage } from './../claim-from/claim-from';

declare var cordova: any;

/**
 * Generated class for the EInteractPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-e-interact',
  templateUrl: 'e-interact.html',
})
export class EInteractPage {
  user: any;
  test: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public userProvider: UserProvider) {
    this.user = userProvider.getUser();
    this.test = api.isTest;
  }

  ionViewDidLoad() {

  }
  selectUtil(i)
  {
    switch (i) {
      case 1:
        this.navCtrl.push(InboxPage);
         break;
      case 2:
        this.navCtrl.push(ClaimFromPage);
         break;
     }
  }
  logOut() {
    this.userProvider.logOut();
  }

}
