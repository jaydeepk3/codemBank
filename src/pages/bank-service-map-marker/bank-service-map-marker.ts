import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the BankServiceMapMarkerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-bank-service-map-marker',
  templateUrl: 'bank-service-map-marker.html',
})
export class BankServiceMapMarkerPage {

  location: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public iab: InAppBrowser) {
    this.location = navParams.get('location');
  }

  ionViewDidLoad() {

  }

  openInMaps() {
    this.iab.create('https://www.google.com/maps/place/' + this.location.lattitude + ',' + this.location.longitude, '_system', 'location=yes');
  }

}
