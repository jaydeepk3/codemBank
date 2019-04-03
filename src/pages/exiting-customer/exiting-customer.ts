import { AdvertPage } from './../advert/advert';
import { NewToTheAppPage } from './../new-to-the-app/new-to-the-app';
import { Authenticate } from './../authenticate/authenticate';
import { OpenWalletAccountPage } from './../open-wallet-account/open-wallet-account';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the ExitingCustomerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-exiting-customer',
  templateUrl: 'exiting-customer.html',
})
export class ExitingCustomerPage {

  test: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public api: ApiProvider) {
    this.test = api.isTest;
  }

  ionViewDidLoad() {
    let advert = this.modalCtrl.create(AdvertPage);
    advert.present();
  }

  open() {
    this.navCtrl.push(OpenWalletAccountPage);
  }

  register() {
    this.navCtrl.push(NewToTheAppPage);
  }

  authenticate() {
    this.navCtrl.push(Authenticate);
  }

}
