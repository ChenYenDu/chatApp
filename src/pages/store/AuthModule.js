import firebase from "firebase/app";

const AuthModule = {
  state: {
    signed_in: false,
    signed_up: false,
  },
  getters: {
    signed_up: (state) => state.signed_up,
    signed_in: (state) => state.signed_in,
  },
  mutations: {
    setSignedIn(state, payload) {
      state.signed_in = payload;
    },
    setSignedUp(state, payload) {
      state.signed_up = payload;
    },
  },
  actions: {
    signIn({ commit }, payload) {
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then((userCredential) => {
          // Signed in
          // var user = userCredential.user;
          // ...
          commit('setSignedIn', true)
        })
        .catch((error) => {
          // var errorCode = error.code;
          // var errorMessage = error.message;
          commit('setAlertMessage', error.message);
        });
    },
    signUp({ commit, dispatch }, payload) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then((data) => {
          firebase.database().ref("users").child(data.user.uid).set({
            uid: data.user.uid,
            name: payload.name,
            email: payload.email,
            emailverified: false,
            photo_url: payload.photoURL,
          });
          let newuser = data.user;
          newuser
            .updateProfile({
              displayName: payload.name,
              photoURL: payload.photoURL,
            })
            .then(() => {
              dispatch("sentVerification");
              commit("setSignedUp", true);
              console.log("updated profile");
            })
            .catch((err) => {
              console.log(err.message);
              commit("setAlertMessage", err.message);
            });
        })
        .catch((err) => {
          console.log(err.message);
          commit("setAlertMessage", err.message);
        });
    },
    sentVerification({ commit }) {
      var user = firebase.auth().currentUser;

      user
        .sendEmailVerification()
        .then(function () {
          // Email sent.
          commit(
            "setAlertMessage",
            `A verification email has been sent to ${user.email}`
          );
        })
        .catch(function (error) {
          // An error happened.
        });
    },
  },
};

export default AuthModule;
