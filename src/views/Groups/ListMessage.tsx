import React from "react"
import { Box } from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { HubConnection } from "@aspnet/signalr"
import { IGroup } from "core/models/Group"
import Message from "./Message"
import { useDispatch, useSelector } from "react-redux"
import { addGroupMessage, loadGroupChatMessage } from "store/Chat/actions"
import {primary} from "theme/chakraTheme/palette"
import { AppState } from "store"
import useToast from "utils/Toast"
import "./styles.css"


const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: "100%",
        position:"relative",
        // filter:"blur(1px)",
        touchAction:"none",
        maxHeight: "70vh",
        marginBottom: theme.spacing(2),
        padding: theme.spacing(0, 3),
        overflowY: "scroll",
        overscrollBehavior:"contain",
        "&::-webkit-scrollbar": {
            width: "6px",
            overflow: "scroll",
            position: "absolute"
        },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgb(215, 218, 221)",
            // background:primary,
            borderRadius: "3px"
        },
        "&::-webkit-scrollbar-thumb": {
            borderRadius: "10px",
            background: "rgba(116, 125, 131, 0.61)",
            boxShadow: "inset 0 0 6px rgba(215, 218, 221, 0.726)"
        }
    },
    loadMessage:{
        borderRadius:"1.2rem",
        padding:theme.spacing(1),
        backgroundColor:primary,
        color:"white",
        boxShadow:"0px 5px 10px #0000001A"
    }
}))




interface IProps {
    connection: HubConnection;
    currentGroup: IGroup
}



const ListMessage: React.FC<IProps> = ({ connection, currentGroup }) => {
    const classes = useStyles()
    const inbox = React.useRef<HTMLDivElement | null>(null)
    const [startY,setStartY] = React.useState(0)
    const dispatch = useDispatch()
    const toast = useToast()
    const currentMessage = useSelector((state: AppState) => state.chat.currentGroupMessage)
    const [currentLocalGroup,setCurrentLocalGroup] = React.useState<IGroup>()
    const messageListViewRef = React.useRef<HTMLDivElement>(null)

    const scrollBottom = () => {
        messageListViewRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    async function simulateRefreshAction() {
        const sleep = (timeout:number) => new Promise(resolve => setTimeout(resolve, timeout));
      
        const transitionEnd = function(propertyName:string, node:Element) {
          return new Promise(resolve => {
            function callback(e:any) {
              e.stopPropagation();
              if (e.propertyName === propertyName) {
                node.removeEventListener('transitionend', callback);
                resolve(e);
              }
            }
            node.addEventListener('transitionend', callback);
          });
        }
      
        const refresher = document.querySelector('.refresher');
        if(refresher){
            document.body.classList.add('refreshing');
            await sleep(2000);
          
            refresher.classList.add('shrink');
            await transitionEnd('transform', refresher);
            refresher.classList.add('done');
          
            refresher.classList.remove('shrink');
            document.body.classList.remove('refreshing');
            await sleep(0); // let new styles settle.
            refresher.classList.remove('done');
        }
      }

    React.useEffect(() => {
        connection.on("ReceiveMessageApi", (message) => {
            console.log("received message")
            dispatch(addGroupMessage(message, toast))
        })
        connection.on("NewUser", data => {
            console.log("a new user here")
            toast({
                messageType: "info",
                subtitle: `${data}`,
                title: "Added new user"
            })
        })
        const touchStart = inbox.current?.addEventListener('touchstart',e => {
            setStartY(e.touches[0].pageY)
        })
        const touchMove = inbox.current?.addEventListener('touchmove',e => {
            const y = e.touches[0].pageY

            if(document.scrollingElement?.scrollTop === 0 && y > startY &&
                 !document.body.classList.contains('refreshing')){
                     simulateRefreshAction()
                     console.log("callingthis func")           
                 }
        },{passive:true})

        return () => {
            if(touchStart){
                inbox.current?.removeEventListener('touchstart',touchStart)
            }
            if(touchMove){
                inbox.current?.removeEventListener("touchmove",touchMove)
            }
        }
    }, [])

    React.useEffect(() => {
        if (currentMessage[currentMessage.length - 1] && currentMessage[currentMessage.length - 1].ownerIsCurrentUser) {
            scrollBottom()
        }
    }, [currentMessage])

    React.useEffect(() => {
        const addToGroup = () => {
            if(connection && currentGroup.societyID !== currentLocalGroup?.societyID){
               connection.send("joinGroup",currentGroup.name)
               dispatch(loadGroupChatMessage(toast))
            }
        }
        
        if(currentGroup.societyID !== currentLocalGroup?.societyID ){
            addToGroup()
            setCurrentLocalGroup(currentGroup)
        }
    },[currentGroup])


    return (
        <>
        <Box className={classes.loadMessage}>
            Load New Message
        </Box>
        {/* <Box className="refresher">
            <Box className="loading-bar" />
            <Box className="loading-bar" />
            <Box className="loading-bar" />
            <Box className="loading-bar" />
        </Box> */}
        <div id="inbox" className={classes.root} ref={inbox}>
            {
                currentMessage.map((item) => (
                    <Message key={item.id} chat={item} />
                ))
            }
            <div ref={messageListViewRef} />
        </div>
        </>
    )
}

export default ListMessage