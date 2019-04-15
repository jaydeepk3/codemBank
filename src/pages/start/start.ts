import { ExitingCustomerPage } from './../exiting-customer/exiting-customer';
import { ApiProvider } from './../../providers/api/api';
import { OpenWalletAccountPage } from './../open-wallet-account/open-wallet-account';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the StartPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  test: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public api: ApiProvider) {
    this.test = api.isTest;
  }

  ionViewDidLoad() {

  }

  showExisting() {
    this.navCtrl.push(ExitingCustomerPage);
  }

  showRegister() {
    this.navCtrl.push(OpenWalletAccountPage);
  }

}
