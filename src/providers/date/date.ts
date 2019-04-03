import { SelectDatePage } from './../../pages/select-date/select-date';
import { ModalController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as moment from "moment";

/*
  Generated class for the DateProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DateProvider {

  constructor(public modalCtrl: ModalController) {

  }

  show(date: string) {
    return new Promise(resolve => {
      let modal = this.modalCtrl.create(SelectDatePage, {
        date: date === '' || date === null ? null : moment(date, "DD/MM/YYYY").format('YYYY-MMM-D')
      });

      modal.onDidDismiss(date => {
        let d: string = date;
        resolve(d === '' || d === null ? null : moment(d, "YYYY-MMM-D").format('DD/MM/YYYY'));
      });

      setTimeout(() => {
        modal.present();
      }, 300);
    });
  }

}
