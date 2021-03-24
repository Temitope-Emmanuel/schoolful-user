import React from "react"
import {Box,Avatar} from "@material-ui/core"
import {createStyles,makeStyles} from "@material-ui/core/styles"
import {SendMessageToGroup} from "core/models/Chat"


const useStyles = makeStyles((theme) => createStyles({
    root:{
        display:"flex",
        alignItems:"center",
    },
    messageContainer:{
        color:"#000000",
        backgroundColor:"#E9E9E9",
        borderRadius:"10px",
        letterSpacing:"0px",
        padding:theme.spacing(2),
        margin:theme.spacing(0,2),
        maxWidth:"10rem",
        "& > div":{

        }
    }
}))


interface IProps {
    chat:SendMessageToGroup
}


const Message:React.FC<IProps> = ({
    chat
}) => {
    const classes = useStyles()

    return(
        <Box className={classes.root}>
            <Box>
                <Avatar src={chat.groupName}/>
                <Box className={classes.messageContainer}>
                    {chat.text}
                </Box>
                <Avatar src={chat.groupName}/>
            </Box>
        </Box>
    )
}

export default Message