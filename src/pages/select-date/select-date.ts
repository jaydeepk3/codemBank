import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';

import * as moment from "moment";

// declare var WinkelCalendar: any;

/**
 * Generated class for the SelectDatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-select-date',
  templateUrl: 'select-date.html',
})
export class SelectDatePage {

  @ViewChild(Slides) slides: Slides;

  selected: any = {
    day: 'Monday',
    date: 1,
    month: 'Jan',
    year: 1970
  };

  months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  days: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendar: any = [];
  numberOfDays: number = 31;
  firstDay: number = 0;
  years: any = [];
  today: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.today = moment().format('YYYY-MMM-D');

    let selec = navParams.get('date');

    this.initCal(selec === null ? moment().format('YYYY-MMM-D') : selec);
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
    this.numOfDays();
  }

  initCal(d) {
    this.selected.day = moment(d, "YYYY-MMM-D").format('dddd');
    this.selected.date = parseInt(moment(d, "YYYY-MMM-D").format('D'));
    this.selected.month = moment(d, "YYYY-MMM-D").format('MMM');
    this.selected.year = parseInt(moment(d, "YYYY-MMM-D").format('YYYY'));

    let y: number = moment().years();
    this.years = [];
    let scroll = 0;
    for (var i = y - 100; i < y + 30; i++) {
      this.years.push(i);
      if (i < this.selected.year) {
        scroll += 40;
      }
    }


  }

  selectSlide(i) {
    this.slides.lockSwipes(false);
    this.slides.slideTo(i, 600);
    setTimeout(() => {
      this.slides.lockSwipes(true);
    }, 600);
  }

  selectYear(i) {
    this.selected.year = i;
    this.numOfDays();
    this.selectSlide(1);
  }

  selectMonth(i) {
    this.selected.month = i;
    this.numOfDays();
    this.selectSlide(0);
  }

  selectDay(i) {
    if (i > 0) {
      this.selected.date = i;
      this.numOfDays();
      setTimeout(() => {
        this.viewCtrl.dismiss(this.selected.year + "-" + this.selected.month + "-" + this.selected.date);
      }, 600);
    }
  }

  numOfDays() {
    this.numberOfDays = moment(this.selected.year + "-" + this.selected.month, "YYYY-MMM").daysInMonth();

    if (this.selected.date > this.numberOfDays) {
      this.selected.date = this.numberOfDays;
    }

    let fDay: string = moment(this.selected.year + "-" + this.selected.month + "-" + '1', "YYYY-MMM-D").format('d');
    this.firstDay = parseInt(fDay);

    this.selected.day = moment(this.selected.year + "-" + this.selected.month + "-" + this.selected.date, "YYYY-MMM-D").format('dddd');

    this.calendar = [];
    for (var i = 0; i < this.firstDay; i++) {
      this.calendar.push({ day: 0, date: '' });
    }
    for (var i = 0; i < this.numberOfDays; i++) {
      this.calendar.push({ day: i + 1, date: this.selected.year + "-" + this.selected.month + "-" + (i + 1) });
    }
  }

  cancel() {
    this.viewCtrl.dismiss(null);
  }

}
