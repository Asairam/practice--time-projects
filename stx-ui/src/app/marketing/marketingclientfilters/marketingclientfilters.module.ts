import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MarketingClientFiltersRoutingModule } from './marketingclientfilters.routing.module';
import { MarketingClientFiltersComponent } from './marketingclientfilters.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { KeysPipe } from './marketingclientfilters.pipe';
@NgModule({
  imports: [
    CommonModule,
    MarketingClientFiltersRoutingModule,
    FormsModule,
    ShareModule,
    TranslateModule,
    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot()
  ],
  declarations: [MarketingClientFiltersComponent, KeysPipe]
})
export class MarketingClientFiltersModule { }
