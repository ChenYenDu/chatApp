import firebase from "firebase/app";

const AuthModule = {
  state: {
    signed_in: false,
    signed_up: false,
    show_resend_email: false,
    photo_url: null,
    displayName: null,
  },
  getters: {
    signed_up: (state) => state.signed_up,
    signed_in: (state) => state.signed_in,
    show_resend_email: (state) => state.show_resend_email,
    photo_url: (state) => state.photo_url,
    display_name: (state) => state.display_name,
  },
  mutations: {
    setSignedIn(state, payload) {
      state.signed_in = payload;
    },
    setSignedUp(state, payload) {
      state.signed_up = payload;
    },
    setShowResendEmail(state, payload) {
      state.show_resend_email = payload;
    },
    setPhotoURL(state, payload) {
      state.photo_url = payload;
    },
    setDisplayName(state, payload) {
      state.display_name = payload;
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
          firebase.auth().onAuthStateChanged(function (user) {
            if (user.emailVerified) {
              // User is signed in.
              commit("setSignedIn", true);
              commit("setAlertMessage", `Welcome ${user.displayName}`);
              console.log("verified");
              commit("setShowResendEmail", false);
            } else {
              // No user is signed in.
              commit("setSignedIn", false);
              commit("setAlertMessage", "Please verify with your email.");
              commit("setShowResendEmail", true);
            }
          });
        })
        .catch((error) => {
          // var errorCode = error.code;
          // var errorMessage = error.message;
          commit("setAlertMessage", error.message);
        });
    },
    signOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit("setSignedIn", false);
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
