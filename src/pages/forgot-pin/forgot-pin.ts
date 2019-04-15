import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { AlertSuccessPage } from './../alert-success/alert-success';
import { ChallengePage } from './../challenge/challenge';
// import { SMS } from '@ionic-native/sms';

declare var cordova: any;
/**
 * Generated class for the ForgotPinPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot-pin',
  templateUrl: 'forgot-pin.html',
})
export class ForgotPinPage {
	successModal;
  private key: string = '2aadf6440fa96846';

	data: any = {
	    phone: '',
	    account: '',
	    nid: '',
	    card: '',
	    amount: '',
	  };

  forgotpin = false;

  ret: string;
  dt: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public modalCtrl: ModalController, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPinPage');
  }

  	forgotPin()
  	{
  		this.ret = '';
	    this.forgotpin = true;
	    this.data.method="forgotpin";

	    let data = JSON.stringify(this.data);
	    
	    cordova.plugins.aesEnc(data, this.api.api().key).then((data_) => {
      	this.api.query(data_, null, 'forgotpin', false).then(data__ => {
	        this.forgotpin = false;
          // this.dt = JSON.stringify(data__);
	        this.dt = data__;
          if (this.dt.kbankResponse.retcode === 0) {
            cordova.plugins.aesDec(this.dt.kbankResponse.reply, this.key).then((data___) => {
              let coge: any = JSON.parse(data___);
						console.log(coge);
						console.log(coge['transreturn'].phone,'Your charcode is here '+coge['transreturn'].chacode);
            // this.sms.send(coge['transreturn'].phone,'Your charcode is here '+coge['transreturn'].chacode).then(data=>console.log('SMS sent'), err=>{
						// 	console.log(err)
						// })
							this.navCtrl.push(ChallengePage,{forgotData:coge['transreturn']});
            }).catch((err) => {
              this.ret = 'Unknown error!';
            });
          }
          else{
            this.ret = this.dt.kbankResponse.reply;
          }
	      }).catch(error => {
	        this.forgotpin = false;
	        this.ret = 'An error occurred!';
	      });
	    }).catch((err) => {
	      this.forgotpin = false;
	      this.ret = 'Unknown error!';
	    });
	}

  showSuccess(data: any) {
    this.successModal = this.modalCtrl.create(AlertSuccessPage, {
      title: 'Message',
      message: "Challenge Code Send Successfully"
    });

    this.successModal.onDidDismiss(data => {
      	this.hideModal();
    	this.navCtrl.push(ChallengePage);
    });

    setTimeout(() => {
      this.successModal.present();
    }, 300);
  }

  hideModal() {
    this.navCtrl.pop();
  }
}
