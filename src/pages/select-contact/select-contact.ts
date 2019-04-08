import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the SelectContactPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-select-contact',
  templateUrl: 'select-contact.html',
})
export class SelectContactPage {

	phones: any = [];
	ret: string = '';
	fetching: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  	this.phones = navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectContactPage');
  }
  selectPhone(phone: any) {
    let data = { phoneNo: phone };
    this.viewCtrl.dismiss(data);
  }
  hideModal() {
    this.viewCtrl.dismiss(null);
  }

}
