import { AlertSuccessPage } from './../alert-success/alert-success';
import { BankServiceVerifyPage } from './../bank-service-verify/bank-service-verify';
import { SelectBranchPage } from './../select-branch/select-branch';
import { SelectAccount } from './../select-account/select-account';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { NavController, NavParams, Events, ModalController } from 'ionic-angular';

/**
 * Generated class for the BankServicePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-bank-service',
  templateUrl: 'bank-service.html',
})
export class BankServicePage {

  selectAccountModal;
  selectBranchModal;
  confirmServiceModal;
  successModal;

  account: any = {
    account: ''
  };

  branch: any = {
    name: ''
  };

  service: any;
  user: any;
  test: boolean = true;

  email: string = '';
  reason: string = '';

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public userProvider: UserProvider, public api: ApiProvider) {
    this.service = navParams.get('service');
    this.user = userProvider.getUser();
    this.test = api.isTest;
    this.email = this.user.email;
  }

  ionViewDidLoad() {

  }

  selectAccount(i) {
    this.selectAccountModal = this.modalCtrl.create(SelectAccount, { message: 'Select the account', action: 'trxlist' });

    this.selectAccountModal.onDidDismiss(data => {
      if (data !== null) {
        this.account = data.account;
      }
    });

    setTimeout(() => {
      this.selectAccountModal.present();
    }, 300);
  }

  selectBranch(i) {
    this.selectBranchModal = this.modalCtrl.create(SelectBranchPage, { message: 'Select a branch' });

    this.selectBranchModal.onDidDismiss(data => {
      if (data !== null) {
        this.branch = data.branch;
      }
    });

    setTimeout(() => {
      this.selectBranchModal.present();
    }, 300);
  }

  continue() {

    this.confirmServiceModal = this.modalCtrl.create(BankServiceVerifyPage, {
      data: {
        debitaccount: this.account,
        email: this.email,
        sdate: '',
        edate: '',
        reason: this.reason,
        service: this.service,
        branch: this.branch
      }
    });

    this.confirmServiceModal.onDidDismiss(data => {
      if (data === null) {

      } else {
        this.showSuccess(data);
      }
    });

    setTimeout(() => {
      this.confirmServiceModal.present();
    }, 300);
  }

  showSuccess(data: any) {
    this.successModal = this.modalCtrl.create(AlertSuccessPage, {
      title: this.service.name,
      message: data.utilreturn
    });

    this.successModal.onDidDismiss(data => {
      this.navCtrl.parent.select(0);
      this.navCtrl.popToRoot();
    });

    setTimeout(() => {
      this.successModal.present();
    }, 300);
  }

  logOut() {
    this.userProvider.logOut();
  }

}
