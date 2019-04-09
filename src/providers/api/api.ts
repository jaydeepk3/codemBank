import { AppVersion } from '@ionic-native/app-version';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Device } from '@ionic-native/device/ngx';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ApiProvider {

  //private api = 'https://ebanking.cogebanque.co.rw:8443/';
  //public api = 'http://wallet.ev.rw/';

  public isTest = true;

  public api = () => {
    return {
      url: this.isTest ? 'http://wallet.ev.rw/' : 'https://ebanking.cogebanque.co.rw:8443/',
      isTest: this.isTest,
      key: '2aadf6440fa96846',
      iv: '2aadf6440fa96846'
    };
  };
  IMEI: string;

  public setTest(isTest_: boolean) {
    this.isTest = isTest_;
  }

  private data_: any;
  private kAuth: string;

  constructor(public http: Http,
    private storage: Storage,
    private uid: Uid,
    private androidPermissions: AndroidPermissions,
    private device: Device,
    private appVersion: AppVersion) {
   // this.getImei();
  //  console.log('Device UUID is: ' + this.device.uuid);
  }

  getLink() {
    return this.api().url;
  }

  // getImei(): Promise<boolean> {
  //   return new Promise(resolve => {

  //     console.log('android')
  //     this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(authorised => {
  //       console.log(authorised)
  //       if (authorised) {
  //         console.log('if')
  //         resolve(true);
  //       }
  //       else {
  //         console.log('else')
  //         this.androidPermissions.requestPermission(
  //           this.androidPermissions.PERMISSION.READ_PHONE_STATE
  //         ).then(authorisation => {
  //           console.log('authorisation')
  //           console.log(authorisation);
  //          // console.log(this.uid.IMEI);
  //           // this.IMEI = this.uid.IMEI;
  //         }, err => {
  //           console.log(err);
  //         });
  //       }
  //     });

  //   });
  // }



  query(data: string, user: any, name: string, cache: boolean) {
    return new Promise(resolve => {
      this.storage.get('registrationId').then((val) => {
        this.kAuth = val;

        let headers = new Headers();

        this.appVersion.getVersionNumber().then(version => {
          console.log('App-Version', version)
          headers.append('App-Version', version);
        });
        console.log('K-Auth', this.kAuth)
        headers.append('K-Auth', this.kAuth);
        this.storage.get('imeiNumber').then((imeiNumber) => {
          headers.append('devid', imeiNumber);
       });
        //  headers.append('Devid', cordova.plugin.uid.IMEI);
        headers.append('Content-Type', 'application/json');
        console.log(headers)
        let json_ = '{"kbankRequest":{"' + (user === null ? 'method' : 'login') + '":"' + (user === null ? 'auth' : user.login) + '","ibintu":' + JSON.stringify(data) + '}}';

        if (name === 'getprovinces' || name === 'getdistricts' || name === 'getsectors' || name === 'walletopen' || name === 'logout' || name === 'checksession' || name === 'splash' || name === 'forgotpin' || name === 'challenge') {
          json_ = '{"kbankRequest":{"method":"' + name + '","ibintu":' + JSON.stringify(data) + '}}';
        }

        let json = JSON.parse(json_);
        console.log(json)
        this.storage.get(name).then((val) => {
          let v = val;

          if (v !== null) {
            let va = JSON.parse(v);

            if (va.key_ !== user.rkey) {
              v = null;
            }
          }

          if (v === null || !cache) {
            console.log(this.api().url, json, { headers: headers })
            this.http.post(this.api().url, json, { headers: headers })
              .map(res => res.json())
              .subscribe(d => {
                this.data_ = d;
                if (cache) {
                  this.data_.key_ = user.rkey;
                  this.storage.set(name, JSON.stringify(this.data_));
                }
                resolve(d);
              }, error => {
                this.data_ = null;
                resolve(null);
                //  alert(error.message);
                console.error(error);
                console.log(error.message);
                console.log(error);
              });
          } else {
            resolve(JSON.parse(val));
          }
        });
      });
    });
  }

  data() {
    return this.data_;
  }



}
