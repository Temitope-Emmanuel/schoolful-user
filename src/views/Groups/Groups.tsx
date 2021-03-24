import React from "react"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"
import {Typography} from "@material-ui/core"
import {VStack,Stack} from "@chakra-ui/react"
import {Button} from "components/Button"
import {GroupCard} from "components/Card"
import useParams from "utils/Params"
import useToast from "utils/Toast"
import {IGroup} from "core/models/Group"
import * as groupService from "core/services/group.service"
import SendMessage from "./SendMessage"
import {HubConnectionBuilder,HubConnection} from "@aspnet/signalr"


const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        flex:6
    }
}))


const serverUrl = process.env.REACT_APP_SERVER_URL

const Groups = () => {
    const defaultGroup:IGroup = {
        churchId:0,
        denominationId:0,
        description:"",
        isDeleted:false,
        memberCount:0,
        name:""
    }
    const classes = useStyles()
    const params = useParams()
    const toast = useToast()
    const [churchGroup,setChurchGroup] = React.useState<IGroup[]>(new Array(10).fill(defaultGroup))
    const [currentGroup,setCurrentGroup] = React.useState<IGroup>({
        churchId:0,
        denominationId:0,
        description:"",
        isDeleted:false,
        memberCount:0,
        name:"",
    })
    const connection = React.useRef<HubConnection>()

    const handleSetCurrentGroup = (curGroup:IGroup) => () => {
        setCurrentGroup(curGroup)
    }
    
    React.useEffect(() => {
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
        const setUpConnection = async () => {
            const connect = await new HubConnectionBuilder()
            .withUrl(`${serverUrl}/chathub` || "").build()
            connect.start().catch(err => {
                console.log("this is the err",err)
                toast({
                    messageType:"error",
                    title:"Something went wrong",
                    subtitle:`Error:${err}`
                })
            })
            connection.current = connect
            console.log("this is the connect",connect)
        }
        setUpConnection()
        getGroupsByChurch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    return(
        <Stack direction={["column","row"]} className={classes.root}>
            <VStack justify="center" flex={4} bgColor="bgColor2">
                <Button>
                    Join Group
                </Button>
                <VStack spacing={10} width={{base:"95%",md:"80%"}}>
                    {churchGroup.map((item,idx) => (
                        <GroupCard isLoaded={Boolean(item.societyID)}
                         imgSrc={item.imageUrl} name={item.name} onClick={handleSetCurrentGroup(item)}
                            active={currentGroup.societyID === item.societyID} member={item.memberCount} key={item.societyID || idx}
                        />
                    ))}
                </VStack>
            </VStack>
            <VStack bgColor="#F9F5F9" flex={6}>
                <Typography>
                    This is the chat handle
                </Typography>
                {
                    currentGroup && connection.current && 
                    <>
                        <SendMessage currentGroupDetail={{
                            name:currentGroup.name,
                            societyID:currentGroup.societyID as number
                        }} connection={connection.current} />
                    </>
                }
            </VStack>
        </Stack>
    )
}

export default Groups