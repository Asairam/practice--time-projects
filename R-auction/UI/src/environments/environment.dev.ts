export const environment = {
  flag: "dev",
  production: true,
  baseUrlCore: "/pnc/",
  rauction: "/rauction/",
  baseUrlAuction: "/pnc/",
  baseUrlMachineLearning: "http://10.26.32.135:5104/pnc/",
  userProfile: "/pnc/",
  commonUrlDocument: "/commons/",
  applicationUrl: "http://rauctiondev.ril.com/rauction/",
  loginUrl: "http://rauctiondev.ril.com/security/login",
  baseUrlBid: "/pnc/",
  baseUrlMaterial: "/pnc/",
  appID: '5cf8b396e6f83a0013ad1a65',
  socketURL: { 
    auction: "http://rauctiondev.ril.com",  
    bid: "http://rauctiondev.ril.com", 
    auctionURL: "/pnc/auction/scheduler",
    bidURL: "/pnc/auction/bid", 
    queryURL: "/pnc/auction/query",
    query: "http://rauctiondev.ril.com"
   },

  // IIMS
  IIMS: "http://rsevadev.ril.com",

  // ELK dashboard
  apmUrl: "http://rauctiondev.ril.com/apmrum/",
  
  initialPageLoadName: "rauction",
  geoApiUrl: "https://locationapi.ril.com/geolocation/loc-by-ip/",
  serviceName: "RA_AJ_PnCAuctionMobileUI",
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

