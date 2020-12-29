import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from "react-redux"
import  configureStore from "store"
import App from './App';
import reportWebVitals from './reportWebVitals';
import {configureAxios} from "core/services/interceptor.service"
import {ThemeProvider,CssBaseline} from "@material-ui/core"
import {ChakraProvider} from "@chakra-ui/react"
import {ChakraTheme,MaterialTheme} from "theme"



const store = configureStore()
configureAxios()

const Root = () => (
  <React.StrictMode>
    <Provider store={store} >
        <ChakraProvider theme={ChakraTheme} >
            <ThemeProvider theme={MaterialTheme}>
              <CssBaseline/> 
              <App />
            </ThemeProvider>
        </ChakraProvider>
    </Provider>
  </React.StrictMode>
)

ReactDOM.render(
  <Root/>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
