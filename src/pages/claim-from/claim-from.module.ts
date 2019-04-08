import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimFromPage } from './claim-from';

@NgModule({
  declarations: [
    ClaimFromPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimFromPage),
  ],
  exports: [
    ClaimFromPage
  ]
})
export class ClaimFromPageModule {}
