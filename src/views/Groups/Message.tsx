import React from "react"
import {Box,Avatar,Typography} from "@material-ui/core"
import {createStyles,makeStyles} from "@material-ui/core/styles"
import {GroupMessage} from "core/models/Chat"
import {formatDistanceToNow} from "date-fns"

const useStyles = makeStyles((theme) => createStyles({
    root:{
        display:"flex",
        margin:theme.spacing(2.5,0)
    },
    avatarContainer:{
        position:"relative",
        marginTop:theme.spacing(3),
        zIndex:5
    },
    fromMeContainer:{
        marginLeft:theme.spacing(1.5),
    },
    fromThemContainer:{
        marginRight:theme.spacing(1.5),
    },
    messageContainer:{
        display:"flex",
        flexDirection:"column",
        "& p":{
            maxWidth:"255px",
            wordWrap:"break-word",
            marginBottom:"12px",
            lineHeight:"24px",
            position:"relative",
            padding:"10px 20px",
            borderRadius:"25px"
        },
        "&  p::before,& p::after":{
            content:"' '",
            position:"absolute",
            bottom:0,
            height:"25px"
        },
        "& span":{
            fontSize:".75rem"
        }
    },
    fromMe:{
        color:"white",
        backgroundColor:"#0B93F6",
        alignSelf:"flex-end",
        "&::before":{
            right:"-7px",
            width:"20px",
            backgroundColor:"#0B93F6",
            borderBottomLeftRadius:"16px 14px"
        },
        "&::after":{
            right:"-26px",
            width:"26px",
            backgroundColor:"#F9F5F9",
            borderBottomLeftRadius:"10px"
        }
    },
    fromThem:{
        background:"#0B93F6",
        color:"white",
        alignSelf:"flex-start",
        "&::before":{
            left:"-7px",
            width:"20px",
            backgroundColor:"#0B93F6",
            borderBottomRightRadius:"16px"
        },
        "&::after":{
            left:"-26px",
            width:"26px",
            backgroundColor:"#F9F5F9",
            borderBottomRightRadius:"10px"
        }
    }
}))


interface IProps {
    chat:GroupMessage
}


const Message:React.FC<IProps> = ({
    chat:{groupName,text,when,ownerIsCurrentUser,...chat}
}) => {
    const classes = useStyles()
    const justifySelf = {justifyContent:ownerIsCurrentUser ? "flex-end":"flex-start"}
    const alignSelf = {alignSelf:ownerIsCurrentUser ? "flex-end":"flex-start"}

    return(
        <Box className={`${classes.root}`} style={justifySelf}>
            {!ownerIsCurrentUser && <Avatar className={`${classes.avatarContainer} ${classes.fromThemContainer}`} src={groupName}/>}
            <Box className={classes.messageContainer}>
                <Typography className={ownerIsCurrentUser ? classes.fromMe : classes.fromThem}>
                    {text}
                </Typography>
                <Typography component="span" style={alignSelf}>
                    {`${formatDistanceToNow(new Date(when))} ago`}
                </Typography>
            </Box>
            {ownerIsCurrentUser && <Avatar className={`${classes.avatarContainer} ${classes.fromMeContainer}`} src={groupName}/>}
        </Box>
    )
}

export default Message