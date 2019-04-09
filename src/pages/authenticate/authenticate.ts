import { UserProvider } from './../../providers/user/user';
import { AdvertPage } from './../advert/advert';
import { NewToTheAppPage } from './../new-to-the-app/new-to-the-app';
import { OpenWalletAccountPage } from './../open-wallet-account/open-wallet-account';
import { ApiProvider } from './../../providers/api/api';
import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events, NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { ForgotPinPage } from './../forgot-pin/forgot-pin';

declare var cordova: any;

/**
 * Generated class for the Authenticate page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-authenticate',
  templateUrl: 'authenticate.html'
})
export class Authenticate {

  login: string;
  pass: string;

  authenticating = false;

  private key: string = '2aadf6440fa96846';
  private iv: string = '2aadf6440fa96846';

  ret: string = "";

  vis: boolean = false;

  user: any = null;

  test: boolean = true;
  cunt = 1;
  idleState: string = 'not start';
  fetching: boolean = false;
  constructor(private zone: NgZone, public storage: Storage, public events: Events, public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public viewCtrl: ViewController, public api: ApiProvider, public userProvider: UserProvider, public alertCtrl: AlertController) {
    this.test = api.isTest;
    storage.get('user_login').then(userStr => {
      if (userStr !== null) {
        this.user = JSON.parse(userStr);
      }
    });
    //  this.getSplashImg();
  }

  ionViewDidLoad() {
    let advert = this.modalCtrl.create(AdvertPage);
    advert.present();
  
    setTimeout(() => {
      this.vis = true;
    }, 1200);
  }

  eventHandler($event) {

  }

  hideModal() {
    let data = { 'foo': 'bar', 'signedIn': false };
    this.viewCtrl.dismiss(data);
  }

  notUser() {
    this.user = null;
    this.login = '';
    this.pass = '';
  }

  authenticateUser() {
    this.login = this.user.phone;
    this.authenticate();
  }

  pinChange() {
    if (this.pass.length === 6) {
      this.authenticateUser();
    }
  }

  pinChange_() {
    if (this.pass.length === 6) {
      this.authenticate();
    }
  }

  authenticate() {
    this.authenticating = true;
    let data = JSON.stringify({ "pass": btoa(this.pass), "login": this.login, 'method': 'login' });
    console.log(data);
    console.log(this.key);
  //  this.api.getImei().then(imei => {
  //    console.log(imei)
      cordova.plugins.aesEnc(data, this.key).then((data_) => {
        this.api.query(data_, null, 'login', false).then(data__ => {
          this.authenticating = false;
          let dt: any = data__;
          if (dt.kbankResponse.retcode === 0) {
            cordova.plugins.aesDec(dt.kbankResponse.reply, this.key).then((data___) => {

              let coge: any = JSON.parse(data___);

              coge.signedIn = true;

              this.events.publish('user:auth', coge, Date.now());

              this.navCtrl.popToRoot();
            }).catch((err) => {
              this.ret = 'Unknown error!';
            });
          } else {
            this.ret = dt.kbankResponse.reply;
          }

        }).catch(error => {
          this.authenticating = false;
          this.ret = 'An error occurred!';
        });
      }).catch((err) => {
        this.authenticating = false;
        this.ret = 'Unknown error!';
    //  });
  })
  }

  showRegister() {
    this.navCtrl.push(OpenWalletAccountPage);
  }



  open() {
    this.navCtrl.push(OpenWalletAccountPage);
  }

  register() {
    this.navCtrl.push(NewToTheAppPage);
  }
  forgotPin() {
    this.navCtrl.push(ForgotPinPage);
  }
}
