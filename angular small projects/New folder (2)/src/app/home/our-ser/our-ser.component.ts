import { Component, OnInit } from '@angular/core';
import {Params,ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-our-ser',
  templateUrl: './our-ser.component.html',
  styleUrls: ['./our-ser.component.css']
})
export class OurSerComponent implements OnInit {

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.params.forEach(params => console.log(params))
  }

}
