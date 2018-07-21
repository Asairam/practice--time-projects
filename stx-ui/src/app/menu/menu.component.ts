import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {

  navURL = '';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.navURL = window.location.href.replace(window.location.origin, '').substring(3);
  }
}
