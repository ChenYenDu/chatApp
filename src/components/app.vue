<template>
  <f7-app v-bind="f7params">
    <!-- Left panel with cover effect-->
    <f7-panel left cover theme-dark>
      <f7-view>
        <f7-page>
          <div class="wrapper">
            <img class="image--cover" :src="photo_url" alt="" />
          </div>
            <f7-block style="text-align: center;">{{ display_name }}</f7-block>          
          <f7-list>
            <f7-list-item
              link="/signin/"
              view=".view-main"
              panel-close
              title="Sign in"
            ></f7-list-item>
            <f7-list-item
              @click="signOut"
              view=".view-main"
              panel-close
              title="Sign out"
            ></f7-list-item>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Right panel with reveal effect-->
    <!-- <f7-panel right reveal theme-dark>
      <f7-view>
        <f7-page>
          <f7-navbar title="Right Panel"></f7-navbar>
          <f7-block>Right panel content goes here</f7-block>
        </f7-page>
      </f7-view>
    </f7-panel> -->

    <!-- Views/Tabs container -->
    <f7-views tabs class="safe-areas" v-if="signed_in">
      <!-- Tabbar for switching views-tabs -->
      <f7-toolbar tabbar labels bottom>
        <f7-link
          tab-link="#view-home"
          tab-link-active
          icon-ios="f7:house_fill"
          icon-aurora="f7:house_fill"
          icon-md="material:home"
          text="Home"
        ></f7-link>
        <f7-link
          tab-link="#view-catalog"
          icon-ios="f7:square_list_fill"
          icon-aurora="f7:square_list_fill"
          icon-md="material:view_list"
          text="Catalog"
        ></f7-link>
        <f7-link
          tab-link="#view-settings"
          icon-ios="f7:gear"
          icon-aurora="f7:gear"
          icon-md="material:settings"
          text="Edit Profile"
        ></f7-link>
      </f7-toolbar>

      <!-- Your main view/tab, should have "view-main" class. It also has "tab-active" class -->
      <f7-view id="view-home" main tab tab-active url="/"></f7-view>

      <!-- Catalog View -->
      <f7-view id="view-catalog" name="catalog" tab url="/catalog/"></f7-view>

      <!-- Settings View -->
      <f7-view
        id="view-settings"
        name="editprofile"
        tab
        url="/editprofile/"
      ></f7-view>
    </f7-views>

    <f7-view v-if="!signed_in" url="/signin/" :main="true"> </f7-view>

    <!-- Popup -->
    <f7-popup id="my-popup">
      <f7-view>
        <f7-page>
          <f7-navbar title="Popup">
            <f7-nav-right>
              <f7-link popup-close>Close</f7-link>
            </f7-nav-right>
          </f7-navbar>
          <f7-block>
            <p>Popup content goes here.</p>
          </f7-block>
        </f7-page>
      </f7-view>
    </f7-popup>

    <f7-login-screen id="my-login-screen">
      <f7-view>
        <f7-page login-screen>
          <f7-login-screen-title>Login</f7-login-screen-title>
          <f7-list form>
            <f7-list-input
              type="text"
              name="username"
              placeholder="Your username"
              v-model:value="username"
            ></f7-list-input>
            <f7-list-input
              type="password"
              name="password"
              placeholder="Your password"
              v-model:value="password"
            ></f7-list-input>
          </f7-list>
          <f7-list>
            <f7-list-button
              title="Sign In"
              @click="alertLoginData"
            ></f7-list-button>
            <f7-block-footer>
              Some text about login information.<br />Click "Sign In" to close
              Login Screen
            </f7-block-footer>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-login-screen>
  </f7-app>
</template>
<script>
import firebase from "firebase";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { f7, f7ready } from "framework7-vue";
import { getDevice } from "framework7/lite-bundle";
import cordovaApp from "../js/cordova-app.js";

import routes from "../js/routes.js";
import store from "../js/store";

var firebaseConfig = {
  apiKey: "AIzaSyAvrLjREQZtcNlIrFFcrzYf9SQIyxTGKJ0",
  authDomain: "whatchat-d85d9.firebaseapp.com",
  projectId: "whatchat-d85d9",
  storageBucket: "whatchat-d85d9.appspot.com",
  messagingSenderId: "229551218223",
  appId: "1:229551218223:web:3a979b01d86713a453b0da",
};

firebase.initializeApp(firebaseConfig);

export default {
  setup() {
    const device = getDevice();
    // Framework7 Parameters
    const f7params = {
      name: "chatApp", // App name
      theme: "auto", // Automatic theme detection

      id: "io.framework7.chatapp", // App bundle ID
      // App store
      store: store,
      // App routes
      routes: routes,

      // Input settings
      input: {
        scrollIntoViewOnFocus: device.cordova && !device.electron,
        scrollIntoViewCentered: device.cordova && !device.electron,
      },
      // Cordova Statusbar settings
      statusbar: {
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
      },
    };
    // Login screen data
    const username = ref("");
    const password = ref("");

    const alertLoginData = () => {
      f7.dialog.alert(
        "Username: " + username.value + "<br>Password: " + password.value,
        () => {
          f7.loginScreen.close();
        }
      );
    };

    // Identify if user is signed in
    const stores = useStore();
    const signed_in = computed(() => {
      return stores.getters.signed_in;
    });
    const photo_url = computed(() => {
      return stores.getters.photo_url;
    });
    const display_name = computed(() => {
      return stores.getters.display_name;
    });

    const signOut = () => {
      const app = f7;
      stores.dispatch("signOut");
      app.panel.close();
    };

    onMounted(() => {
      f7ready(() => {
        // Init cordova APIs (see cordova-app.js)
        if (device.cordova) {
          cordovaApp.init(f7);
        }

        // Call F7 APIs here
      });
    });

    return {
      f7params,
      username,
      password,
      alertLoginData,
      signed_in,
      photo_url,
      display_name,
      signOut,
    };
  },
};
</script>

<style scoped>
.wrapper {
  text-align: center;
}

.image--cover {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 20px;
  object-fit: cover;
  object-position: center;
}
</style>
