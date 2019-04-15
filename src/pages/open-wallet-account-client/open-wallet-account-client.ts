import { DateProvider } from './../../providers/date/date';
import { AlertSuccessPage } from './../alert-success/alert-success';
import { UserProvider } from './../../providers/user/user';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';

declare var cordova: any;

/**
 * Generated class for the OpenWalletAccountClientPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-open-wallet-account-client',
  templateUrl: 'open-wallet-account-client.html',
})
export class OpenWalletAccountClientPage {

  successModal;

  user: any;

  test: boolean = true;

  data: any = {
    dob: '',
    province: '',
    district: '',
    sector: '',
    nid: ''
  };

  fetching = false;
  province_loading = false;
  district_loading = false;
  sector_loading = false;

  ret: string;

  provinces: any = [];
  districts: any = [];
  sectors: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public events: Events, public api: ApiProvider, public userProvider: UserProvider, public date: DateProvider) {
    this.user = userProvider.getUser();
    this.test = api.isTest;
    this.fetch('province', {});
  }

  ionViewDidLoad() {

  }

  openAccount() {
    this.ret = '';
    this.fetching = true;

    let data = JSON.stringify({
      "metode": "openwallet",
      "accid": this.user.accid,
      "dob": this.data.dob,
      "province": this.data.province,
      "district": this.data.district,
      "sector": this.data.sector,
      "nid": this.data.nid
    });

    cordova.plugins.aesEnc(data, this.user.rkey).then((data_) => {
      this.api.query(data_, this.user, 'openwallet', false).then(data__ => {

        this.fetching = false;
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data___) => {
            let accts: any = JSON.parse(data___);
            this.showSuccess(accts);
          }).catch((err) => {
            this.ret = 'Unknown error!';
          });
        } else {
          if (dt.kbankResponse.retcode < 606) {
            this.userProvider.logOut();
          }
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.user.rkey).then((data___) => {
            this.ret = data___;
          }).catch((err) => {
            this.ret = dt.kbankResponse.reply;
          });
        }

      }).catch(error => {
        this.fetching = false;
        this.ret = 'An error occurred!';
      });
    }).catch((err) => {
      this.fetching = false;
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
      this.navCtrl.pop();
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

  logOut() {
    this.userProvider.logOut();
  }

}
