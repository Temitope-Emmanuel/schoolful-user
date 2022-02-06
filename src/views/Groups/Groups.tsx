import React from "react"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"
import {Slide} from "@material-ui/core"
import {Typography} from "@material-ui/core"
import {VStack,Stack, Box, useBreakpoint} from "@chakra-ui/react"
import {GroupCard} from "components/Card"
import useParams from "utils/Params"
import useToast from "utils/Toast"
import {IGroup} from "core/models/Group"
import * as groupService from "core/services/group.service"
import SendMessage from "./SendMessage"
import {HubConnectionBuilder,HubConnection} from "@aspnet/signalr"
import ListMessage from "./ListMessage"
import { useDispatch, useSelector } from "react-redux"
import {clearGroupMessage, setChatGroup} from "store/Chat/actions"
import {setAdvertLayout} from "store/System/actions"
import {IoIosArrowForward,IoIosArrowUp} from "react-icons/io"
import {primary} from "theme/chakraTheme/palette"
import {AppState} from "store"



const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        flex:6,
        height:"80vh"
    },
    groupContainer:{
        display:"flex",
        alignItems:"center",
        flexDirection:"column",
        [theme.breakpoints.up("sm")]:{
            flexDirection:"row"
        }
    },
    groupClassContainer:{
        flex:7,
        width:"100%",
        // margin:"auto",
        justifyContent:"center",
        margin:theme.spacing(0,2),
        "& > div":{
            padding:theme.spacing(2,3),
            // margin:theme.spacing(0,3),
            overflow:"auto",
            maxHeight:"10rem",
            [theme.breakpoints.up("sm")]:{
                maxHeight:"30rem",
                width:"initial",
            },
            "&::-webkit-scrollbar": {
                width: "7px",
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
        }
    },
    iconContainer:{
        [theme.breakpoints.up("md")]:{
            height:"100%",
            width:"2rem",
            marginTop:0,
            marginLeft:theme.spacing(2)
        },
        justifyContent:"center",
        marginTop:theme.spacing(2),
        display:"flex",
        alignItems:"center",
        "& svg":{
            cursor:"pointer",
            width:"1.5rem",
            height:"1.5rem",
            backgroundColor:primary,
            borderRadius:"50%",
            transition:"all .3s linear"
        }
   },
   rotate:{
       transform:"rotate(0deg)"
   },
   rotate360:{
       transform:"rotate(180deg)"
   }
}))



const Groups = () => {
    const currentGroup = useSelector((state:AppState) => state.chat.currentGroup)
    const breakpoints = useBreakpoint()
    const smallScreen = breakpoints === "base" || breakpoints === "sm"
    const [showGroup,setShowGroup] = React.useState(true)
    const defaultGroup:IGroup = {
        churchID:0,
        description:"",
        name:"",
        groupID:0,
        groupMember: []
    }
    const classes = useStyles()
    const dispatch = useDispatch()
    const params = useParams()
    const toast = useToast()
    const [churchGroup,setChurchGroup] = React.useState<IGroup[]>(new Array(10).fill(defaultGroup))
    const connection = React.useRef<HubConnection>()

    const toggleGroup = () => {
        setShowGroup(!showGroup)
    }
    const handleSetCurrentGroup = (curGroup:IGroup) => () => {
        dispatch(clearGroupMessage())
        dispatch(setChatGroup(curGroup))
    }    

    React.useEffect(() => {
        dispatch(setAdvertLayout(false))
        const getGroupsByChurch = async () => {
            await groupService.getGroupByChurch(params.churchId).then(payload => {
                setChurchGroup(payload.data)
            }).catch(err => {
                toast({
                    title:"Unable to get Church Group",
                    subtitle:`Error: ${err}`,
                    messageType:"error"
                })
            })
        }
        getGroupsByChurch()
        const groupUrl = process.env.REACT_APP_SERVER_CHAT || ''
        const setUpConnection = async () => {
            const connect = new HubConnectionBuilder()
            .withUrl(`https://api.thefaithfuls.com/chathub` as string ).build()
            await connect.start().catch(err => {
                toast({
                    messageType:"error",
                    title:"Something went wrong",
                    subtitle:`Error:${err}`
                })
            })
            connection.current = connect
        }
        // Uncomment to activate chat bot
        // setUpConnection()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return(
        <Stack direction={["column","row"]} className={classes.root}>
            <Box className={classes.groupContainer}>
                <Slide mountOnEnter unmountOnExit direction={smallScreen ? "down" : "right"} in={showGroup}>
                    <VStack maxW="md" bgColor="bgColor2" className={classes.groupClassContainer}>
                        <VStack spacing={10} width={{base:"95%",md:"80%"}}>
                            {churchGroup.map((item,idx) => (
                                <GroupCard isLoaded={Boolean(item.groupID)}
                                    imgSrc={item.imageUrl} name={item.name} onClick={handleSetCurrentGroup(item)}
                                    active={currentGroup.groupID === item.groupID} member={item.groupMember ? item.groupMember.length : 0}
                                    key={item.groupID || idx}
                                />
                            ))}
                        </VStack>
                    </VStack>
                </Slide>

                <Box className={classes.iconContainer}>
                    {
                        smallScreen ? 
                        <IoIosArrowUp onClick={toggleGroup} 
                        className={showGroup ? classes.rotate :classes.rotate360} />
                         : 
                        <IoIosArrowForward onClick={toggleGroup} 
                        className={showGroup ? classes.rotate :classes.rotate360}/>
                    }
                </Box>
            </Box>
            <VStack bgColor="#F9F5F9" flex={6} position="relative" >
                {
                !currentGroup.groupID && 
                <Typography>
                    Please Select Chat to join
                </Typography>
                }
                {
                    currentGroup.groupID && connection.current && 
                    <>
                        <ListMessage currentGroup={currentGroup} connection={connection.current} />
                        <SendMessage currentGroupDetail={{
                            name:currentGroup.name,
                            groupID:currentGroup.groupID as number
                        }} connection={connection.current} />
                    </>
                }
            </VStack>
        </Stack>
    )
}

export default Groups