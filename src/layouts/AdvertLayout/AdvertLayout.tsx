import React from "react"
import { useLocation } from "react-router-dom"
import {
    HStack, Spacer, Stack, VStack, StackDivider,
    AspectRatio, Image, Icon, Text, useBreakpoint
} from "@chakra-ui/react"
import { FiActivity } from "react-icons/fi"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import useParams from "utils/Params"
import { ICurrentActivity } from "core/models/Activity"
import {setAdvertLayout} from "store/System/actions"
import {ICurrentEvent} from "core/models/Event"
import { IAdvert } from "core/models/Advert"
import * as adsService from "core/services/ads.service"
import {useSelector,useDispatch} from "react-redux"
import {AppState} from "store"

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(1),
        paddingTop: theme.spacing(4)
    },
    activityContainer: {
        borderRadius: "10px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0px 5px 10px #B603C933",
        color: "white",
        padding: "1rem",
        "& svg": {
            fontSize: "1rem"
        },
        "& > div": {
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            [theme.breakpoints.up("sm")]: {
                alignItems: "flex-start",
                flexDirection: 'column'
            },
            "& > div": {
                alignItems: "flex-start"
            }
        },
        "& > div:first-child": {
            justifyContent: "center",
            "& p": {
                textAlign: "center"
            },
            [theme.breakpoints.up("sm")]: {
                flexDirection: "row",
                justifyContent: "flex-start"
            }
        },
        "& > div:nth-child(2)": {
            justifyContent: "space-evenly"
        },
        [theme.breakpoints.up("sm")]: {
            width: "25vw",
            padding: "2rem 1.3rem 2.5rem 2.3rem",
        }
    },
    mainContainer: {
        flexDirection: "row",
        width: "100%",
        margin: 0,
        [theme.breakpoints.up("sm")]: {
            position: "sticky",
            top: 0,
            flexDirection: "column",
            width: "auto"
        }
    },
    adsContainer: {
        alignItems: "center !important",
        "& img": {
            borderRadius: "10px"
        },
        [theme.breakpoints.up("sm")]: {
            alignItems: "flex-start !important"
        }
    }
}))


const AdvertLayout = ({ children }: any) => {
    const classes = useStyles()
    const location = useLocation()
    const params = useParams()
    const dispatch = useDispatch()
    const showAdvert = useSelector((state:AppState) => state.system.showAdvertLayout)
    const [currentChurchActivity, setCurrentChurchActivity] = React.useState<ICurrentActivity[]>([])
    const mediaQuery = useBreakpoint()

    const [currentEvent,setCurrentEvent] = React.useState<ICurrentEvent[]>([])
    const churchActivity = useSelector((state:AppState) => state.activity.activities)
    const churchEvent = useSelector((state:AppState) => state.activity.events)
    const [ads, setAds] = React.useState<IAdvert[]>([])
    const currentDate = new Date()
    // add the total amount of second the current date
    const weekEndDate = new Date(currentDate.getTime() + (604800000))
    React.useEffect(() => {
        const getChurchAd = async () => {
            await adsService.getAdverts(Number(params.churchId)).then(payload => {
                setAds(payload.data)
            }).catch(err => {
    
            })
        }
        if(!showAdvert){
            getChurchAd()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    React.useEffect(() => {
        if(mediaQuery === "sm"){
            dispatch(setAdvertLayout(false))
        }
    },[mediaQuery])

    React.useEffect(() => {
        const getChurchActivity = async () => {
            const currentActivity: ICurrentActivity[] = []

            churchActivity.map((item) => {
                // eslint-disable-next-line 
                if (item.recurringRule && item.recurringRule.between(currentDate, weekEndDate, true).length > 0) {
                    currentActivity.push({
                        ...item
                    })
                }
            })
            setCurrentChurchActivity(currentActivity)
        }
        if(!showAdvert){
            getChurchActivity()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [churchActivity])

    React.useEffect(() => {
        const currentChurchEvent = []
        
        for (let i = 0; i < churchEvent.length; i++) {
          const eventStartTime = (new Date(churchEvent[i].startDateTime))
          const event = churchEvent[i]
          const eventTimeStart = eventStartTime.getTime()
          if (eventTimeStart > currentDate.getTime() && eventTimeStart < weekEndDate.getTime()) {
            currentChurchEvent.push({
              ...event
            })
          }
        }

        if(!showAdvert){
            setCurrentEvent([...currentChurchEvent])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [churchEvent])
    
    const displayStyle = {display:showAdvert ? "initial":"none"}
    return (
        <Stack direction={["column-reverse", "row"]} className={classes.root}>
            <Spacer display={{base:"none",md:!showAdvert ? "none" : "block"}} flex={1} />
            {children}
            <Spacer display={{base:"none",md:!showAdvert ? "none" : "block"}} flex={1} />
            <VStack spacing={2} mr={3}
                display={{ base: "none", lg: "flex" }}
                flex={!showAdvert ? 2 : ""}
                //  style={displayStyle}
                className={classes.mainContainer} >
                <VStack bgColor="primary" position="sticky" top="9%" width={!showAdvert ? "100%" : "25vw"}
                    className={classes.activityContainer} zIndex={4} >
                    {currentChurchActivity.length ?
                        <>
                            <HStack>
                                <Icon as={FiActivity} />
                                <Text fontFamily='MulishExtraBold'>
                                    Upcoming Activities & Events
                                </Text>
                            </HStack>
                            <VStack divider={<StackDivider bgColor="white" />}>
                                <VStack>
                                    <Text opacity={.8} >
                                        {currentChurchActivity[0]?.title}
                                    </Text>
                                    <Text fontWeight={600} maxW="20vw" isTruncated>
                                        {currentChurchActivity[0]?.description}
                                    </Text>
                                </VStack>
                                <VStack>
                                    <Text opacity={.8} >
                                        { currentEvent[0]?.title || currentChurchActivity[1]?.title}
                                    </Text>
                                    <Text fontWeight={600} maxW="20vw" isTruncated >
                                        { currentEvent[0]?.description || currentChurchActivity[1]?.description}
                                    </Text>
                                </VStack>
                                <VStack />
                            </VStack>
                        </> : 
                        <Text>
                            No Available Activity
                        </Text>
                    }
                </VStack>
                <VStack spacing={2} position="sticky" top={"42%"}
                    width="100%"
                    className={classes.adsContainer}>
                    <Text color="tertiary" fontWeight="600">
                        Sponsored
                    </Text>
                    <Stack spacing={3}
                        direction={["row", "column"]} width="100%">
                        <AspectRatio maxW="400px" ratio={4 / 3}>
                            <Image src={ads[0]?.advertUrl} />
                        </AspectRatio>
                        <AspectRatio maxW="400px" ratio={4 / 3}>
                            <Image src={ads[1]?.advertUrl} />
                        </AspectRatio>
                    </Stack>
                </VStack>
            </VStack>
            <Spacer display={!showAdvert ? "none" : ""} flex={1} />
        </Stack>
    )
}


export default AdvertLayout