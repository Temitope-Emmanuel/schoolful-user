import React from "react"
import {Box} from "@material-ui/core"
import {makeStyles,createStyles} from "@material-ui/core/styles"
import {HubConnection} from "@aspnet/signalr"


const useStyles = makeStyles((theme) => createStyles({
    root:{

    }
}))


interface IProps {
    connection:HubConnection
}

const ListMessage:React.FC<IProps> = ({connection}) => {
    const classes = useStyles()

    React.useEffect(() => {
        connection.on("ReceiveMessageApi",() => {

        })
    },[])

    return(
        <Box className={classes.root}>
            
        </Box>
    )
}

export default ListMessage