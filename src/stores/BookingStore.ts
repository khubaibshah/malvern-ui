import { defineStore } from 'pinia';

export const useBookingStore = defineStore({
  id: 'booking',
  state: () => ({
    fullBookingDetails: {} as any,
  }),
  actions: {
    setFullBookingDetails(details: any) {
      this.fullBookingDetails = details;
    },
  },
});
