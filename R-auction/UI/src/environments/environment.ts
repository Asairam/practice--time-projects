// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  flag: "local",
  production: true,
  rauction: "",
  baseUrlCore: "http://rauctiondev.ril.com/pnc/",
  baseUrlAuction: "http://rauctiondev.ril.com/pnc/",
  baseUrlMachineLearning: "http://10.26.32.135:5104/pnc/",
  userProfile: "http://rauctiondev.ril.com/pnc/",
  commonUrlDocument: "http://rauctiondev.ril.com/commons/",
  applicationUrl: "http://rauctiondev.ril.com/rauction/",
  loginUrl: "http://rauctiondev.ril.com/security/login",
  baseUrlBid: "http://rauctiondev.ril.com/pnc/",
  baseUrlMaterial: "http://rauctiondev.ril.com/pnc/",
  appID: '5cf8b396e6f83a0013ad1a65',
  socketURL: { auction: "http://rauctiondev.ril.com", auctionURL: "/pnc/auction/scheduler", bid: "http://rauctiondev.ril.com", bidURL: "/pnc/auction/bid", query: "http://rauctiondev.ril.com", queryURL: "/pnc/auction/query" },

  // IIMS
  IIMS: "http://rsevadev.ril.com",

  // ELK dashboard
  apmUrl: "http://rauctiondev.ril.com/apmrum/",
  geoApiUrl: "https://locationapi.ril.com/geolocation/loc-by-ip/",
  serviceName: "RA_AJ_PnCAuctionMobileUI",
  initialPageLoadName: "rauction",
  application: "RAuctions",
  component_name: "AuctionUI",
  platform: "PNC",
  sub_platform: "Intelligent Esourcing",
  featureFlags: {
    iims_feature: true
  },
  
  digitalplatform: "http://digitalplatformsdev.ril.com/",
  GUID: '8f4bcbca-0abc-11eb-8e57-000d3af0328d'
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.