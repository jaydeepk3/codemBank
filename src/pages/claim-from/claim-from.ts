import { DateProvider } from './../../providers/date/date';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,AlertController,LoadingController } from 'ionic-angular';
import { SelectAccount } from './../select-account/select-account';
import { AlertSuccessPage } from './../alert-success/alert-success';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';

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
	    claimDate: '',
	    amount: '',
	    description: '',
	  };

	validataing:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public userProvider: UserProvider, public api: ApiProvider,public date: DateProvider,public alertCtrl: AlertController,public loadingCtrl: LoadingController) {
  	this.user = userProvider.getUser();
	this.test = api.isTest;
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 7000);
    console.log('ionViewDidLoad ClaimFromPage');
  }
  claimSubmit()
  {
  	let prompt = this.alertCtrl.create({
            title: 'Enter Pin',
            inputs: [{
                name: 'pin',
                placeholder:"Enter Pin...",
                type:"number"
            }],
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                      this.data.account='';
                      this.data.channel='';
                      this.data.claimDate='';
                      this.data.amount='';
                      this.data.description='';
                    }
                },
                {
                    text: 'Submit',
                    handler: data => {
                      this.data.account='';
                      this.data.channel='';
                      this.data.claimDate='';
                      this.data.amount='';
                      this.data.description='';

                        this.successModal = this.modalCtrl.create(AlertSuccessPage, {
                          title: 'Claim',
                          message: "Claim Successfully Submited"
                        });
                        setTimeout(() => {
                          this.successModal.present();
                        }, 300);
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
    this.date.show(this.data.claimDate).then(date => {
      if (date !== null) {
        this.data.claimDate = date;
      }
    });
  }
  logOut() {
    this.userProvider.logOut();
  }
}
