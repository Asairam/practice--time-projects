import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonLoaderService } from './loader.service';
import { CommonService } from '../../../commonService/common.service';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  constructor(private loaderService: CommonLoaderService, public common: CommonService) { }

  ngOnInit() {
  }

}
