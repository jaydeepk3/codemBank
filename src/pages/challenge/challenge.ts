import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { AlertSuccessPage } from './../alert-success/alert-success';
import { Authenticate } from './../authenticate/authenticate';



declare var cordova: any;


/**
 * Generated class for the ChallengePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-challenge',
  templateUrl: 'challenge.html',
})
export class ChallengePage {

	successModal;

	data: any = {
	    chacode: ''
	  };

  validatepin = false;

  ret: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public api: ApiProvider,public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChallengePage');
  }

  ValidateCode()
  	{
  		this.ret = '';
	    this.validatepin = true;
      this.data.method="challenge";
      this.data.login="kaneza123";
	    let data = JSON.stringify(this.data);
	    cordova.plugins.aesEnc(data, this.api.api().key).then((data_) => {
      	this.api.query(data_, null, 'challenge', false).then(data__ => {
	        this.validatepin = false;
	        let dt: any = data__;
          this.navCtrl.popToRoot();
	      }).catch(error => {
	        this.validatepin = false;
	        this.ret = 'An error occurred!';
	      });
	    }).catch((err) => {
	      this.validatepin = false;
	      this.ret = 'Unknown error!';
	    });
	}

  showSuccess(data: any) {
    this.successModal = this.modalCtrl.create(AlertSuccessPage, {
      title: 'Message',
      message: "Validate Success"
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
