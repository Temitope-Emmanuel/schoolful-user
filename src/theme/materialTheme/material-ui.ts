// import {createMuiTheme} from "@material-ui/core/styles"
import {createMuiTheme} from "@material-ui/core"


const theme = createMuiTheme({
    palette:{
        primary:{
            light:'#5c67a3',
            main:'#3f4771',
            dark:'#2e355b',
            contrastText:'#fff'
        },
        secondary:{
            light:'#ff79b0',
            main:'#ff4081',
            dark:'#c60055',
            contrastText:'#000'
        },
        type:'light'
    },
      // eslint-disable-next-line
    // shadows:{
    //     ...(shadows as any)
    // }
})

export default theme


// const theme = createMuiTheme({})
// export default theme