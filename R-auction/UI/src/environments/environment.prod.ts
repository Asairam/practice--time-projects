export const environment = {
  flag: "prod",
  production: true,
  baseUrlCore: "/pnc/",
  rauction: "/rauction/",
  baseUrlAuction: "/pnc/",
  baseUrlMachineLearning: "http://10.26.32.135:5104/pnc/",
  userProfile: "/pnc/",
  commonUrlDocument: "/commons/",
  applicationUrl: "https://rauctions.ril.com/rauction/",
  loginUrl: "https://rauctions.ril.com/security/login",
  // baseUrlCommon:"http://10.26.32.135:5032/",
  baseUrlBid: "/pnc/",
  baseUrlMaterial: "/pnc/",
  appID: '5cf8b396e6f83a0013ad1a65',
  socketURL: {     
    queryURL: "/pnc/auction/query",
    auction: "https://rauctions.ril.com", 
    auctionURL: "/pnc/auction/scheduler", 
    bid: "https://rauctions.ril.com", 
    bidURL: "/pnc/auction/bid", 
    query: "https://rauctions.ril.com"
  },

  // IIMS
  IIMS: "https://rseva.ril.com",

  // ELK dashboard
  apmUrl: "https://rauctions.ril.com/apmrum/",
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
  digitalplatform: "https://digitalplatforms.ril.com/",
  GUID:"2ed42ad4-32fe-11eb-be63-005056928059"
};
