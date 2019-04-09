import { UserProvider } from './../../providers/user/user';
import { AdvertPage } from './../advert/advert';
import { NewToTheAppPage } from './../new-to-the-app/new-to-the-app';
import { OpenWalletAccountPage } from './../open-wallet-account/open-wallet-account';
import { ApiProvider } from './../../providers/api/api';
import { Component, NgZone,ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events, NavController, NavParams, ViewController, ModalController,AlertController } from 'ionic-angular';
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
  pass: any;

  p1:string='';
  p2:string='';
  p3:string='';
  p4:string='';
  p5:string='';
  p6:string='';

  authenticating = false;

  private key: string = '2aadf6440fa96846';
  private iv: string = '2aadf6440fa96846';

  ret: string = "";

  vis: boolean = false;

  user: any = null;

  test: boolean = true;
  cunt = 1;

  fetching: boolean = false;
  textClass_:string;

  @ViewChild('pass1') pass1:any;
  @ViewChild('pass2') pass2:any;
  @ViewChild('pass3') pass3:any;
  @ViewChild('pass4') pass4:any;
  @ViewChild('pass5') pass5:any;
  @ViewChild('pass6') pass6:any;

   p1Color:any;
   p2Color:any;
   p3Color:any;
   p4Color:any;
   p5Color:any;
   p6Color:any;

  constructor(private zone: NgZone, public storage: Storage, public events: Events, public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public viewCtrl: ViewController, public api: ApiProvider, public userProvider: UserProvider,public alertCtrl: AlertController) {
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
    console.log(this.pass1);
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
  onKeyUp(e,t){
   switch (t) {
      case 1:
        this.p1Color="textClassChange";
        this.pass2.setFocus();
        this.pass += this.p1;
        console.log(this.pass);
        break;
      case 2:
        this.p2Color="textClassChange";
        this.pass3.setFocus();
        this.pass += this.p2;
        console.log(this.pass);
        break;
      case 3:
        this.p3Color="textClassChange";
        this.pass4.setFocus();
        this.pass += this.p3;
        console.log(this.pass);
        break;
      case 4:
        this.p4Color="textClassChange";
        this.pass5.setFocus();
        this.pass += this.p4;
        console.log(this.pass);
        break;
      case 5:
        this.p5Color="textClassChange";
        this.pass6.setFocus();
        this.pass += this.p5;
        console.log(this.pass);
        break;
      case 6:
        this.p6Color="textClassChange";
        this.pass += this.p6;
        console.log(this.pass);
        this.authenticate();
        break;
    }

  }
  pinChange_() {
  }

  authenticate() {
    this.authenticating = true;
        this.p1Color="textClass";

        this.p2Color="textClass";

        this.p3Color="textClass";

        this.p4Color="textClass";

        this.p5Color="textClass";

        this.p6Color="textClass";
        console.log(parseInt(this.pass));
    let data = JSON.stringify({ pass: btoa(this.pass), "login": this.login });
    console.log(data);
    console.log(this.key);
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
    });
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
  forgotPin()
  {
    this.navCtrl.push(ForgotPinPage);
  }
}
