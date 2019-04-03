import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { AlertSuccessPage } from './../alert-success/alert-success';

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

	data: any = {
	    phone: '',
	    accountnumber: '',
	    nid: '',
	    cardno: '',
	    lstamount: '',
	  };

  forgotpin = false;

  ret: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public modalCtrl: ModalController, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPinPage');
  }

  	forgotPin()
  	{
  		this.ret = '';
	    this.forgotpin = true;

	    let data = JSON.stringify(this.data);
	    cordova.plugins.aesEnc(data, this.api.api().key).then((data_) => {
      	this.api.query(data_, null, 'walletopen', false).then(data__ => {
	        this.forgotpin = false;
	        let dt: any = data__;
	        if (dt.kbankResponse.retcode === 0) {
	          cordova.plugins.aesDec(dt.kbankResponse.reply, this.api.api().key).then((data___) => {

	            let coge: any = JSON.parse(data___);
	            this.showSuccess(coge);
	          }).catch((err) => {
	            this.ret = 'Unknown error!';
	          });
	        } else {
	          this.ret = dt.kbankResponse.reply;
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
      title: 'Otp Change Sucess',
      message: data.transreturn
    });

    this.successModal.onDidDismiss(data => {
      this.hideModal();
    });

    setTimeout(() => {
      this.successModal.present();
    }, 300);
  }

  hideModal() {
    this.navCtrl.pop();
  }
}
