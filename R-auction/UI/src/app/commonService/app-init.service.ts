import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class AppInitService {
  constructor(private httpClient: HttpClient) {
  }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }

  loadUrls(): Promise<any> {
    const promise = this.httpClient.get('./assets/config/environment.json')
      .toPromise()
      .then((env: any) => {
        environment.flag = env.flag;
        environment.rauction = env.rauction;
        environment.production = env.production;
        environment.baseUrlCore = env.baseUrlCore;
        environment.baseUrlAuction = env.baseUrlAuction;
        environment.baseUrlMachineLearning = env.baseUrlMachineLearning;
        environment.userProfile = env.userProfile;
        environment.commonUrlDocument = env.commonUrlDocument;
        environment.applicationUrl = env.applicationUrl;
        environment.loginUrl = env.loginUrl;
        environment.appID = env.appID;
        environment.baseUrlBid = env.baseUrlBid;
        environment.baseUrlMaterial = env.baseUrlMaterial;
        environment.socketURL = env.socketURL;
        environment.IIMS = env.IIMS;
        environment.apmUrl = env.apmUrl;
        environment.geoApiUrl = env.geoApiUrl;
        environment.serviceName = env.serviceName;
        environment.initialPageLoadName = env.initialPageLoadName;
        environment.application = env.application;
        environment.component_name = env.component_name;
        environment.platform = env.platform;
        environment.sub_platform = env.sub_platform;
        environment.featureFlags = env.featureFlags;
        environment.digitalplatform = env.digitalplatform;
        environment.GUID = env.GUID;
       
        return env;
      }, (err) => {
        
      });
    return promise;
  }
}