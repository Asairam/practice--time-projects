import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import * as config from '../../appConfig/app.config';
import { ViewPopupComponent } from 'src/app/shared/component/view-popup/view-popup.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import * as routerconfig from '../../appConfig/router.config';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private routes: Router, private AuthService: AuthService, private dialog: MatDialog ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.AuthService.getTokenValue() && this.AuthService.getUserData().isActive) { 
      if (Object.getOwnPropertyNames(next.data).length !== 0 && next.data.roles.toLowerCase().includes(this.AuthService.userRole().toLowerCase())) {
        return true;
      } else if (Object.getOwnPropertyNames(next.data).length === 0) {
        return true;
      } else {
        if (config.ROLE_ACCESS_CONTROL.both.includes(this.AuthService.userRole().toLowerCase())) {
          this.routes.navigate([routerconfig.buyer_router_links.BUYER_DASHBOARD]);
        }
        else if (config.ROLE_ACCESS_CONTROL.customer.includes(this.AuthService.userRole().toLowerCase())) {
          this.routes.navigate([routerconfig.supplier_router_links.SUPPLIER_DASHBOARD]);
        }
        else {
          this.routes.navigate([routerconfig.supplier_router_links.SUPPLIER_DASHBOARD]);
        }
        return true;
      }
    } else {
      if (this.AuthService.getUserData() && !this.AuthService.getUserData().isActive) {
        this.activePopup();
      } else {
        this.routes.navigate(['/login']);
        return false;
      }
    }
  }
  activePopup() {
    const objMatDialogConfig = new MatDialogConfig();
    objMatDialogConfig.panelClass = 'dialog-xs';
    objMatDialogConfig.data = {
      dialogMessage: 'Warning...',
      dialogContent: 'User ID is deactivated. Please connect with administrator',
      tab: 'confirm_msg',
      dialogPositiveBtn: "Ok"
    }
    objMatDialogConfig.disableClose = true;
    let refMatDialog = this.dialog.open(ViewPopupComponent, objMatDialogConfig);
    refMatDialog.afterClosed().subscribe((value) => {
        localStorage.removeItem('tokenValue');
        localStorage.removeItem('userdata');
        this.routes.navigate(['/login']);
    });
  }
}
