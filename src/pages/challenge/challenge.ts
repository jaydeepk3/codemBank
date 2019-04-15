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
      chacode: '',
      method:'challenge'
	  };

  validatepin = false;

  ret: string;
  forgotData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public api: ApiProvider,public modalCtrl: ModalController) {
      this.forgotData = navParams.get('forgotData');
      console.log(this.forgotData)
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChallengePage');
  }

  ValidateCode()
  	{
      
  		this.ret = '';
      this.validatepin = true;
      console.log('forgotData',this.forgotData);
      //this.data.method='challenge';
      this.data.login=this.forgotData.login;
    //  this.data.chacode = this.forgotData.chacode;
      console.log(this.data);
      let data = JSON.stringify(this.data);
      console.log(data);
	    cordova.plugins.aesEnc(data, this.api.api().key).then((data_) => {
      	this.api.query(data_, null, 'challenge', false).then(data__ => {
	        this.validatepin = false;
          let dt: any = data__;
          console.log(dt)
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
