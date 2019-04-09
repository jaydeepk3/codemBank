import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { Events, ModalController, NavController, NavParams } from 'ionic-angular';

import { UserProvider } from './../../providers/user/user';
import { AlertSuccessPage } from './../alert-success/alert-success';
import { SelectAccount } from './../select-account/select-account';
import { SelectBeneficialPage } from './../select-beneficial/select-beneficial';
import { UtilityVerifyPage } from './../utility-verify/utility-verify';

declare var cordova: any;

/**
 * Generated class for the UtilityPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-utility',
  templateUrl: 'utility.html',
})
export class UtilityPage {

  selectAccountModal;
  confirmUtilityModal;
  successModal;
  selectBeneficialModal;

  util: any;

  sourceAccount: any = {
    account: ''
  };

  beneficial: any = {
    name: ''
  };

  numberType: string = 'other';

  creditaccount: string = '';
  amount: number = 0;
  saveBenef: boolean = false;
  benefName: string = '';
  benPhone: string = '';

  user: any;

  test: boolean = true;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public userProvider: UserProvider, public api: ApiProvider) {
    this.util = navParams.get('util');
    this.user = userProvider.getUser();
    this.selectBeneficialModal = modalCtrl.create(SelectBeneficialPage, { message: 'Select beneficiary', utilityID: this.util.utilityid, u: true });
    this.test = api.isTest;
  }

  ionViewDidLoad() {
    this.typeChange(null);
  }

  typeChange($event) {
    try {
      if (this.numberType === 'own' && this.util.utilityid === '2') {
        this.creditaccount = this.user.phone;
      }
    } catch (exc) {

    }
  }

  selectAccount(i) {
    this.selectAccountModal = this.modalCtrl.create(SelectAccount, { message: 'Select the source account', action: 'trxlist' });

    this.selectAccountModal.onDidDismiss(data => {
      if (data !== null) {
        this.sourceAccount = data.account;
      }
    });

    setTimeout(() => {
      this.selectAccountModal.present();
    }, 300);
  }

  selectBeneficial() {
    this.selectBeneficialModal.onDidDismiss(data => {
      if (data !== null) {
        this.beneficial = data.beneficial;
        this.creditaccount = data.beneficial.account;
        if (this.util.benphone === 'Y') {
          this.benPhone = data.benphone;
        }
      }
    });

    this.selectBeneficialModal.present();
  }

  continue() {

    this.confirmUtilityModal = this.modalCtrl.create(UtilityVerifyPage, {
      data: {
        sourceAccount: this.sourceAccount,
        creditaccount: this.creditaccount,
        amount: this.amount,
        util: this.util,
        beneficial: this.beneficial,
        saveben: this.saveBenef ? 'Y' : 'N',
        benefName: this.benefName,
        saveBenef: this.saveBenef,
        benPhone: this.benPhone,
        numberType: this.numberType
      }
    });

    this.confirmUtilityModal.onDidDismiss(data => {
      if (data === null) {

      } else {
        this.showSuccess(data);
      }
    });

    setTimeout(() => {
      this.confirmUtilityModal.present();
    }, 300);
  }

  showSuccess(data: any) {
    this.successModal = this.modalCtrl.create(AlertSuccessPage, {
      title: this.util.name,
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
