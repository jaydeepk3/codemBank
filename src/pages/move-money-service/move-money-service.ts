import { SelectCountryPage } from './../select-country/select-country';
import { SelectOperatorPage } from './../select-operator/select-operator';
import { SelectCurrencyPage } from './../select-currency/select-currency';
import { SelectBankPage } from './../select-bank/select-bank';
import { SelectBeneficialPage } from './../select-beneficial/select-beneficial';
import { MoveMoneyConfirmPage } from './../move-money-confirm/move-money-confirm';
import { AlertSuccessPage } from './../alert-success/alert-success';
import { SelectContactPage } from './../select-contact/select-contact';
import { BankServiceVerifyPage } from './../bank-service-verify/bank-service-verify';
import { SelectBranchPage } from './../select-branch/select-branch';
import { SelectAccount } from './../select-account/select-account';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { NavController, NavParams, Events, ModalController, ToastController,AlertController } from 'ionic-angular';
import { Contacts} from '@ionic-native/contacts';

declare var cordova: any;

/**
 * Generated class for the MoveMoneyServicePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-move-money-service',
  templateUrl: 'move-money-service.html',
})
export class MoveMoneyServicePage {

  selectAccountModal;
  selectBeneficialModal;
  selectBankModal;
  selectCurrencyModal;
  selectOperatorModal;
  selectCountryModal;
  confirmTransferModal;
  successModal;

  service: any;
  user: any;
  test: boolean = true;

  contactList =[];

  sourceAccount: any = { account: '' };
  destinationAccount: any = { account: '' };
  amount = ''
  currency: any = { isocode: '' };
  description = '';
  secretquestion = '';
  secretanswer = '';
  beneficial: any = { name: '', benphone: '', email: '' };
  bank: any = { bankname: '', current: 'Yes', banktype: '' };
  operator: any = { name: '', moboperatorid: '', cciso: '' };
  country: any = { name: '', code: '' };
  bens: any = [];
  fetching: boolean = false;
  error: boolean = false;
  ret: string = '';

  constructor(public alertCtrl:AlertController,public toastCtrl: ToastController, public events: Events, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public userProvider: UserProvider, public api: ApiProvider,public contacts: Contacts) {
    this.service = navParams.get('service');

    this.user = userProvider.getUser();
    this.test = api.isTest;
    this.selectBeneficialModal = modalCtrl.create(SelectBeneficialPage, { message: 'Select beneficiary', utilityID: 0, u: false });
    this.selectCountryModal = modalCtrl.create(SelectCountryPage, { message: 'Select country' });
    this.selectBankModal = modalCtrl.create(SelectBankPage, { message: 'Select the receiving bank' });
    this.selectCurrencyModal = modalCtrl.create(SelectCurrencyPage, { message: 'Select the transfer currency' });
    this.selectOperatorModal = modalCtrl.create(SelectOperatorPage, { message: 'Select the receiving operator', movemoneyid: this.service.movemoneyid });
  }

  ionViewDidLoad() {
    if (this.service.movemoneyid === '99') {
      this.fetchBens();
    } else {
      this.typeChange();
    }

    if (this.service.banktype === 'M') {
      this.beneficial.benphone = this.user.phone;
    }

      this.contacts.find(
        ["displayName", "phoneNumbers","photos"],
        {multiple: true, hasPhoneNumber: true}
        ).then((contacts) => {
          for (var i=0 ; i < contacts.length; i++){
            if(contacts[i].displayName !== null) {
              var contact = {};
              contact["name"]   = contacts[i].displayName;
              contact["number"] = contacts[i].phoneNumbers[0].value;
              this.contactList.push(contact);
            }
          }
      });
  }

  fetchBens() {
    this.fetching = true;
    this.error = false;

    let data = JSON.stringify({ "metode": "listbenef", "accid": this.user.accid, "utilityid": 0 });

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      this.api.query(data_, this.user, 'listbenef', false).then(data__ => {
        this.fetching = false;
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data___) => {
            let accts: any = JSON.parse(data___);
            this.bens = [];
            for (var acct in accts.beneficiaries) {
              this.bens.push(accts.beneficiaries[acct].beneficiary);
            }

            if (this.bens.length === 0) {
              this.ret = "No beneficiaries";
            }
          }).catch((err) => {
            this.ret = 'Unknown error!';
            this.error = true;
          });
        } else {
          if (dt.kbankResponse.retcode < 606) {
            this.userProvider.logOut();
          }
          this.error = true;
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data___) => {
            this.ret = data___;
          }).catch((err) => {
            this.ret = dt.kbankResponse.reply;
          });
        }

      }).catch(error => {
        this.fetching = false;
        this.ret = 'An error occurred!';
        this.error = true;
      });
    }).catch((err) => {
      this.fetching = false;
      this.ret = 'Unknown error!';
      this.error = true;
    });
  }

  typeChange() {
    if (this.service.banktype === 'B' || this.service.banktype === 'M' || this.service.banktype === 'A' || this.service.banktype === 'P') {
      cordova.plugins.aesEnc(JSON.stringify({ "metode": "bankslist", "accid": this.user.accid }), this.user.rkey).then((data) => {
        this.api.query(data, this.user, 'bankslist', true).then(data_ => {
          let dt: any = data_;
          if (dt.kbankResponse.retcode === 0) {
            cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data__) => {
              let accts: any = JSON.parse(data__);

              for (var acct in accts.banks) {
                if ((this.service.banktype === 'A' && accts.banks[acct].bank.current.toLowerCase() === 'yes') || (this.service.banktype === 'B' && accts.banks[acct].bank.current.toLowerCase() === 'yes') || (this.service.banktype === 'M' && accts.banks[acct].bank.current.toLowerCase() === 'momo') || (this.service.banktype === 'P' && accts.banks[acct].bank.current.toLowerCase() === 'prepaid')) {
                  this.bank = accts.banks[acct].bank;
                }
              }

              if (this.bank.current.toLowerCase() === 'no' || this.service.banktype === 'M') {
                this.getDefaultCurrency('646');
              }
            }).catch((err) => { })
          } else {
            if (dt.kbankResponse.retcode < 606) {
              this.userProvider.logOut();
            }
            this.typeChange();
          }
        });
      }).catch((error) => {
        this.typeChange();
      });
    }
  }

  getDefaultCurrency(code) {
    cordova.plugins.aesEnc(JSON.stringify({ "metode": "listcurrencies", "accid": this.user.accid }), this.user.rkey).then((data) => {
      this.api.query(data, this.user, 'listcurrencies', true).then(data_ => {
        let dt: any = data_;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data__) => {
            let accts: any = JSON.parse(data__);

            for (var acct in accts.currencies) {
              if (accts.currencies[acct].currency.code === code) {
                this.currency = accts.currencies[acct].currency;
              }
            }
          }).catch((err) => { })
        } else {
          if (dt.kbankResponse.retcode < 606) {
            this.userProvider.logOut();
          }
        }
      });
    }).catch((error) => {

    });
  }

  selectAccount(i) {
    this.selectAccountModal = this.modalCtrl.create(SelectAccount, { message: i === 0 ? 'Select the transfer source account' : 'Select the beneficiary account', action: i === 0 ? 'trxlist' : 'mytrxlist' });

    this.selectAccountModal.onDidDismiss(data => {
      if (data !== null) {
        if (i === 0) {
          this.sourceAccount = data.account;
          this.getDefaultCurrency(this.service.banktype === 'M' ? '646' : data.account.currencycode);
        } else {
          this.destinationAccount = data.account;
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
        this.bank.swift = this.beneficial.swift;
        this.bank.bankname = this.beneficial.bankname;
        this.destinationAccount.account = this.beneficial.account;
      }
    });

    this.selectBeneficialModal.present();
  }

  selectBank() {
    this.selectBankModal.onDidDismiss(data => {
      if (data !== null) {
        this.bank = data.bank;
        if (this.bank.current === 'No') {
          this.getDefaultCurrency('646');
        }
      }
    });

    if (this.service.banktype === 'M' || this.service.banktype === 'B') {
      this.selectBankModal.present();
    }
  }

  selectOperator() {
    this.selectOperatorModal.onDidDismiss(data => {
      if (data !== null) {
        this.operator = data.operator;
      }
    });

    this.selectOperatorModal.present();
  }

  selectCountry() {
    this.selectCountryModal.onDidDismiss(data => {
      if (data !== null) {
        this.country = data.country;
      }
    });

    this.selectCountryModal.present();
  }

  selectCurrency() {
    this.selectCurrencyModal.onDidDismiss(data => {
      if (data !== null) {
        this.currency = data.currency;
      }
    });

    if (this.bank.current.toLowerCase() !== 'no' && (this.service.banktype === 'A' || this.service.banktype === 'L' || this.service.banktype === 'B' || this.service.banktype === 'O')) {
      this.selectCurrencyModal.present();
    }
  }

  continue(ben) {
    let data: any = {
      metode: "tsfinfo",
      accid: this.user.accid,
      movemoneyid: this.service.movemoneyid,
      debitaccount: this.sourceAccount.account,
      creditaccount: this.service.banktype === 'M' || this.service.banktype === 'O' ? this.beneficial.benphone : this.destinationAccount.account,
      beneficiary: this.service.banktype === 'A' ? this.destinationAccount.title : this.beneficial.name,
      benphone: this.beneficial.benphone,
      bank: this.bank.swift,
      currency: this.currency.code,
      amount: this.amount,
      description: this.description,
      secretquestion: this.secretquestion,
      secretanswer: this.secretanswer,
      country: this.country.code,
      beneficiaryid: ben !== null ? ben.beneficiaryid : '',
      moboperatorid: this.operator.moboperatorid,
      extras: {
        service: this.service,
        sourceAccount: this.sourceAccount,
        destinationAccount: this.destinationAccount,
        amount: this.amount,
        currency: this.currency,
        description: this.description,
        beneficial: ben !== null ? ben : this.beneficial,
        bank: this.bank

      }
    };

    var res: boolean = true;

    // switch (this.service.movemoneyid) {
    //   case '1':
    //     res = ('' + this.sourceAccount.account).length > 0 && ('' + this.destinationAccount.account).length > 0 && ('' + this.amount).length > 0 && ('' + this.currency.isocode).length > 0 && ('' + this.description).length > 0;
    //     break;
    //   case '2':
    //     res = ('' + this.sourceAccount.account).length > 0 && ('' + this.destinationAccount.account).length > 0 && ('' + this.beneficial.name).length > 0 && ('' + this.amount).length > 0 && ('' + this.currency.isocode).length > 0 /*&& ('' + this.description).length > 0*/;
    //     break;
    //   case '3':
    //     res = ('' + this.sourceAccount.account).length > 0 && ('' + this.beneficial.name).length > 0 && ('' + this.amount).length > 0 && ('' + this.currency.isocode).length > 0 && ('' + this.description).length > 0;
    //     break;
    //   case '4':
    //     res = ('' + this.sourceAccount.account).length > 0 && ('' + this.bank.bankname).length > 0 && ('' + this.destinationAccount.account).length > 0 && ('' + this.beneficial.name).length > 0 && ('' + this.beneficial.benphone).length > 0 && ('' + this.beneficial.email).length > 0 && ('' + this.amount).length > 0 && ('' + this.currency.isocode).length > 0 && ('' + this.description).length > 0;
    //     break;
    //   case '5':
    //     res = ('' + this.sourceAccount.account).length > 0 && ('' + this.destinationAccount.account).length > 0 && ('' + this.beneficial.name).length > 0 && ('' + this.beneficial.benphone).length > 0 && ('' + this.beneficial.email).length > 0 && ('' + this.amount).length > 0 && ('' + this.currency.isocode).length > 0;
    //     break;
    //   case '6':
    //     res = true;
    //     break;
    //   case '7':
    //     res = ('' + this.sourceAccount.account).length > 0 && ('' + this.destinationAccount.account).length > 0 && ('' + this.beneficial.name).length > 0 && ('' + this.operator.name).length > 0 && ('' + this.amount).length > 0 && ('' + this.currency.isocode).length > 0;
    //     break;
    // }

    if (res) {
      this.confirmTransferModal = this.modalCtrl.create(MoveMoneyConfirmPage, { data: data });
      this.confirmTransferModal.onDidDismiss(data => {
        if (data === null) {

        } else {
          this.showSuccess(data);
        }
      });

      setTimeout(() => {
        this.confirmTransferModal.present();
      }, 300);
    } else {
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
  }

  showSuccess(data: any) {
    this.successModal = this.modalCtrl.create(AlertSuccessPage, {
      title: 'Move Money',
      message: data.transreturn
    });

    this.successModal.onDidDismiss(data => {
      this.sourceAccount = { account: '' };
      this.destinationAccount = { account: '' };
      this.amount = ''
      this.currency = { isocode: '' };
      this.description = '';
      this.beneficial = { name: '', benphone: '', email: '' };
      this.bank = { bankname: '' };

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
  selectContacts(){
    this.contacts.pickContact().then((res)=>{
      console.log(res);
      this.beneficial.name=res.displayName;
      if(res.phoneNumbers.length>=2)
      {
        this.successModal = this.modalCtrl.create(SelectContactPage, {
          data:res.phoneNumbers});

        this.successModal.onDidDismiss(data => {
          if(data!=null)
          {
            this.beneficial.benphone=data.phoneNo;
          }
        });

        setTimeout(() => {
          this.successModal.present();
        }, 300);
      }
      else{
          this.beneficial.benphone=res.phoneNumbers[0].value;
      }
    },(err)=>{
      console.log(err);
    });
  }
}
