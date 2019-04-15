import { ExitingCustomerPage } from './../pages/exiting-customer/exiting-customer';
import { StartPage } from './../pages/start/start';
import { ApiProvider } from './../providers/api/api';
import { Component, ViewChild, NgZone } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { AlertController, App, Events, Platform, Tabs } from 'ionic-angular';

import { Authenticate } from '../pages/authenticate/authenticate';
import { ChangePassword } from './../pages/change-password/change-password';
import { Client } from './../pages/client/client';
import { UserProvider } from './../providers/user/user';
 import {Idle} from '@ng-idle/core';

declare var cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('homeTabs') homeTabs: Tabs;
  rootPage: any = /*ExitingCustomerPage*/ /*StartPage*/ Authenticate /*TabsPage*/; // Change to Client

  options: PushOptions = {
    android: {
      senderID: '262379723069'
    },
    ios: {
      badge: true,
      sound: 'false'
    },
    windows: {}
  }

  pushObject: PushObject;

  ind: number = 1;

  currentTabIndex: number = 0;
  appName: string = 'Cogebanque mBank';

  isTest = false;

  exitAlert;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  constructor(private zone: NgZone,
    private platform: Platform,
    private app: App,
    private appVersion: AppVersion,
    statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private screenOrientation: ScreenOrientation,
    public events: Events,
    public push: Push,
    public alertCtrl: AlertController,
    public storage: Storage,
    public userProvider: UserProvider,
    private idle: Idle, 
    public api: ApiProvider) {
      this.idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
      this.idle.setIdle(3);
    try {
      api.setTest(this.isTest);
    } catch (exce) { }

    this.exitAlert = alertCtrl.create({
      title: this.appName,
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Exit App',
          handler: () => {
            // this.userProvider.logOut();
            // this.events.publish('user:auth', null, Date.now());
              platform.exitApp();
          }
        }
      ]
    });

    platform.ready().then(() => {
      api.setTest(this.isTest);
     
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
    
      screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      appVersion.getAppName().then(name => {
        this.appName = name;
      });
      let self = this;
      cordova.plugins.IMEI(function (err, imei) {
        console.log('imeiNumber', imei);
        self.storage.set('imeiNumber', imei);
      });

      // cordova.plugins.notification.local.on('click', function (notification) {
      //   alert(notification.data.urugi);
      // })
      // this.localNotification.on('click', handler)

      platform.registerBackButtonAction(() => {
        try {
          if (app.getActiveNav().canGoBack() || app.getActiveNav().canSwipeBack()) {
            app.getActiveNav().pop();
          } else {
            try {
              app.getActiveNav().pop();
            } catch (exc) { }
            if (app.getActiveNav().getActive().component == Authenticate) {
              // this.events.publish('user:auth', null, Date.now());
               platform.exitApp();
            } else {
              if (this.currentTabIndex > 0) {
                app.getActiveNav().getActive().getNav().parent.select(0);
              } else {
                this.exitAlert.present();
              }
            }
          }
        } catch (exc) {
        }
      });

      events.subscribe('client:tab:change', (index, time) => {
        this.currentTabIndex = index;
      });

      events.subscribe('user:auth', (user, time) => {
       
        this.userProvider.setUser(user);
        console.log('user', user);
        if (user !== null && user.hasOwnProperty('signedIn') && user.signedIn === true) {
          try {
            this.rootPage = user.passexpired === 'N' ? Client : ChangePassword;
            // setInterval(() => {
            //   this.userProvider.logOut();
            // }, user.sesstime);
          } catch (exce) {
          }

          //if ()
        } else {
          this.rootPage = /*ExitingCustomerPage*/ /*StartPage*/ Authenticate /*TabsPage*/; // Change to Client

          /* Removing Cache */
          this.storage.forEach((value, key, index) => {
            if (key !== 'registrationId' && key !== 'user_login') {
              this.storage.remove(key);
            }
          });

          this.storage.forEach((value, key, index) => {
            if (key !== 'registrationId' && key !== 'user_login') {
              this.storage.remove(key);
            }
          });
        }
       
      });

      setTimeout(() => {
        this.pushInit();
      }, 1000);

      this.platform.pause.subscribe((result) => {
        this.events.publish('user:auth', null, Date.now());
           console.log('[INFO] App paused');
          this.storage.forEach((value, key, index) => {
            if (key !== 'registrationId') {
              this.storage.remove(key);
            }
          });

      });
    });

    platform.resume.subscribe(() => {
      this.splashScreen.show();
      this.chk();
    });

  
  }

  chk() {
    this.userProvider.checkSession().then(res => {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);
    }).catch(exc => {
      let youralert = this.alertCtrl.create({
        title: 'Device Error',
        message: 'Something went wrong!'
      });
      youralert.present();

      setTimeout(() => {
        this.platform.exitApp();
      }, 4000);
    });
  }

  getRegId() {
    this.ind++;
    this.storage.get('registrationId').then((val) => {
      if (val !== null) {
        this.chk();
      } else {
        setTimeout(() => {
          if (this.ind < 30) {
            this.getRegId();
          }
          if (this.ind % 5 === 0) {
            this.pushInit();
          }
          // if (this.ind === 16) {
          //   let youralert = this.alertCtrl.create({
          //     title: 'Device Error',
          //     message: 'Something went wrong! Could not register your device.'
          //   });
          //   youralert.present();

          //   setTimeout(() => {
          //     this.platform.exitApp();
          //   }, 4000);
          // }
        }, 1000);
      }
    });
  }

  pushInit() {
    this.pushObject = this.push.init(this.options);

    this.pushObject.on('notification').subscribe((notification: any) => {
      console.log("----- notification -----");
      console.log(JSON.stringify(notification));

      if (notification.additionalData.foreground) {
        if (notification.additionalData.urugi === 'Y') {
          let youralert = this.alertCtrl.create({
            title: 'New Push notification',
            message: notification.message
          });
          youralert.present();
        }
      }

      if (notification.additionalData.vamo === 'Y') {
        this.userProvider.logOut();
      }
    });

    this.pushObject.on('registration').subscribe((registration: any) => {
      console.log('Registration ID: ' + registration.registrationId);
      console.log('Registration Type: ' + registration.registrationType);
      //Set registrationId
      this.storage.set('registrationId', registration.registrationId);
      this.storage.set('registrationType', registration.registrationType);
    });

    this.pushObject.on('error').subscribe(error => {
      alert('Error Occurred');
    });

    // this.pushObject.subscribe('general').then(data => {
    //   alert('Subscribe general: ' + data);
    // }).catch(error => {
    //   alert('Subscribe general error: ' + error);
    // });

    let usr_: any = this.userProvider.getUser();

    if (usr_ !== null) {
      this.events.publish('user:auth', usr_, Date.now());
    }

    this.getRegId();
  }
}
