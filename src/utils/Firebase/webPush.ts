import "firebase/messaging"
import Firebase from "utils/Firebase/firebase"
import useToast, { ToastFunc } from "utils/Toast"


class firebaseMessaging {
    toast:ToastFunc
    firebase:Firebase
    private permission: "granted" | "default" | "denied" = "default"
    constructor(
        toast:ToastFunc,
        firebase:Firebase
        ){
            this.toast = toast
            this.firebase = firebase
            this.init()
    }
    init () {
        return Notification.requestPermission().then(payload => {
            this.permission = payload
        }).catch(err => {
            this.toast({
                messageType:"info",
                title:"Unable to send Permission",
                subtitle:"Please allow thefaithful to be able to send notification for the ultimate experience"
            })
        })
    }
    async getToken () {
        if(this.permission === "granted"){
            const response = await this.firebase.messaging.getToken()
            return response
        }else{
            this.toast({
                messageType:"info",
                title:"Unable to send Permission",
                subtitle:"Please allow thefaithful to be able to send notification for the ultimate experience"
            })
        }
    }
}

export {firebaseMessaging}