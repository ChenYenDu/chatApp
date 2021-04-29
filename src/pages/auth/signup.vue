<template>
  <f7-page name="signup">
    <f7-navbar title="Sign up" back-link="Back"></f7-navbar>

    <div class="wrapper">
      <img class="image--cover" :src="image_url" alt="" @click="launchFilePicker"/>
    </div>

    <f7-block-title>Sign in</f7-block-title>
    <f7-list no-hairlines-md>
      <f7-list-input
        label="Name"
        :value="name"
        @input="name = $event.target.value"
        type="text"
        placeholder="User Name"
        clear-button
      >
      </f7-list-input>

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
      <f7-button outline @click="signUp">Sign up</f7-button><br />
    <input type="file" ref="file" style="display: none;" @change="onFilePicked">
    </f7-block>
  </f7-page>
</template>

<script>
// import { f7 } from "framework7-vue";
import { mixin } from '../../js/mixin';

export default {
  mixins: [mixin],
  data() {
    return {
      name: null,
      email: null,
      password: null,
      
    };
  },
  computed: {
    image_url(){
      let self = this;
      return self.$store.getters.image_url;
    }
  },
  
  methods: {
    launchFilePicker(){
      let self = this;
      self.$refs.file.click()
    },
    onFilePicked(){
      let self = this;
      // read the image file
      self.$store.dispatch('readFile')
    },
    signUp() {
      const self = this;
      var payload = {};
      payload.name = self.name;
      payload.email = self.email;
      payload.password = self.password;
      payload.photoURL = self.image_url;
      this.$store.dispatch("signUp", payload);
    },
    
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
