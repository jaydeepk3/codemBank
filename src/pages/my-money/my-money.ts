import { OpenWalletAccountClientPage } from './../open-wallet-account-client/open-wallet-account-client';
import { BankServicesPage } from './../bank-services/bank-services';
import { Component } from '@angular/core';
import { Events, ModalController, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { EInteractPage } from './../e-interact/e-interact';

declare var cordova: any;

/**
 * Generated class for the MyMoney page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-my-money',
  templateUrl: 'my-money.html'
})
export class MyMoney {

  user: any;

  selectAccountModal;

  test: boolean = true;

  menus__ = [
    {
      name: 'My Accounts',
      icon: 'stats',
      tap: () => { this.openAccounts(); },
      cond: () => { return true; }
    },
    {
      name: 'Open Wallet Account',
      icon: 'cash',
      tap: () => { this.openWallet(); },
      cond: () => { return this.user.haswallet === "N"; }
    },
    {
      name: 'Move Money',
      icon: 'swap',
      tap: () => { this.openTransfer(); },
      cond: () => { return true; }
    },
    {
      name: 'e-Pay',
      icon: 'pricetag',
      tap: () => { this.openPay(); },
      cond: () => { return true; }
    },
    {
      name: 'Bank Services',
      icon: 'list-box',
      tap: () => { this.openServices(); },
      cond: () => { return true; }
    },
    {
      name: 'e-Interact',
      icon: 'chatbubbles',
      tap: () => { this.openEInteract(); },
      cond: () => { return true; }
    },
    {
      name: 'Options',
      icon: 'more',
      tap: () => { this.openOptions(); },
      cond: () => { return true; }
    }
  ];

  menus = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public events: Events, public userProvider: UserProvider, public api: ApiProvider) {
    this.user = userProvider.getUser();
    this.test = api.isTest;

    let menus_ = [];
    for (var i = 0; i < this.menus__.length; i++) {
      if (this.menus__[i].cond()) { menus_.push(this.menus__[i]); }
    }

    for (var i = 0; i < menus_.length; i++) {
      var men = [];
      men.push(menus_[i]);
      i++;
      if (i < menus_.length) { men.push(menus_[i]); }
      this.menus.push(men);
    }

  }

  ionViewDidLoad() {
    let self = this;
    cordova.plugins.aesEnc(JSON.stringify({ "metode": "bankslist", "accid": this.user.accid }), this.user.rkey).then((data) => {
      self.api.query(data, self.user, 'bankslist', true);
    }).catch((error) => {

    });

    cordova.plugins.aesEnc(JSON.stringify({ "metode": "listcurrencies", "accid": this.user.accid }), this.user.rkey).then((data) => {
      self.api.query(data, self.user, 'listcurrencies', true);
    }).catch((error) => {

    });
  }

  openAccounts() {
    this.navCtrl.parent.select(1);
  }

  openTransfer() {
    this.navCtrl.parent.select(2);
  }

  openPay() {
    this.navCtrl.parent.select(3);
  }

  openOptions() {
    this.navCtrl.parent.select(4);
  }

  openEInteract() {
    this.navCtrl.push(EInteractPage);
  }

  openServices() {
    this.navCtrl.push(BankServicesPage);
  }

  openWallet() {
    this.navCtrl.push(OpenWalletAccountClientPage);
  }

  logOut() {
    this.userProvider.logOut();
  }

}
