import { BankServiceMapMarkerPage } from './../bank-service-map-marker/bank-service-map-marker';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;
declare var cordova;

/**
 * Generated class for the BankServiceMapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-bank-service-map',
  templateUrl: 'bank-service-map.html',
})
export class BankServiceMapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  ret: string = '';

  locations: any = [];

  fetching: boolean = true;
  error: boolean = false;
  success: boolean = false;

  service: any;
  user: any;
  test: boolean = true;

  circle: any;

  markers: any = [];

  latLng: any = 'current';
  lat: number = 0;
  lng: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public geolocation: Geolocation, public userProvider: UserProvider, public api: ApiProvider) {
    this.service = navParams.get('service');
    this.user = userProvider.getUser();
    this.test = api.isTest;
  }

  ionViewDidLoad() {
    this.loadMap();

    setTimeout(() => {
      try {
        this.fetchInfo();
      } catch (exc) {
      }
    }, 300);
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((position) => {
      this.showMap(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    }, (err) => {
      this.showMap(new google.maps.LatLng(-1.9432848, 28.7590534));
    });
  }

  showMap(latLng) {
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  addMarker(location: any) {

    let latLng = { lat: location.lattitude * 1, lng: location.longitude * 1 };

    let index = this.markers.length;

    let marker = new google.maps.Marker({
      map: this.map,
      draggable: false,
      animation: null,
      position: latLng,
      loc_: location
    });

    this.markers.push(marker);

    let self = this;

    marker.addListener('click', function () {
      let popover = self.popoverCtrl.create(BankServiceMapMarkerPage, { location: marker.loc_ });
      popover.present();
    });
  }

  latLngChange(event) {
    if (this.latLng !== 'current') {
      let index = this.latLng * 1;
      this.map.panTo(new google.maps.LatLng(this.locations[index].lattitude * 1, this.locations[index].longitude * 1));
      this.showCircle(this.locations[index].lattitude * 1, this.locations[index].longitude * 1);
    } else {
      this.geolocation.getCurrentPosition().then((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        this.showCircle(position.coords.latitude, position.coords.longitude);
      }, (err) => {
        this.map.panTo(new google.maps.LatLng(-1.9432848, 28.7590534));
      });
    }
  }

  showCircle(lat, lng) {
    try {
      this.circle.setMap(null);
    } catch (exc) {

    }
    this.circle = new google.maps.Circle({
      strokeColor: '#cf7c34',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#cf7c34',
      fillOpacity: 0.35,
      map: this.map,
      center: { lat: lat, lng: lng },
      radius: 50
    });
  }

  nearestLocation() {
    var pi = Math.PI;
    var R = 6371;
    var distances = [];
    var closest = -1;

    for (var i = 0; i < this.markers.length; i++) {
      var lat2 = this.markers[i].loc_.lattitude * 1;
      var lon2 = this.markers[i].loc_.longitude * 1;

      var chLat = lat2 - this.lat;
      var chLon = lon2 - this.lng;

      var dLat = chLat * (pi / 180);
      var dLon = chLon * (pi / 180);

      var rLat1 = this.lat * (pi / 180);
      var rLat2 = lat2 * (pi / 180);

      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;

      distances[i] = d;
      if (closest == -1 || d < distances[closest]) {
        closest = i;
      }
    }

    this.map.panTo(new google.maps.LatLng(this.markers[closest].loc_.lattitude * 1, this.markers[closest].loc_.longitude * 1));
    this.showCircle(this.markers[closest].loc_.lattitude * 1, this.markers[closest].loc_.longitude * 1)
  }

  fetchInfo() {
    this.fetching = true;
    this.error = false;

    let data = JSON.stringify({
      "accid": this.user.accid,
      "metode": "bankservcheck",
      "debitaccount": '',
      "sdate": '',
      "edate": '',
      "email": '',
      "utilityid": this.service.bankserviceid,
      "reason": '',
      "branch": ''
    });

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      this.api.query(data_, this.user, 'bankservcheck', false).then(data__ => {
        this.fetching = false;

        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data___) => {
            let ab: any = JSON.parse(data___);

            if ('' + ab.utilcheck.retdata.status === '0') {
              let accts: any = JSON.parse(ab.utilcheck.retdata.message);

              this.locations = [];
              this.markers = [];
              let i = 0;
              for (var acct in accts.locations) {
                let location: any = accts.locations[acct].location;
                this.locations.push(location);
                setTimeout(() => {
                  this.addMarker(location);
                }, i * 300);
                i++;
              }

              if (this.locations.length === 0) {
                this.ret = "No locations";
              }

              this.success = true;
            } else {
              this.error = true;
              this.ret = ab.utilcheck.retdata.message;
            }
          }).catch((err) => {
            this.ret = 'Unknown error!';
            this.error = true;
          });
        } else {
          if (dt.kbankResponse.retcode === 400) {
            //alleluia
          } else if (dt.kbankResponse.retcode < 606) {
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
        this.fetching = false;
        this.ret = 'An error occurred!';
        this.error = true;
      });
    }).catch((err) => {
      this.fetching = false;
      this.ret = 'Unknown error!';
      this.error = true;
    });
  }

  logOut() {
    this.userProvider.logOut();
  }

}
