import { AdvertPage } from './../pages/advert/advert';
import { SelectDatePage } from './../pages/select-date/select-date';
import { NewToTheAppPage } from './../pages/new-to-the-app/new-to-the-app';
import { ExitingCustomerPage } from './../pages/exiting-customer/exiting-customer';
import { StartPage } from './../pages/start/start';
import { BankServiceMapMarkerPage } from './../pages/bank-service-map-marker/bank-service-map-marker';
import { SelectCountryPage } from './../pages/select-country/select-country';
import { SelectOperatorPage } from './../pages/select-operator/select-operator';
import { MoveMoneyServicePage } from './../pages/move-money-service/move-money-service';
import { MoveMoneyListPage } from './../pages/move-money-list/move-money-list';
import { SelectBranchPage } from './../pages/select-branch/select-branch';
import { BankServiceVerifyPage } from './../pages/bank-service-verify/bank-service-verify';
import { BankServiceTablePage } from './../pages/bank-service-table/bank-service-table';
import { BankServiceMapPage } from './../pages/bank-service-map/bank-service-map';
import { BankServiceStatementPage } from './../pages/bank-service-statement/bank-service-statement';
import { BankServicePage } from './../pages/bank-service/bank-service';
import { OpenWalletAccountClientPage } from './../pages/open-wallet-account-client/open-wallet-account-client';
import { OpenWalletAccountPage } from './../pages/open-wallet-account/open-wallet-account';
import { BankServicesPage } from './../pages/bank-services/bank-services';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppVersion } from '@ionic-native/app-version';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Push } from '@ionic-native/push';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ApiProvider } from '../providers/api/api';
import { UserProvider } from '../providers/user/user';
import { AccountInfoPage } from './../pages/account-info/account-info';
import { AlertSuccessPage } from './../pages/alert-success/alert-success';
import { Authenticate } from './../pages/authenticate/authenticate';
import { ChangePassword } from './../pages/change-password/change-password';
import { Client } from './../pages/client/client';
import { EInteractPage } from './../pages/e-interact/e-interact';
import { MoveMoneyConfirmPage } from './../pages/move-money-confirm/move-money-confirm';
import { MoveMoney } from './../pages/move-money/move-money';
import { MyAccountsPage } from './../pages/my-accounts/my-accounts';
import { MyMoney } from './../pages/my-money/my-money';
import { Options } from './../pages/options/options';
import { Pay } from './../pages/pay/pay';
import { SelectAccount } from './../pages/select-account/select-account';
import { SelectBankPage } from './../pages/select-bank/select-bank';
import { SelectBeneficialPage } from './../pages/select-beneficial/select-beneficial';
import { SelectCurrencyPage } from './../pages/select-currency/select-currency';
import { TransactionDetailsPage } from './../pages/transaction-details/transaction-details';
import { UtilityVerifyPage } from './../pages/utility-verify/utility-verify';
import { UtilityPage } from './../pages/utility/utility';
import { MyApp } from './app.component';
import { RwandaProvider } from '../providers/rwanda/rwanda';
import { Geolocation } from '@ionic-native/geolocation';
import { DatePicker } from '@ionic-native/date-picker';
import { DateProvider } from '../providers/date/date';
import { Market } from '@ionic-native/market';
import { ForceUpdateProvider } from '../providers/force-update/force-update';
import { ForgotPinPage } from '../pages/forgot-pin/forgot-pin';
import { ChallengePage } from '../pages/challenge/challenge';
import { InboxPage } from '../pages/inbox/inbox';
import { ClaimFromPage } from '../pages/claim-from/claim-from';
import { SelectContactPage } from '../pages/select-contact/select-contact';
import { SMS } from '@ionic-native/sms/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Device } from '@ionic-native/device/ngx';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

@NgModule({
  declarations: [
    MyApp,
    Authenticate,
    Client,
    MyMoney,
    Pay,
    MoveMoney,
    SelectAccount,
    Options,
    ChangePassword,
    MyAccountsPage,
    AccountInfoPage,
    SelectBankPage,
    MoveMoneyConfirmPage,
    SelectCurrencyPage,
    SelectBeneficialPage,
    UtilityPage,
    UtilityVerifyPage,
    AlertSuccessPage,
    EInteractPage,
    TransactionDetailsPage,
    BankServicesPage,
    OpenWalletAccountPage,
    OpenWalletAccountClientPage,
    BankServicePage,
    BankServiceStatementPage,
    BankServiceMapPage,
    BankServiceTablePage,
    BankServiceVerifyPage,
    SelectBranchPage,
    MoveMoneyListPage,
    MoveMoneyServicePage,
    SelectOperatorPage,
    SelectCountryPage,
    BankServiceMapMarkerPage,
    StartPage,
    ExitingCustomerPage,
    NewToTheAppPage,
    SelectDatePage,
    AdvertPage,
    ForgotPinPage,
    ChallengePage,
    InboxPage,
    ClaimFromPage,
    SelectContactPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
   NgIdleKeepaliveModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Authenticate,
    Client,
    MyMoney,
    Pay,
    MoveMoney,
    SelectAccount,
    Options,
    ChangePassword,
    MyAccountsPage,
    AccountInfoPage,
    SelectBankPage,
    MoveMoneyConfirmPage,
    SelectCurrencyPage,
    SelectBeneficialPage,
    UtilityPage,
    UtilityVerifyPage,
    AlertSuccessPage,
    EInteractPage,
    TransactionDetailsPage,
    BankServicesPage,
    OpenWalletAccountPage,
    OpenWalletAccountClientPage,
    BankServicePage,
    BankServiceStatementPage,
    BankServiceMapPage,
    BankServiceTablePage,
    BankServiceVerifyPage,
    SelectBranchPage,
    MoveMoneyListPage,
    MoveMoneyServicePage,
    SelectOperatorPage,
    SelectCountryPage,
    BankServiceMapMarkerPage,
    StartPage,
    ExitingCustomerPage,
    NewToTheAppPage,
    SelectDatePage,
    AdvertPage,
    ForgotPinPage,
    ChallengePage,
    InboxPage,
    ClaimFromPage,
    SelectContactPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    InAppBrowser,
    AppVersion,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Push,
    UserProvider,
    ApiProvider,
    ScreenOrientation,
    LocalNotifications,
    RwandaProvider,
    Geolocation,
    DatePicker,
    DateProvider,
    Market,
    SMS,
    Device,
    AndroidPermissions,
    ForceUpdateProvider
  ]
})
export class AppModule { }
