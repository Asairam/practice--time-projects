import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { OnHandProductService } from './onhandproduct.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './onhandproduct.html',
  styleUrls: ['./onhandproduct.css'],
  providers: [OnHandProductService],
})
export class OnHandProductComponent implements OnInit {
  showProdList: any = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private marketingEmailService: OnHandProductService) {

  }
  ngOnInit() {
  }
  generateReport() {
    this.showProdList = true;
  }
}
