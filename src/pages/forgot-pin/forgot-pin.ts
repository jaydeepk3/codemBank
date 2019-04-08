import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { AlertSuccessPage } from './../alert-success/alert-success';
import { ChallengePage } from '../challenge/challenge';

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
			console.log('this data',this.data)
			let data = JSON.stringify(this.data);
			console.log('data',data)
	    cordova.plugins.aesEnc(data, this.api.api().key).then((data_) => {
				console.log('data_',data_)
      	this.api.query(data_, null, 'forgotpin', false).then(data__ => {
					console.log('data__',data__)
	        this.forgotpin = false;
	        let dt: any = data__;
					this.navCtrl.push(ChallengePage);

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
