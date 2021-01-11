import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule, MatExpansionModule, MatProgressSpinnerModule,
    MatNativeDateModule, MatTooltipModule, MatChipsModule, MatSlideToggleModule,
    MatSidenavModule, MatIconModule, MatListModule, MatToolbarModule, MatTabsModule, MatCheckboxModule,
    MatAutocompleteModule, MatTreeModule  ,
    MatTableModule, 
    MatSnackBarModule,
    MatBadgeModule,MatDialogModule,
    MatProgressBarModule,
    MatMenuModule
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MatRadioModule } from '@angular/material/radio';
import 'hammerjs';

import {MatPaginatorModule} from '@angular/material/paginator';
@NgModule({
    imports: [
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatSelectModule,
        MatDatepickerModule, MatExpansionModule,
        MatNativeDateModule, MatTooltipModule, MatProgressSpinnerModule,
        MatSliderModule, MatTabsModule, MatChipsModule, MatSlideToggleModule,
        MatSidenavModule, MatIconModule, MatListModule, MatToolbarModule,
        MatCheckboxModule, MatAutocompleteModule, MatButtonToggleModule, MatTreeModule,
        MatRadioModule,MatTableModule,
        MatSnackBarModule,MatBadgeModule,
        DragDropModule,MatDialogModule,
        MatProgressBarModule
    ],
    exports: [
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatSelectModule,
        MatDatepickerModule, MatExpansionModule,
        MatNativeDateModule, MatTooltipModule, MatProgressSpinnerModule,
        MatSliderModule, MatTabsModule, MatChipsModule, MatSlideToggleModule,
        MatSidenavModule, MatIconModule, MatListModule, MatToolbarModule,
        MatCheckboxModule,
        MatAutocompleteModule, MatButtonToggleModule, MatTreeModule,
        MatRadioModule,MatTableModule,MatSnackBarModule,MatBadgeModule,
        DragDropModule,MatDialogModule,
        MatProgressBarModule,MatMenuModule,MatPaginatorModule
    ]
})

export class AppMaterialModule {

}
