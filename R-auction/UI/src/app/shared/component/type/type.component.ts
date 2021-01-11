import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../authService/auth.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent implements OnInit {
role= this.authservice.userRole()
  constructor(private authservice: AuthService) { }

  ngOnInit() {
  }


}
