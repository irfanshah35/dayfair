/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

export const useAppStore = create<any>((set) => ({
  userBalance: null,

  allEventsList: null,
  casinoEvents: null,
  exchangeTypeList: null,
  menuList: null,
  exchangeNews: null,

  
  setCasinoEvents: (data: any) => set({ casinoEvents: data }),
  setExchangeTypeList: (data: any) => set({ exchangeTypeList: data }),
  setMenuList: (data: any) => set({ menuList: data }),
  setallEventsList: (data: any) => set({ allEventsList: data }),
  setExchangeNews: (data: any) => set({ exchangeNews: data }),


  // auth setter
  setUserBalance: (value: boolean) => set({ userBalance: value }),

 

//   reset: () =>
//     set({
//       trendingList: [],
//       allEventsList: [],
//       isAuthUser: false,
//       AllSportList: [],
//       isLoginOpen: false,
//       isRegisterOpen: false,
//     }),
}));
