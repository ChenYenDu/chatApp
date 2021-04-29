import { f7 } from "framework7-vue";

export const mixin = {
  computed: {
    alert_message() {
      let self = this;
      return self.$store.getters.alert_message;
    },
  },
  watch: {
    alert_message(value) {
      let self = this;
      self.showToastBottom(value);
      setTimeout(() => {
        self.$store.commit("setAlertMessage", null);
      });
    },
  },
  methods: {
    showToastBottom(text) {
      const self = this;

      // Create toast
      if (!self.toastBottom || self.toastBottom.destroyed) {
        self.toastBottom = f7.toast.create({
          text: text,
          closeTimeout: 2000,
          destroyOnClose: true,
        });
      }

      // Open it
      self.toastBottom.open();
    },
  },
};
