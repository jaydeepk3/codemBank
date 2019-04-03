import { UserProvider } from './../../providers/user/user';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TransactionDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-transaction-details',
  templateUrl: 'transaction-details.html',
})
export class TransactionDetailsPage {

  transaction: any = {
    refno: ''
  };
  account: any;

  test: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public api: ApiProvider, public userProvider: UserProvider) {
    this.account = navParams.get('account');
    this.transaction = navParams.get('transaction');
    this.test = api.isTest;
  }

  ionViewDidLoad() {

  }

  logOut() {
    this.userProvider.logOut();
  }

}
