import React from 'react';
import history from "utils/history"
import {Router} from "react-router-dom"
import MainRouter from "./MainRouter"
import './App.css';
import {useDispatch} from "react-redux"
import {logout,setCurrentUser,hideAuthLoading} from "store/System/actions"
import * as userService from "core/services/user.service"
import * as authManager from "utils/auth"
import useToast from "utils/Toast"
import {useFirebaseService} from "utils/Firebase/context"

const App = () => {
  const dispatch = useDispatch();
  const toast = useToast()
  const token = authManager.getToken();
  const userDetail = JSON.parse(authManager.getUserDetail() as string)
  const windowsLocation = window.location.href
  const firebase = useFirebaseService()

  React.useEffect(() => {
    firebase?.messaging.onMessage(data => {
      toast({
        messageType:"info",
        title:data.title,
        subtitle:data.body
      })
    })

    if(!token || !userDetail){
      logout(windowsLocation.includes("church"))
    }else{
      userService.verifyToken(token).then(payload => {
        if(!payload) dispatch(logout());
        const {auth_token,refreshToken} = payload.data;
        authManager.saveToken(refreshToken)
        const newUserDetail = {
          ...userDetail,
          auth_token
        }
        authManager.saveUserDetail(JSON.stringify(newUserDetail))
        const savedUserDetail = JSON.parse(authManager.getUserDetail() as string)
        dispatch(setCurrentUser(savedUserDetail,toast))
      }).catch((err) => {
        dispatch(hideAuthLoading())
        toast({
          title:"Please Login Again",
          subtitle:`Error: ${err}`,
          messageType:"info"
        })
        logout(windowsLocation.includes("church"));
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  return (
      <Router history={history}>
        <MainRouter/>
      </Router>
  );
}

export default App;