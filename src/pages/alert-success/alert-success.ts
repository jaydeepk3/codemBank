import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Market } from '@ionic-native/market';

/**
 * Generated class for the AlertSuccessPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-alert-success',
  templateUrl: 'alert-success.html',
})
export class AlertSuccessPage {

  sTitle: string = '';
  sMessage: string = '';

  forceUpdate: boolean = false;

  vis: boolean = false;

  ind: number = 0;
  indT: number = 10;

  test: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public api: ApiProvider, public platform: Platform, public market: Market) {
    this.sTitle = navParams.get('title');
    this.sMessage = navParams.get('message');

    if (navParams.get('forceUpdate')) {
      this.forceUpdate = navParams.get('forceUpdate');
    }

    this.test = api.isTest;
  }

  ionViewDidLoad() {
    this.tim();
  }

  tim() {
    if (!this.vis) {
      setTimeout(() => {
        this.ind++;

        if (this.ind === this.indT && !this.vis) {
          this.dismis();
        }
        this.tim();
      }, 1000);
    }
  }

  visNow() {
    this.vis = true;
  }

  dismis() {
    if (this.forceUpdate) {
      this.platform.exitApp();
      this.market.open('rw.co.cogebanque.client');
    } else {
      this.viewCtrl.dismiss(null);
    }
  }

}
