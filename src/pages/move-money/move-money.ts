import { Component } from '@angular/core';
import { Events, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';

import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { AlertSuccessPage } from './../alert-success/alert-success';
import { MoveMoneyConfirmPage } from './../move-money-confirm/move-money-confirm';
import { SelectAccount } from './../select-account/select-account';
import { SelectBankPage } from './../select-bank/select-bank';
import { SelectBeneficialPage } from './../select-beneficial/select-beneficial';
import { SelectCurrencyPage } from './../select-currency/select-currency';

declare var cordova: any;
declare var accounting;

const PADDING = "000000";

/**
 * Generated class for the MoveMoney page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-move-money',
  templateUrl: 'move-money.html',
})
export class MoveMoney {

  rwf: any = { "name": "FRANC RWANDAIS", "code": "646", "isocode": "RWF", "current": "YES" };

  selectAccountModal;
  selectBeneficialModal;
  selectBankModal;
  selectCurrencyModal;
  confirmTransferModal;
  successModal;

  service: any;

  sourceAccount: any = {
    account: ''
  };

  destinationAccountOwn: any = {
    account: ''
  };

  beneficial: any = {
    name: ''
  };

  destinationBank: any = {
    bankname: '',
    current: 'Yes'
  };

  transferCurrency: any = {
    isocode: ''
  };

  transferType: string = 'own';

  destinationAccount: string = '';
  destinationName: string = '';
  destinationPhone: string = '';
  transferAmount: string = '';
  transferDescription: string = '';

  user: any;
  ret: string = '';

  fetching: boolean = true;
  error: boolean = false;
  defGot: boolean = false;

  test: boolean = true;

  constructor(public toastCtrl: ToastController, public events: Events, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public userProvider: UserProvider, public api: ApiProvider) {
    this.service = navParams.get('service');
    this.user = userProvider.getUser();
    this.selectBeneficialModal = modalCtrl.create(SelectBeneficialPage, { message: 'Select beneficiary', utilityID: 0, u: false });
    this.selectBankModal = modalCtrl.create(SelectBankPage, { message: 'Select the receiving bank' });
    this.selectCurrencyModal = modalCtrl.create(SelectCurrencyPage, { message: 'Select the transfer currency' });
    this.test = api.isTest;
  }

  ionViewDidLoad() {
    this.getDefaultAccount();
  }

  onAmountChange(ev) {
    this.transferAmount = this.transform('' + this.transferAmount);
  }

  transform(value: string): string {
    return accounting.formatMoney(0 + value.replace(',', ''), "", 2, ".", ",");
  }

  parse(value: string, fractionSize: number = 2): string {
    return value.replace(',', '');
  }

  getDefaultAccount() {
    let self = this;

    cordova.plugins.aesEnc(JSON.stringify({ "metode": "trxlist", "accid": this.user.accid }), this.user.rkey).then((data_) => {
      self.api.query(data_, self.user, 'trxlist', false).then(data__ => {
        self.defGot = true;
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {
            let accts: any = JSON.parse(data___);
            for (var acct in accts.accounts) {
              self.sourceAccount = accts.accounts[acct].account;
              self.typeChange(null);
              break;
            }
          }).catch((err) => {

          });
        } else {
          if (dt.kbankResponse.retcode < 606) {
            this.userProvider.logOut();
          }
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data___) => {
          }).catch((err) => {
          });
        }

      }).catch(error => {
        self.defGot = true;
      });
    }).catch((err) => {
      self.defGot = true;
    });
  }

  getDefaultCurrency(code) {
    let self = this;
    cordova.plugins.aesEnc(JSON.stringify({ "metode": "listcurrencies", "accid": this.user.accid }), this.user.rkey).then((data) => {
      self.api.query(data, self.user, 'listcurrencies', true).then(data_ => {
        let dt: any = data_;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data__) => {
            let accts: any = JSON.parse(data__);

            for (var acct in accts.currencies) {
              if (accts.currencies[acct].currency.code === code) {
                self.transferCurrency = accts.currencies[acct].currency;
              }
            }
          }).catch((err) => { })
        } else {
          if (dt.kbankResponse.retcode < 606) {
            this.userProvider.logOut();
          }
          self.getDefaultCurrency(code);
        }
      });
    }).catch((error) => {
      self.getDefaultCurrency(code);
    });
  }

  beneficialNameChange(ev: any) {
    this.destinationPhone = this.beneficial.benphone;
  }

  typeChange(ev: any) {
    if ((this.transferType === 'other' && this.destinationBank.bankname === '') || this.transferType === 'mob') {
      let self = this;
      cordova.plugins.aesEnc(JSON.stringify({ "metode": "bankslist", "accid": this.user.accid }), this.user.rkey).then((data) => {
        self.api.query(data, self.user, 'bankslist', true).then(data_ => {
          let dt: any = data_;
          if (dt.kbankResponse.retcode === 0) {
            cordova.plugins.aesDec(dt.kbankResponse.reply, self.user.rkey).then((data__) => {
              let accts: any = JSON.parse(data__);

              for (var acct in accts.banks) {
                if ((self.transferType !== 'mob' && accts.banks[acct].bank.current.toLowerCase() === 'yes') || (self.transferType === 'mob' && accts.banks[acct].bank.current.toLowerCase() === 'momo')) {
                  self.destinationBank = accts.banks[acct].bank;
                }
              }

              if (self.destinationBank.current === 'No' || self.transferType === 'mob') {
                self.getDefaultCurrency('646');
              }
            }).catch((err) => { })
          } else {
            if (dt.kbankResponse.retcode < 606) {
              this.userProvider.logOut();
            }
            self.typeChange(ev);
          }
        });
      }).catch((error) => {
        self.typeChange(ev);
      });
    }
  }

  selectAccount(i) {
    this.selectAccountModal = this.modalCtrl.create(SelectAccount, { message: i === 0 ? 'Select the transfer source account' : 'Select the beneficiary account', action: i === 0 ? 'trxlist' : 'mytrxlist' });

    this.selectAccountModal.onDidDismiss(data => {
      if (data !== null) {
        if (i === 0) {
          this.sourceAccount = data.account;
          this.getDefaultCurrency(data.account.currencycode);
        } else {
          this.destinationAccountOwn = data.account;
        }
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
      }
    });

    this.selectBeneficialModal.present();
  }

  selectBank() {
    this.selectBankModal.onDidDismiss(data => {
      if (data !== null) {
        this.destinationBank = data.bank;
        if (this.destinationBank.current === 'No') {
          this.getDefaultCurrency('646');
        }
      }
    });

    if (this.transferType !== 'mob') {
      this.selectBankModal.present();
    }
  }

  selectCurrency() {
    this.selectCurrencyModal.onDidDismiss(data => {
      if (data !== null) {
        this.transferCurrency = data.currency;
      }
    });

    if (this.destinationBank.current !== 'No' && this.transferType !== 'mob') {
      this.selectCurrencyModal.present();
    }
  }

  authorize_() {
    let amnt = parseFloat("" + this.transferAmount);

    if (amnt > 0 && this.transferCurrency.isocode.length > 0 && this.transferDescription.length > 0 && this.sourceAccount.account.length > 0) {
      if (this.transferType === 'own' && this.destinationAccountOwn.account.length > 0) {
        this.authorize();
      } else if (this.transferType === 'mob' && this.destinationBank.bankname.length > 0 && this.destinationAccount.length > 0 && this.destinationName.length > 0) {
        this.authorize();
      } else if (this.transferType === 'ben' && this.beneficial.name.length > 0) {
        this.authorize();
      } else if (this.transferType === 'other' && this.destinationBank.bankname.length > 0 && this.destinationAccount.length > 0 && this.destinationName.length > 0) {
        this.authorize();
      } else {
        this.authorize__();
      }
    } else {
      this.authorize__();
    }
  }

  authorize__() {
    const toast = this.toastCtrl.create({
      message: 'All mandatory fields must be filled',
      duration: 7000,
      position: 'bottom',
      showCloseButton: true,
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {

    });

    toast.present();
  }

  authorize() {
    this.confirmTransferModal = this.modalCtrl.create(MoveMoneyConfirmPage, {
      data: {
        sourceAccount: this.sourceAccount,
        destinationAccountOwn: this.destinationAccountOwn,
        beneficial: this.beneficial,
        tt: this.transferType,
        destinationBank: this.destinationBank,
        transferCurrency: this.transferCurrency,
        destinationAccount: this.destinationAccount,
        destinationName: this.destinationName,
        destinationPhone: this.destinationPhone,
        transferAmount: this.transferAmount,
        transferDescription: this.transferDescription,
        currency1: this.transferCurrency.isocode
      }
    });

    this.confirmTransferModal.onDidDismiss(data => {
      if (data === null) {

      } else {
        this.showSuccess(data);
      }
    });

    setTimeout(() => {
      this.confirmTransferModal.present();
    }, 300);
  }

  back() {
    this.navCtrl.parent.select(0);
  }

  showSuccess(data: any) {
    this.successModal = this.modalCtrl.create(AlertSuccessPage, {
      title: 'Move Money',
      message: data.transreturn
    });

    this.successModal.onDidDismiss(data => {
      this.sourceAccount = {
        account: ''
      };

      this.destinationAccountOwn = {
        account: ''
      };

      this.beneficial = {
        name: ''
      };

      this.destinationBank = {
        bankname: '',
        current: 'Yes'
      };

      this.transferCurrency = {
        isocode: ''
      };

      this.transferType = 'own';

      this.destinationAccount = '';
      this.destinationName = '';
      this.destinationPhone = '';
      this.transferAmount = '';
      this.transferDescription = '';


      this.navCtrl.parent.select(0);
    });

    setTimeout(() => {
      this.successModal.present();
    }, 300);
  }

  logOut() {
    this.userProvider.logOut();
  }

}
