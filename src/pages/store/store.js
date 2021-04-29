import { createStore } from 'vuex';
import AuthModule from './AuthModule';

// Create a new store instance.
const store = createStore({
  modules: {
    auth: AuthModule,
  },
  state() {
    return {
      count: 0,
      message: 'message from vue',
    };
  },
  mutations: {},
  getters: {},
});

export default store;
