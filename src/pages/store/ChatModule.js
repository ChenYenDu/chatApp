import firebase from "firebase/app";

const ChatModule = {
  state: {
    contacts: [],
  },
  getters: {
    contacts: state => state.contacts,
  },
  mutations: {
    setContacts(state, payload){
        state.contacts = payload;
    },
  },
  actions: {
    getAllUsers({commit}){
        var promise = new Promise((resolve, reject) => {
            firebase.database().ref('users').on('value', function(snapshot){
                commit('setContacts', snapshot.val())
                resolve(snapshot.val())
            })
        })
        return promise
    }
  }
};

export default ChatModule;
