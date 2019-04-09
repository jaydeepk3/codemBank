import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
declare var cordova: any;
/**
 * Generated class for the AdvertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-advert',
  templateUrl: 'advert.html',
})
export class AdvertPage {

  private key: string = '2aadf6440fa96846';
  ret: string = "";
  splase1:boolean=false;
  // splase2: any;
  // splase3: any;
  splashImg:any=[];
  // imgUrl:string='';
  constructor(public navCtrl: NavController, public events: Events, public navParams: NavParams, public viewCtrl: ViewController, public api: ApiProvider) {

  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.fetchInfo();
    }, 300);

  }

  fetchInfo() {
    let data = JSON.stringify({ "method": "splash" });
    console.log(data);
    console.log(this.key);
    let self = this;

    cordova.plugins.aesEnc(data, this.key).then((data_) => {
      // console.log(data_)
      self.api.query(data_, null, 'splash', false).then(data__ => {
        // console.log(data__)
        let dt: any = data__;
        if (dt.kbankResponse.retcode === 0) {
          cordova.plugins.aesDec(dt.kbankResponse.reply, this.key).then((data___) => {
            console.log(data___); //{"1":{"name":"1.jpg"},"2":{"name":"2.jpg"},"3":{"name":"3.jpg"}}
            let coge: any = JSON.parse(data___);
            // console.log(coge[1].name);
            // this.imgUrl = self.api.api().url+'sp';
            for(let val in coge)
            {
              if(val!="colourcode")
              {
                this.splase1=true;
                this.splashImg.push({"name":self.api.api().url+'sp/'+coge[val].name});
              }
            }
            // this.splase1 = coge[1].name;
            // this.splase2 = coge[2].name;
            // this.splase3 = coge[3].name;
            // this.splase1 = self.api.api().url+'sp/'+coge[1].name;
            // this.splase2 = self.api.api().url+'sp/'+coge[2].name;
            // this.splase3 = self.api.api().url+'sp/'+coge[3].name;
          }).catch((err) => {
            this.ret = 'Unknown error!';
          });
        } else {
          this.ret = dt.kbankResponse.reply;
        }

      }).catch(error => {
        this.ret = 'An error occurred!';
      });
    }).catch((err) => {
      this.ret = 'Unknown error!';
    });
  }
  close() {
    this.viewCtrl.dismiss();
  }

}
