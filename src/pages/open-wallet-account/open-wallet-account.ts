import { DateProvider } from './../../providers/date/date';
import { AlertSuccessPage } from './../alert-success/alert-success';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';

declare var cordova: any;

/**
 * Generated class for the OpenWalletAccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-open-wallet-account',
  templateUrl: 'open-wallet-account.html',
})
export class OpenWalletAccountPage {

  successModal;

  test: boolean = true;

  data: any = {
    fname: '',
    lname: '',
    gender: '',
    dob: '',
    phone: '',
    email: '',
    province: '',
    district: '',
    sector: '',
    nid: '',
    otype: 1
  };

  authenticating = false;
  province_loading = false;
  district_loading = false;
  sector_loading = false;

  ret: string;

  provinces: any = [];
  districts: any = [];
  sectors: any = [];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public viewCtrl: ViewController, public navParams: NavParams, public api: ApiProvider, public date: DateProvider) {
    this.test = api.isTest;
    this.fetch('province', {});
  }

  ionViewDidLoad() {

  }

  openAccount() {
    this.ret = '';
    this.authenticating = true;

    let data = JSON.stringify(this.data);

    cordova.plugins.aesEnc(data, this.api.api().key).then((data_) => {
      this.api.query(data_, null, 'walletopen', false).then(data__ => {
        this.authenticating = false;
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.api.api().key).then((data___) => {

            let coge: any = JSON.parse(data___);
            this.showSuccess(coge);
          }).catch((err) => {
            this.ret = 'Unknown error!';
          });
        } else {
          this.ret = dt.kbankResponse.reply;
        }

      }).catch(error => {
        this.authenticating = false;
        this.ret = 'An error occurred!';
      });
    }).catch((err) => {
      this.authenticating = false;
      this.ret = 'Unknown error!';
    });
  }

  fetch(it_, dt_) {

    let it = 'get' + it_ + 's';

    this[it_ + '_loading'] = true;

    let data = JSON.stringify(dt_);

    cordova.plugins.aesEnc(data, this.api.api().key).then((data_) => {
      this.api.query(data_, null, it, false).then(data__ => {
        this[it_ + '_loading'] = false;
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.api.api().key).then((data___) => {

            let coge: any = JSON.parse(data___);

            this[it_ + 's'] = [];
            let index = 0;
            for (var item in coge) {
              index++;
              this[it_ + 's'].push(coge['' + index][it_]);
            }
          }).catch((err) => {
            this.ret = 'Unknown error!';
          });
        } else {
          this.ret = dt.kbankResponse.reply;
        }

      }).catch(error => {
        this[it_ + '_loading'] = false;
        this.ret = 'An error occurred!';
      });
    }).catch((err) => {
      this[it_ + '_loading'] = false;
      this.ret = 'Unknown error!';
    });
  }

  provinceChange($event) {
    if (this.data.province.length > 0) {
      this.districts = [];
      this.sectors = [];
      this.data.district = '';
      this.data.sector = '';
      this.fetch('district', { 'provinceid': this.data.province });
    }
  }

  districtChange($event) {
    if (this.data.district.length > 0) {
      this.sectors = [];
      this.data.sector = '';
      this.fetch('sector', { 'districtid': this.data.district });
    }
  }

  sectorChange($event) {

  }

  showSuccess(data: any) {
    this.successModal = this.modalCtrl.create(AlertSuccessPage, {
      title: 'Open Wallet Account',
      message: data.transreturn
    });

    this.successModal.onDidDismiss(data => {
      this.hideModal();
    });

    setTimeout(() => {
      this.successModal.present();
    }, 300);
  }

  selectDate() {
    this.date.show(this.data.dob).then(date => {
      if (date !== null) {
        this.data.dob = date;
      }
    });
  }

  hideModal() {
    this.navCtrl.pop();
  }

}
