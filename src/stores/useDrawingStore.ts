import { defineStore } from "pinia";

export const useDrawingStore = defineStore("drawingStore", {
  state: () => ({
    lineSize: 3,
    lineColor: "#e62222",
  }),
  actions: {},
});
