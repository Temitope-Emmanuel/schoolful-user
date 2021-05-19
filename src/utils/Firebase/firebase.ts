import {fbConfig} from "./config"
import firebase from "firebase/app"
import "firebase/messaging"
import "firebase/analytics"

class Firebase {

    public messaging:ReturnType<typeof firebase.messaging>;
    constructor() {
        if(!firebase.apps.length){
            firebase.initializeApp(fbConfig)
            firebase.analytics()
        }else{
            firebase.app()
        }
        this.messaging = firebase.messaging()
    }
}
export default Firebase