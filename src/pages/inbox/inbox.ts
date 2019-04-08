import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the InboxPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {

	messages:any;
	data={
		message:''
	}
	hideTime = true;
	alternate;
	myId = '12345';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InboxPage');
  }

  sendMessage()
  {
  	 this.alternate = !this.alternate;
  	this.messages.push({
      userId: this.alternate ? '12345' : '54321',
      text: this.data.message
    });
  }
}
