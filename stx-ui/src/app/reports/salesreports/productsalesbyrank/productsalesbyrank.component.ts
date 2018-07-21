import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ProductSalesByRankService } from './productsalesbyrank.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './productsalesbyrank.html',
  styleUrls: ['./productsalesbyrank.css'],
  providers: [ProductSalesByRankService],
})
export class ProductSalesByRankComponent implements OnInit {
  bsValue = new Date();
  bsValue1 = new Date();
  itemsDisplay: any = false;
  workerTipsData: any;
  datePickerConfig: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private productSalesByRankService: ProductSalesByRankService) {
      this.datePickerConfig = Object.assign({},
                  {
                    showWeekNumbers: false,
                    containerClass: 'theme-blue',
                  });
  }
  ngOnInit() {
  }
  generate() {
    this.itemsDisplay = true;
  }
}

