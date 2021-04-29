import { createStore } from "vuex";
import AuthModule from "./AuthModule";
import FileModule from "./FileModule";

// Create a new store instance.
const store = createStore({
  modules: {
    auth: AuthModule,
    file: FileModule,
  },
  state() {
    return {
      alert_message: null,
    };
  },
  getters: {
    alert_message: (state) => state.alert_message,
  },
  mutations: {
    setAlertMessage(state, payload){
      state.alert_message = payload
    }
  },
});

export default store;
