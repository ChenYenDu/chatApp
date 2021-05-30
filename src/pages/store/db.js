import firebase from "firebase/app";

export let firerequest = firebase.database().ref('/requests');
export let firefriends = firebase.database().ref('/friends');
