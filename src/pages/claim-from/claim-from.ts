import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,AlertController } from 'ionic-angular';
import { SelectAccount } from './../select-account/select-account';
import { AlertSuccessPage } from './../alert-success/alert-success';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { DateProvider } from './../../providers/date/date';

declare var cordova: any;
/**
 * Generated class for the ClaimFromPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-claim-from',
  templateUrl: 'claim-from.html',
})
export class ClaimFromPage {
	selectAccountModal;
	successModal;
	user: any;
	test: boolean = true;
	data: any = {
	    account: '',
	    channel: '',
	    date: '',
	    amount: '',
	    description: '',
	  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public userProvider: UserProvider, public api: ApiProvider,public date: DateProvider,public alertCtrl: AlertController) {
  	this.user = userProvider.getUser();
	this.test = api.isTest;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimFromPage');
  }
  claimSubmit()
  {
  	let prompt = this.alertCtrl.create({
            title: 'Enter Pin',
            inputs: [{
                name: 'pin',
                placeholder:"Enter Pin..."
            }],
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Submit',
                    handler: data => {

                    }
                }
            ]
        });

        prompt.present();
  }

  selectAccount(i) {
    this.selectAccountModal = this.modalCtrl.create(SelectAccount, { message: i === 0 ? 'Select the transfer source account' : 'Select the beneficiary account', action: i === 0 ? 'trxlist' : 'mytrxlist' });

    this.selectAccountModal.onDidDismiss(data => {
      if (data !== null) {
          this.data = data.account;
      }
    });

    setTimeout(() => {
      this.selectAccountModal.present();
    }, 300);
  }

  selectDate() {
    this.date.show(this.data.dob).then(date => {
      if (date !== null) {
        this.data.date = date;
      }
    });
  }
}
