import { ModalController, Platform } from 'ionic-angular';
import { AlertSuccessPage } from './../../pages/alert-success/alert-success';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ForceUpdateProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ForceUpdateProvider {

  constructor(public http: Http, public modalCtrl: ModalController, public platform: Platform) {
    console.log('Hello ForceUpdateProvider Provider');
  }

  show(msg: string = '') {
    let successModal = this.modalCtrl.create(AlertSuccessPage, {
      title: 'Move Money',
      message: msg,
      forceUpdate: true
    });

    successModal.onDidDismiss(data => {
      this.platform.exitApp();
    });

    setTimeout(() => {
      successModal.present();
    }, 300);
  }

}
