import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import { MoveMoneyListPage } from './../move-money-list/move-money-list';
import { MyAccountsPage } from './../my-accounts/my-accounts';
import { MyMoney } from './../my-money/my-money';
import { Options } from './../options/options';
import { Pay } from './../pay/pay';

/**
 * Generated class for the Clent tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */
@Component({
  templateUrl: 'client.html'
})
export class Client {

  tab1Root: any = MyMoney;
  tab2Root: any = MyAccountsPage;
  tab3Root: any = MoveMoneyListPage;
  tab4Root: any = Pay;
  tab5Root: any = Options;

  constructor(public events: Events) {

  }

  tabsChanged($event) {
    this.events.publish('client:tab:change', $event.index, Date.now());
  }

}
