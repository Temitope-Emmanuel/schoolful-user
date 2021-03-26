import React from "react"
import {Box} from "@material-ui/core"
import {makeStyles,createStyles} from "@material-ui/core/styles"
import {HubConnection} from "@aspnet/signalr"
import { IGroup } from "core/models/Group"
import Message from "./Message"
import { useDispatch, useSelector } from "react-redux"
import {addGroupMessage} from "store/Chat/actions"
import {AppState} from "store"
import useToast from "utils/Toast"


const useStyles = makeStyles((theme) => createStyles({
    root:{
        width:"100%",
        maxHeight:"70vh",
        overflowY:"scroll",
        marginBottom:theme.spacing(2),
        padding:theme.spacing(0,3)
    }
}))




interface IProps {
    connection:HubConnection;
    currentGroup:IGroup
}

const ListMessage:React.FC<IProps> = ({connection,currentGroup}) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const toast = useToast()
    const currentMessage = useSelector((state:AppState) => state.chat.currentGroupMessage)
    const messageListViewRef = React.useRef<HTMLDivElement>(null)
    
    const scrollBottom = () => {
        messageListViewRef.current?.scrollIntoView({behavior:"smooth"})
    }
    
    React.useEffect(() => {
        connection.on("ReceiveMessageApi",(message) => {
            dispatch(addGroupMessage(message,toast))
        })
        connection.on("NewUser",data => {
            toast({
                messageType:"info",
                subtitle:`${data}`,
                title:"Added new user"
            })
        })
    },[])

    React.useEffect(() => {
        if(currentMessage[currentMessage.length - 1] && currentMessage[currentMessage.length - 1].ownerIsCurrentUser){
            scrollBottom()
        }
    },[currentMessage])


    return(
        <Box className={classes.root}>
            {
                currentMessage.map((item) => (
                    <Message key={item.id} chat={item} />
                    ))
                }    
            <div ref={messageListViewRef} />
        </Box>
    )
}

export default ListMessage