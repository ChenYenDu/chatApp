<template>
  <f7-page name="about">
    <f7-navbar title="Request" back-link="Back"></f7-navbar>
    <f7-block-title>Requests</f7-block-title>
    <pre>{{friend_requests}}</pre>
  </f7-page>
</template>


<script>
export default {
  computed: {
    friend_requests() {
      return this.$store.getters.friend_requests;
    }
  },
  created(){
    this.$store.dispatch('getMyRequests')
  }
}
</script>