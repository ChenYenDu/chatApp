<template>
  <f7-page name="signup">
    <f7-navbar title="Sign up"
               back-link="Back"></f7-navbar>

    <div class="wrapper">
      <img class="image--cover" :src="image_url"
           alt="">
    </div>

    <f7-block-title>Sign in</f7-block-title>
    <f7-list no-hairlines-md>

      <f7-list-input label="Name"
                     :value="name"
                     @input="name=$event.target.value"
                     type="text"
                     placeholder="User Name"
                     clear-button>

      </f7-list-input>

      <f7-list-input label="E-mail"
                     :value="email"
                     @input="email=$event.target.value"
                     type="email"
                     placeholder="Your e-mail"
                     clear-button>

      </f7-list-input>

      <f7-list-input label="Password"
                     :value="password"
                     @input="password=$event.target.value"
                     type="password"
                     placeholder="Your password"
                     clear-button>

      </f7-list-input>

    </f7-list>

    <f7-block>
      <f7-button outline @click="signUp">Sign up</f7-button><br>
      <br>


    </f7-block>

  </f7-page>
</template>

<script>
export default {
  data() {
    return {
      name: null,
      email: null,
      password: null,
      image_url:
        "https://maxcdn.icons8.com/Share/icon/Users//user_male_circle_filled1600.png",
    };
  },
  methods: {
    signUp(){
      const self = this;
      var payload = {}
      payload.name = self.name;
      payload.email = self.email;
      payload.password = self.password;
      payload.photoURL = self.image_url;
      this.$store.dispatch('signUp', payload)
    }
  }
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
