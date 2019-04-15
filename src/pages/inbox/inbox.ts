import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from './../../providers/user/user';
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
  data={message:''};

  messages=[];

  alternate:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InboxPage');
  }

  sendMessage()
  {
    let userID=54321;
    this.alternate =!this.alternate;
    if(this.data.message.length > 0)
    {
      if(this.alternate)
      {
        userID=12345;
      }
      let val={"userID":userID,"text":this.data.message};
      this.messages.push(val);
       this.data.message='';
    }
    this.data.message='';
  }

  logOut() {
    this.userProvider.logOut();
  }
}
