import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  callUserInfo = true;
  baseUrlAuction: string = environment.socketURL.auction;
  baseUrlBid: string = environment.socketURL.bid;
  baseUrlQuery: string = environment.socketURL.query;
  private socket;
  private bidSocket;
  private querySocket;

  constructor() {
    this.socket = socketIo(this.baseUrlAuction, { path: environment.socketURL.auctionURL, transports: ['websocket'] });
    this.bidSocket = socketIo(this.baseUrlBid, { path: environment.socketURL.bidURL, transports: ['websocket'] });
    this.querySocket = socketIo(this.baseUrlQuery, { path: environment.socketURL.queryURL, transports: ['websocket'] });
  }

  public getSocketData(auctionID): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('auc-' + auctionID, (data: any) => observer.next(data));
    });
  }

  public getBidSocketData(auctionID, role): Observable<any> {
    return new Observable<any>(observer => {
      this.bidSocket.on('auc-' + auctionID + '-' + role, (data: any) => observer.next(data));
    });
  }

  public getMatrixSocketData(auctionID): Observable<any> {
    return new Observable<any>(observer => {
      this.bidSocket.on('auc-' + auctionID + '-buyer-matrix', (data: any) => observer.next(data));
    });
  }

  public getQuerySocketData(auctionID, vendorCode): Observable<any> {
    return new Observable<any>(observer => {
      this.querySocket.on('query-' + auctionID + '-' + vendorCode, (data: any) => observer.next(data));
    });
  }

  public supplierOnline(val): Observable<any> {
    return new Observable<any>(observer => {
      this.bidSocket.emit('userInfo', {
        userID: 1,
        auctionID: val,
        email: JSON.parse(localStorage.getItem('userdata')).settings.ril.vendorcodeSelected,
        status: "Online",
        loggedIn: new Date(),
        loggedOut: new Date()
      });
    });
  }

  public supplierOnlineStatus(aucId): Observable<any> {
    return new Observable<any>(observer => {
      this.bidSocket.on(`emitAuction-${aucId}`, (data: any) => observer.next(data));
    });
  }

  public supplierDeleteStatus(aucId, vendorCode): Observable<any> {
    return new Observable<any>(observer => {
      this.bidSocket.on(`supplier-suspend-${aucId}-${vendorCode}`, (data: any) => observer.next(data));

    });
  }
  public supplierLogout(emailID): Observable<any> {
    return new Observable<any>(observer => {
      this.bidSocket.emit('disconnectUser', {
        email: JSON.parse(localStorage.getItem('userdata')).settings.ril.vendorcodeSelected,
      });
    });
  }

  public supplierBackButtonFromBreadcrumbs(aucId): Observable<any> {
    return new Observable<any>(observer => {
      this.bidSocket.emit('disconnectUser', {
        email: JSON.parse(localStorage.getItem('userdata')).settings.ril.vendorcodeSelected,
        auctionID: aucId
      });
    });
  }

  public socketReconnect(id) {
    this.bidSocket.on('reconnect', (attemptNumber) => {
      this.supplierReconneect(id);
    });
  }

  public supplierReconneect(val) {
    this.bidSocket.emit('userInfo', {
      userID: 1,
      auctionID: val,
      email: JSON.parse(localStorage.getItem('userdata')).settings.ril.vendorcodeSelected,
      status: "Online",
      loggedIn: new Date(),
      loggedOut: new Date()
    });
  }

  public getAllAucData(id): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('auc-' + id + '-all-auction', (data: any) => observer.next(data));
    });
  }

}
