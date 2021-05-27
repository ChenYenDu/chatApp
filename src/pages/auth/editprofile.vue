<template>
  <f7-page name="editprofile">
    <f7-navbar title="Edit Profile"></f7-navbar>

    <div class="wrapper">
      <img
        class="image--cover"
        :src="image_url"
        alt=""
        @click="launchFilePicker"
      />
    </div>

    <f7-block-title>Sign in</f7-block-title>
    <f7-list no-hairlines-md>
      <f7-list-input
        label="Name"
        :value="display_name"
        @input="display_name = $event.target.value"
        type="text"
        placeholder="User Name"
        clear-button
      >
      </f7-list-input>
    </f7-list>

    <f7-block>
      <f7-button outline @click="updateProfile">Update Profile</f7-button><br />
      <input
        type="file"
        ref="file"
        style="display: none"
        @change="onFilePicked"
      />
    </f7-block>
    {{ display_name }}
  </f7-page>
</template>

<script>
// import { f7 } from "framework7-vue";
import { mixin } from "../../js/mixin";
import firebase from "firebase/app";

export default {
  mixins: [mixin],
  props: {
    f7router: Object,
  },
  data() {
    return {};
  },
  computed: {
    image_url() {
      return this.$store.getters.image_url;
    },
    files() {
      return this.$store.getters.files;
    },
    photo_url() {
      return this.$store.getters.photo_url;
    },
    display_name: {
      get: function () {
        return this.$store.getters.display_name;
      },
      set: function (value) {
        this.$store.commit("setDisplayName", value);
      },
    },
  },
  watch: {},
  methods: {
    launchFilePicker() {
      let self = this;
      self.$refs.file.click();
    },
    onFilePicked() {
      let self = this;
      // read the image file
      self.$store.dispatch("readFile");
    },
    updateProfile() {
      const self = this;
      if (self.files) {
        var user = firebase.auth().currentUser;
        if (this.photo_url != null) {
            console.log(this.photo_url)
          var storage = firebase.storage();
          var httpReference = storage.refFromURL(this.photo_url);
          httpReference
            .delete()
            .then(() => {})
            .catch((error) => {
              console.log(error);
            });
        }

        self.$store.dispatch('uploadFile').then(url => {
            user.updateProfile({
                displayName: self.displayName,
                photoURL: url
            }).then(()=>{
                self.$store.commit('setPhotoURL', user.photoURL);
                self.$store.commit('setDisplayName', user.displayName);
                firebase.database().ref('users/'+user.uid).update({
                    photo_url: user.photoURL,
                    display_name: user.displayName,
                })
            }).catch(error => {
                console.log(error)
            })
        })

      } else {
          user.updateProfile({
              displayName: self.display_name,

          }).then(()=>{
              self.$store.commit('setDisplayName', self.displayName)
          }).catch(error => {
              console.log(error)
          })
      }
    },
  },
  created: function () {
    if (this.photo_url != null) {
      this.$store.commit("setImageURL", this.photo_url);
    }
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
