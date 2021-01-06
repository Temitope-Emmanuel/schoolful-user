import React from "react"
import {createStyles,makeStyles,Theme} from "@material-ui/core/styles"
import {VStack,Heading,Skeleton,Text} from "@chakra-ui/react"
import useParams from "utils/Params"
import useToast from "utils/Toast"
import * as announcementService from "core/services/announcement.service"
import {IAnnouncement} from "core/models/Announcement"
import axios from "axios"


const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        flex:6
    },
    announcementContainer:{
        boxShadow:"0px 5px 10px #0000001A",
        borderRadius:"4px",
        padding:theme.spacing(2),
        backgroundColor:"white",
        alignItems:"flex-start !important"
    }
}))



const Announcement = () => {
    const defaultAnnouncement:IAnnouncement = {
        category:"",
        churchId:0,
        dateEntered:new Date(),
        description:"",
        expirationDate:new Date(),
        startDate:new Date(),
        title:"",
        type:""
    }
    const classes = useStyles()
    const params = useParams()
    const toast = useToast()
    const [churchAnnouncement,setChurchAnnouncement] = React.useState<IAnnouncement[]>(new Array(5).fill(defaultAnnouncement))


    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        const getAnnouncementByChurch = async() => {
            await announcementService.getAnnouncementByChurch(params.churchId,cancelToken).then(payload => {
                setChurchAnnouncement(payload.data)
            }).catch(err => {
                if(axios.isCancel(err)){
                    toast({
                        title:"Unable To get Church Announcement",
                        subtitle:`Error: ${err}`,
                        messageType:"error"
                    })
                }
            })
        }

        getAnnouncementByChurch()
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return(
        <VStack spacing={3} className={classes.root} maxW="md" >
            {churchAnnouncement.map((item,idx) =>(
                <Skeleton w="100%" h="100%" key={item.announcementID || idx} isLoaded={Boolean(item.announcementID)} >
                    <VStack key={idx} className={classes.announcementContainer}>
                        <Heading color="primary" fontSize="1rem" fontWeight={600} >
                            {item.title}
                        </Heading>
                        <Text color="tertiary" fontSize=".9rem" fontWeight={600} opacity={.5}>
                            {item.description}
                        </Text>
                    </VStack>
                </Skeleton>
            ))}
        </VStack>
    )
}

export default Announcement