import { Events, LoadingController, ToastController } from 'ionic-angular';
import { ApiProvider } from './../api/api';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

declare var cordova: any;

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserProvider {

  user: any = null;
  logOutLoader;

  constructor(public http: Http, public storage: Storage, public api: ApiProvider, public events: Events, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    this.fetchUser();
    this.logOutLoader = this.loadingCtrl.create({
      content: "Logging you out..."
    });
  }

  fetchUser() {
    this.storage.get('user').then((val) => {
      if (val !== null) {
        this.user = JSON.parse(val);
      } else {
        this.user = null;
      }
    });
  }

  setUser(user: any) {
    this.user = user;
    this.storage.set('user', JSON.stringify(user));
    if (user !== null) {
      this.storage.set('user_login', JSON.stringify({ login: user.login, phone: user.phone, name: user.company }));
    }
  }

  getUser() {
    return this.user;
  }

  logOut() {
    this.logOutLoader.present();

    let data = JSON.stringify({ "login": this.user.login });

    cordova.plugins.aesEnc(data, this.api.api().key).then((data_) => {
      this.api.query(data_, null, 'logout', false).then(data__ => {
        this.logOutLoader.dismiss();
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.api.api().key).then((data___) => {
            //this.logOutSuccess('Logged out successfully!');
            this.events.publish('user:auth', null, Date.now());
          }).catch((err) => {
            this.logOutError('Unknown error!');
          });
        } else {
          //this.logOutError(dt.kbankResponse.reply);
          //this.logOutSuccess('Logged out successfully!');
          this.events.publish('user:auth', null, Date.now());
        }

      }).catch(error => {
        this.logOutLoader.dismiss();
        //this.logOutError('An error occurred!');
        this.events.publish('user:auth', null, Date.now());
      });
    }).catch((err) => {
      this.logOutLoader.dismiss();
      this.logOutError('Unknown error!');
    });
  }

  logOutError(t) {
    let logOutError_ = this.toastCtrl.create({
      message: t + ' Couldn\'t log you out. Retry again.',
      duration: 7000,
      position: 'top'
    });

    logOutError_.present();
  }

  logOutSuccess(t) {
    let logOutSuccess_ = this.toastCtrl.create({
      message: t,
      duration: 7000,
      position: 'top'
    });

    logOutSuccess_.present();
  }

  checkSession() {
    return new Promise(resolve => {
      if (this.user !== null) {

        let data = JSON.stringify({ "login": this.user.login });

        cordova.plugins.aesEnc(data, this.api.api().key).then((data_) => {
          this.api.query(data_, null, 'checksession', false).then(data__ => {

            let dt: any = data__;

            //alert(JSON.stringify(dt));

            if (dt.kbankResponse.retcode !== 0) {
              this.events.publish('user:auth', null, Date.now());
            } else {
              // cordova.plugins.aesDec(dt.kbankResponse.reply, this.api.api().key).then((data___) => {
              //   this.logOutSuccess(data___);
              // }).catch((err) => {
              //   this.logOutError('Unknown error!');
              // });
            }

            resolve(1);

          }).catch(error => {
            resolve(1);
            this.events.publish('user:auth', null, Date.now());
          });
        }).catch((err) => {
          resolve(1);
          this.events.publish('user:auth', null, Date.now());
        });
      } else {
        resolve(1);
      }
    });
  }

}
