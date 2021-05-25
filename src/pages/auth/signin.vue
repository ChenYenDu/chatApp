<template>
  <f7-page name="Signin">
    <f7-navbar title="Sign in" back-link="Back"></f7-navbar>
    <f7-block-title>Sign in</f7-block-title>
    <f7-list no-hairlines-md>
      <f7-list-input
        label="E-mail"
        :value="email"
        @input="email = $event.target.value"
        type="email"
        placeholder="Your e-mail"
        clear-button
      >
      </f7-list-input>

      <f7-list-input
        label="Password"
        :value="password"
        @input="password = $event.target.value"
        type="password"
        placeholder="Your password"
        clear-button
      >
      </f7-list-input>
    </f7-list>

    <f7-block>
      <f7-button outline @click="signIn">Sign in</f7-button><br />
      <br />

      <div style="text-align: center">
        <f7-link v-if="show_resend_email" @click="resendEmail" :color="color(time_left)">Resend Confirmation Email<span v-if="time_left > 0">({{time_left}})</span></f7-link><br />
        <f7-link href="/signup/">Dont' have an account? Sign up</f7-link><br />
        <f7-link>Forget Password</f7-link><br />
      </div>
    </f7-block>
  </f7-page>
</template>

<script>
import { mixin } from "../../js/mixin";

export default {
  mixins: [mixin],
  data() {
    return {
      email: null,
      password: null,
      time_left: -1,
    };
  },
  methods: {
    color(timeleft){
      if (timeleft <= 0) {
        return '#007aff'
      } else {
        return 'gray'
      }
    },
    resendEmail() {
      const self = this;
      if (self.time_left <= 0) {
        self.$store.dispatch("sendVerification");
        self.countDown()
      }
    },
    countDown() {
      const self = this;

      self.time_left = 20;
      var timer = setInterval(function () {
        self.time_left -= 1;
        if (self.time_left <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    },
    signIn() {
      var payload = {};
      payload.email = this.email;
      payload.password = this.password;
      this.$store.dispatch("signIn", payload);
    },
  },
  computed: {
    show_resend_email: function(){
      return this.$store.getters.show_resend_email
    }
  }
};
</script>
