import { DateProvider } from './../../providers/date/date';
import { AlertSuccessPage } from './../alert-success/alert-success';
import { BankServiceVerifyPage } from './../bank-service-verify/bank-service-verify';
import { SelectAccount } from './../select-account/select-account';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';

declare var moment;

/**
 * Generated class for the BankServiceStatementPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-bank-service-statement',
  templateUrl: 'bank-service-statement.html',
})
export class BankServiceStatementPage {

  selectAccountModal;
  confirmServiceModal;
  successModal;

  service: any;
  user: any;
  test: boolean = true;
  account: any = {
    account: ''
  };

  email: string = '';
  start: string = '';
  end: string = '';

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, private datePicker: DatePicker, public modalCtrl: ModalController, public userProvider: UserProvider, public api: ApiProvider, public date: DateProvider) {
    this.service = navParams.get('service');
    this.user = userProvider.getUser();
    this.test = api.isTest;
    this.email = this.user.email;
  }

  ionViewDidLoad() {

  }

  selectAccount(i) {
    this.selectAccountModal = this.modalCtrl.create(SelectAccount, { message: 'Select the source account', action: 'trxlist' });

    this.selectAccountModal.onDidDismiss(data => {
      if (data !== null) {
        this.account = data.account;
      }
    });

    setTimeout(() => {
      this.selectAccountModal.present();
    }, 300);
  }

  selectDate(i) {
    this.date.show(i === 0 ? this.start : this.end).then((date) => {
      if (date !== null) {
        if (i === 0) {
          this.start = String(date);
        } else {
          this.end = String(date);
        }
      }
    });

    // this.datePicker.show({
    //   date: new Date(),
    //   mode: 'date',
    //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    // }).then(
    //   (date) => {
    //     if (date !== null) {
    //       let d = moment(date).format("DD/MM/YYYY");
    //       if (i === 0) {
    //         this.start = d;
    //       } else {
    //         this.end = d;
    //       }
    //     }
    //   }, (err) => {

    //   }
    //   );
  }

  continue() {

    this.confirmServiceModal = this.modalCtrl.create(BankServiceVerifyPage, {
      data: {
        debitaccount: this.account,
        email: this.email,
        sdate: this.start,
        edate: this.end,
        reason: '',
        service: this.service,
        branch: {
          name: '',
          branchid: ''
        }
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
