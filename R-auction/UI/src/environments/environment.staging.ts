export const environment = {
  flag: "staging",
  production: true,
  baseUrlCore: "/pnc/",
  rauction: "/rauction/",
  baseUrlAuction: "/pnc/",
  baseUrlMachineLearning: "/pnc/",
  userProfile: "/pnc/",
  commonUrlDocument: "/commons/",
  applicationUrl: "https://rauctionqa.ril.com/rauction/",
  loginUrl: "https://rauctionqa.ril.com/security/login",
  // baseUrlCommon:"https://10.26.32.135:5032/",
  baseUrlBid: "/pnc/",
  baseUrlMaterial: "/pnc/",
  appID: '5cf8b396e6f83a0013ad1a65',
  socketURL: { 
    auction: "https://rauctionqa.ril.com", 
    bid: "https://rauctionqa.ril.com",
    auctionURL: "/pnc/auction/scheduler", 
    bidURL: "/pnc/auction/bid", query: "https://rauctionqa.ril.com", queryURL: "/pnc/auction/query" },

  // IIMS
  IIMS: "https://rsevaqa.ril.com",

  // ELK dashboard
  apmUrl: "https://rauctionqa.ril.com/apmrum/",
  serviceName: "RA_AJ_PnCAuctionMobileUI",
  initialPageLoadName: "rauction",  
  geoApiUrl: "https://locationapi.ril.com/geolocation/loc-by-ip/",
  application: "RAuctions",
  component_name: "AuctionUI",
  platform: "PNC",
  sub_platform: "Intelligent Esourcing",
  featureFlags: {
    iims_feature: true
  },
  digitalplatform: "https://digitalplatformsqa.ril.com/",
  GUID: 'beb67278-2e3e-11eb-9cb2-000d3a3e22ff'
};
