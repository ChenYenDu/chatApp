import firebase from "firebase/app";
import _, { reject } from "lodash";
import { firerequest, firefriends } from "./db";

const ChatModule = {
  state: {
    contacts: [],
    friend_requests: [],
  },
  getters: {
    contacts: (state) => state.contacts,
    friend_requests: (state) => state.friend_requests,
  },
  mutations: {
    setContacts(state, payload) {
      state.contacts = payload;
    },
    setFriendRequests(state, payload) {
      state.friend_requests = payload;
    },
  },
  actions: {
    confirmRequest({ dispatch }, payload) {
      var promise = new Promise((resolve, reject) => {
        // push friend id to current user friend node
        firefriends
          .child(firebase.auth().currentUser.uid)
          .push({ uid: payload.uid })
          .then(() => {
            // push current user's id to the frineds node
            firefriends
              .child(payload.uid)
              .push({ uid: firebase.auth().currentUser.uid });
          })
          .then(() => {
            dispatch("deleteRequest", payload).then(() => {
              resolve(true);
            });
          })
          .catch((error) => {
            reject(error);
          });
      });

      return promise;
    },
    deleteRequest({}, payload) {
      var promise = new Promise((resolve, reject) => {
        firerequest
          .child(firebase.auth().currentUser.uid)
          .orderByChild("sender")
          .equalTo(payload.uid)
          .once("value", (snapshot) => {
            let userkey;
            for (var key in snapshot.val()) userkey = key;
            firerequest
              .child(firebase.auth().currentUser.uid)
              .child(userkey)
              .remove()
              .then(() => {
                resolve(true);
              })
              .catch((error) => {
                reject(error);
              });
          })
          .catch((error) => {
            reject(error);
          });
      });
      return promise;
    },
    async getMyRequests({ commit, dispatch }) {
      var users = await dispatch("getAllUsers");
      firerequest
        .child(firebase.auth().currentUser.uid)
        .on("value", (snapshot) => {
          var frd_request_id = _.map(snapshot.val(), "sender");
          var userdetails = [];

          _.forEach(frd_request_id, (uid) => {
            var user = _.find(users, ["uid", uid]);
            userdetails.push(user);
          });
          commit("setFriendRequests", userdetails);
        });
    },
    getAllUsers({ commit }) {
      var promise = new Promise((resolve, reject) => {
        firebase
          .database()
          .ref("users")
          .on("value", function (snapshot) {
            commit("setContacts", snapshot.val());
            resolve(snapshot.val());
          });
      });
      return promise;
    },
    sendRequest({ commit }, payload) {
      var promise = new Promise((resolve, reject) => {
        firerequest
          .child(payload.recipient)
          .push({ sender: payload.sender })
          .then(() => {
            resolve({ success: true });
          })
          .catch((err) => {
            reject(err);
          });
      });

      return promise;
    },
  },
};

export default ChatModule;
