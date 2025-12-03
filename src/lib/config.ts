export const BASE_URL = "https://t20exch.com";
export const BASE_URL_WS = "https://t20exch.com";

// const BASE_URL = "";
// export const BASE_URL_WS = "";

export const CONFIG = {
  SiteName: "exchange",
  siteKey: "7",
  userLogin: BASE_URL + "/app/users/playerLogin",
  getUserProfile: "/app/exchange/users/userProfile",
  getBallByBallMarket: "/api/exchange/markets/getBallByBallMarket",
  videoStreamURL: "/api/exchange/streaming/exchEventsStreaming",
  getUserBalance: "/app/exchange/users/userBalance",
  getExposureListURL: "/app/exchange/users/userEventsExposure",
  eventMatchedBetList: "/app/exchange/users/betlist/eventMatchedBetList",
  getAllEventsList: "/api/navigation/allEventsList", //done
  getAllEventsListTime: 1440,
  getSportsList: "/api/exchange/sports/sportsList", //done
  getSportsListTime: 1440, //done
  getTopCasinoGame: "/api/navigation/casinoEvents", // =---=  Done
  getTopCasinoGameTime: 1440,
  casinoTableList: "/api/exchange/navigations/casino/casinoTableList",
  casinoTabList: "/api/exchange/navigations/casino/casinoTabList",
  casinoInternational: "/api/exchange/navigations/internationalCasinoList",
  casinoInternationalTime: 1440,
  menuList: "/api/navigation/menuList",
  menuListTime: 1440,
  getIpLocation: "https://pro.ip-api.com/json/?key=qSA5ctYZHdWsx04",
  getUserBetStake: "/app/exchange/users/userBetStakeList",
  getUserBetStakeTime: 518400,
  getRules: "/api/exchange/rules/getSportsRule",
  getRulesTime: 1440,
  activityList: "/app/exchange/users/userActivityLogs",
  changeUserPassword: "/app/exchange/users/userChangePassword",
  getSlider: "/api/navigation/sliderList", //done
  getSliderTime: 20,
  getBanner: "/api/navigation/bannersList",
  getBannerTime: 20,
  getExchangeTypeList: "/api/navigation/exchangeTypeList",
  getExchangeTypeListTime: 1440,
  getExchangeNews: "/api/navigation/exchangeNews", // done
  getExchangeNewsTime: 120,
  statement: "/app/exchange/users/userAccountStatement",
  profitLoss: "/app/exchange/users/pl/userSportsProfitlossNew",
  newProfitLoss: "/app/exchange/users/pl/userSportsProfitlossNew",
  profitLossEvents: "/app/exchange/users/pl/userEventsProfitlossNew",
  betHistory: "/app/exchange/users/userBetList",
  marketList: "/api/navigation/marketList",
  getRacingEvents: "/api/navigation/racingEventsList", //done
  getRacingEventsTime: 20, //done
  userUpdateStackValueURL: "/app/exchange/users/updateUserBetStake",
  profitLossMarket: "/app/exchange/users/pl/userMarketsProfitlossNew",
  getAllMarketplURL: "/app/exchange/users/pl/getMatchOddsPl",
  placeBetURL: "/app/exchange/users/placebet",
  unmatchedBets: "/app/exchange/users/matchedUnmatchedBets",
  cancelBetsAllUnmatchedBets: "/app/exchange/users/cancelBets",
  getMarketBook: "/app/exchange/users/pl/marketBook",

  exchEventsStreaming: "/api/streaming/exchEventsStreaming",
  getSponserDetailsURL: "/v1/exchange/sponsor/sponsorshipsDetails",

  profitLossHistory: "/app/exchange/users/bet/userMarketBetsNew",
};

export const STACK_VALUE = [
  {
    stakeName: "1000",
    stakeAmount: "1000",
  },
  {
    stakeName: "5000",
    stakeAmount: "5000",
  },
  {
    stakeName: "10000",
    stakeAmount: "10000",
  },
  {
    stakeName: "25000",
    stakeAmount: "25000",
  },
  {
    stakeName: "50000",
    stakeAmount: "50000",
  },
  {
    stakeName: "100000",
    stakeAmount: "100000",
  },
  {
    stakeName: "200000",
    stakeAmount: "200000",
  },
  {
    stakeName: "500000",
    stakeAmount: "500000",
  },
];

export const DefaultStackForT20worldexch = [
  {
    stakeName: "25000",
    stakeAmount: "25000",
  },
  {
    stakeName: "50000",
    stakeAmount: "50000",
  },
  {
    stakeName: "100000",
    stakeAmount: "100000",
  },
  {
    stakeName: "200000",
    stakeAmount: "200000",
  },
  {
    stakeName: "500000",
    stakeAmount: "500000",
  },
  {
    stakeName: "1000000",
    stakeAmount: "1000000",
  },
  {
    stakeName: "2000000",
    stakeAmount: "2000000",
  },
  {
    stakeName: "5000000",
    stakeAmount: "5000000",
  },
];
