import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AdvertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-advert',
  templateUrl: 'advert.html',
})
export class AdvertPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {

  }

  close() {
    this.viewCtrl.dismiss();
  }

}
