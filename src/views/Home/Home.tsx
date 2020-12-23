import React from "react"
import {VStack,Heading,Button,
        Text,AspectRatio,Image, Avatar,
        AvatarGroup, HStack, Icon} from "@chakra-ui/react"
import {DetailCard} from "components/Card"
import {createStyles,makeStyles,Theme} from "@material-ui/core/styles"
import {Carousel} from "components/Carousel"
import { FaPrayingHands } from "react-icons/fa"
import useParams from "utils/Params"
import useToast from "utils/Toast"
import {getPrayerRequest,getDailyReading} from "core/services/prayer.service"
import {IPrayer} from "core/models/Prayer"
import {AppState} from "store"
import {useSelector} from "react-redux"
import {Scripture} from "assets/images"
import { IPrayerRequest } from "core/models/PrayerRequest"
import {IDailyReading} from "core/models/dailyReading"

const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        "& > div:nth-child(2)":{
            width:"75%",
            "& button":{
                boxShadow:"0px 5px 10px #00A7AF33",
                fontSize:".9rem",
                padding:theme.spacing(1.5,3),
                width:"100%",
                height:"55px"
            },
            "& > div":{
                width:"100%"
            }
        }
    },
    titleContainer:{
        marginBottom:"3rem",
        "& > h3":{
            fontWeight:400,
            fontSize:"1.5rem",
            opacity:.4
        },
        "& > h2":{
            lineHeight:'1.15',
            fontWeight:700,
            fontSize:"3.4rem"
        },
    //    "& > div:first-child":{
    //    },
    },
    carouselContainer:{
        margin:theme.spacing(8,0,3,0),
        width:"100%"
    },
    verseContainer:{
        margin:theme.spacing(3,0),
        backgroundColor:"white",
        paddingBottom:".5rem",
        height:"30vh",
        boxShadow:"0px 3px 6px #0000000D",
        borderRadius:"4px", 
        "& > div:first-child":{
            minHeight:"55%"
        },
        "& > div:nth-child(2)":{
            padding:theme.spacing(.3,1),
        },
        "& img":{
            borderRadius:"4px",
        },
        "& p:first-child":{
            fontSize:"1.1rem",
            fontWeight:600
        },
        "& p:nth-child(2)":{
            fontWeight:600,
            fontSize:".9rem"
        },
        "& p:last-child":{
            marginBottom:"0 !important",
            fontSize:"1rem",
            opacity:.75
        }
    },
    prayerContainer:{
        width:"100%",
        marginTop:"3rem !important",
        "& > *":{
            width:"100%",
            shadow: "5px 0px 6px #0000001A",
            backgroundColor:"white",
            padding:"1rem",
            borderRadius:"6px",
            alignItems:"flex-start !important"
        }
    }
}))



const Home = () => {
    const classes = useStyles()
    const defaultPrayer:IPrayer = {
        denominationID:0,
        prayerName:"",
        prayerdetail:"",
        denomination:""
    }
    const defaultReading:IDailyReading = {
        verse:"",
        content:"",
        name:""
    }
    const toast = useToast()
    const currentDate = new Date()
    const params = useParams()
    const [show,setShow] = React.useState(false)
    const [churchPrayer,setChurchPrayer] = React.useState<IPrayerRequest[]>(new Array(10).fill(defaultPrayer))
    const currentUser = useSelector((state:AppState) => state.system.currentUser)
    const [dailyReading,setDailyReading] = React.useState<IDailyReading[]>([defaultReading])

    React.useEffect(() => {
        setTimeout(() => {
            setShow(!show)
        },2500)
        const getPrayerByChurch = async () => {
            // Add denomination id
            getPrayerRequest(Number(params.churchId)).then(payload => {
                setChurchPrayer(payload.data)
            }).catch(err => {
                toast({
                    title:"Unable to Get Church Prayers",
                    subtitle:`Error:${err}`,
                    messageType:"error"
                })
            })
        }
        const churchDailyReading = () => {
            getDailyReading().then(payload => {
                setDailyReading(payload.data.readings)            
            }).catch(err => {
                toast({
                    title:"Unable to Load Daily Reading",
                    subtitle:`Error:${err}`,
                    messageType:"error"
                })
            })
        }

        getPrayerByChurch()
        churchDailyReading()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const newDate = new Intl.DateTimeFormat('en-US', options).format(currentDate)
    const todayDate = newDate.substring(0,(newDate.length-6))
    

    return(
        <VStack flex="6" maxW="3xl" align="flex-start" className={classes.root}>
            <VStack align="flex-start" className={classes.titleContainer}>
                <Heading as="h3" color="tertiary">
                    {todayDate}
                </Heading>
                <Heading color="tertiary">
                    Welcome,<br/>{currentUser.fullname}
                </Heading>
            </VStack>
            <VStack>
                <Button colorScheme="buttonColor" bgColor="buttonColor">
                    Add Bookings / Request
                </Button>
                <VStack>
                    <HStack>
                        <Carousel/>
                    </HStack>
                    <VStack className={classes.verseContainer}>
                        <AspectRatio width="100%" ratio={7/5}>
                            <Image src={Scripture} />
                        </AspectRatio>
                        <VStack align={["center","flex-start"]} >
                            <Text>
                                Today Verse&nbsp;
                            </Text>
                            <Text>
                                {dailyReading[0].verse}
                            </Text>
                            <Text noOfLines={4} mb={5}>
                            {dailyReading[0].content}
                            </Text>
                        </VStack>
                    </VStack>
                        <VStack spacing={4} width="100%"
                         className={classes.prayerContainer}>
                            {churchPrayer.map((item,idx) => (
                                <DetailCard isLoaded={Boolean(item.prayerRequestID)}
                                    title={item.prayerTitle} key={idx} 
                                    subtitle={"Prayer For Help"} timing="2d"
                                    image="https://bit.ly/ryan-florence" 
                                    body={item.prayerDetail}
                                >
                                    <HStack width="100%" justify="space-between">
                                        <AvatarGroup size="sm" max={3}>
                                            <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                                            <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                                            <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                                            <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
                                            <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
                                        </AvatarGroup>
                                        <Text mr="auto">
                                            <Text as="b">14 People</Text> Prayed
                                        </Text>
                                        <Icon boxSize="1rem" as={FaPrayingHands} />
                                    </HStack>
                                </DetailCard>
                            ))}
                        </VStack>
                </VStack>
            </VStack>
        </VStack>
    )
}


export default Home