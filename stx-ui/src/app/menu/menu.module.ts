import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MenuComponent } from './menu.component';
import { MenuRoutingModule } from './menu.routing';
import { ShareModule } from '../common/share.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        MenuRoutingModule,
        ShareModule,
        AccordionModule.forRoot()
    ],
    declarations: [
        MenuComponent
    ]
})
export class MenuModule {
}
