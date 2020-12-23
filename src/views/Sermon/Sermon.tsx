import React from "react"
import { 
        Tab,TabList,TabPanel,Icon,
        TabPanels,Tabs,VStack,Heading
     } from "@chakra-ui/react"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"
import {PlayListCard} from "components/Card"
import {AiFillPlayCircle} from "react-icons/ai"
import {MdAudiotrack} from "react-icons/md"
import { LandingImage } from "assets/images"
import useParams from "utils/Params"
import useToast from "utils/Toast"
import * as sermonService from "core/services/sermon.service"
import {ISermon} from "core/models/Sermon"



const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        flex:6,
        "& > div":{
            width:"100%"
        }
    },
    tabsContainer:{
        paddingBottom:"1rem",
        "& button":{
            borderBottom:"0 !important"
        }
    },
    prayerContainer:{
        width:"100%",
        maxWidth:"27rem",
        marginTop:"3rem !important",
        "& > *":{
            // width:"100%",
            // height:"30vh",
            // [theme.breakpoints.up("sm")]:{
            //     height:"40vh",
            // },
            // shadow: "5px 0px 6px #0000001A",
            // backgroundColor:"white",
            // borderRadius:"6px",
            // alignItems:"flex-start !important",
            // " & > *:last-child":{
            //     margin:theme.spacing(.5,.7),
            //     "& p:first-child":{
            //         fontSize:"1.62rem",
            //         fontWeight:"600"
            //     },
            //     "& p:nth-child(2)":{
            //         fontSize:"1.32rem",
            //         fontStyle:"italic"
            //     }
            // }
        }
    },
    playlistContainer:{
        "& > div:last-child":{
            width:"90%",
            height:"30vh"
        }        
    },
    icon:{
        position:"absolute",
        top:"50% !important",
        transform:"translate(-50%,-50%)",
        left:"50% !important",
        color:"rgba(0,0,0,.8) !important"
    }
}))


const Sermon = () => {
    const defaultSermon:ISermon = {
        author:"",
        authorDesignation:"",
        churchId:0,
        featureDateFrom:new Date(),
        featureDateTo:new Date(), 
        sermonContent:"",
        title:""
    }
    const params = useParams()
    const toast = useToast()
    const classes = useStyles()
    const selected = {color:"primary"}
    const [churchSermon,setChurchSermon] = React.useState<ISermon[]>(new Array(10).fill(defaultSermon))

    React.useEffect(() => {
        const getChurchSermon = async () => {
            await sermonService.getChurchSermon(params.churchId).then(payload => {
                setChurchSermon(payload.data)
            }).catch(err => {
                toast({
                    title:"Unable To get Church Sermon",
                    subtitle:`Error: ${err}`,
                    messageType:"error"
                })
            })
        }
        getChurchSermon()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const IconComponent = (icon:any,size?:string) => (
        <Icon className={classes.icon} boxSize={size || "2rem"} as={icon}/>
    )
    
    
    return (
        <VStack className={classes.root}>
            <VStack className={classes.playlistContainer} >
                <Heading color="primary" fontSize="1.25rem">
                    Continue from where you stopped
                </Heading>
                <PlayListCard icon={IconComponent(AiFillPlayCircle)}
                    title="More than Gold" link="kkjj" image={LandingImage}
                    subtitle="Pst. Emeka" isLoaded={true}
                />
            </VStack>
            <Tabs align="center" zIndex={5}>
                <TabList className={classes.tabsContainer} defaultValue={2}>
                    <Tab color="tertiary" _selected={selected} >Written Sermon</Tab>
                    <Tab color="tertiary" _selected={selected}>Video Sermon</Tab>
                    <Tab color="tertiary" _selected={selected}>Audio Sermon</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <VStack spacing={4} width="100%"
                         className={classes.prayerContainer}>
                            {churchSermon.map((item,idx) => (
                                <PlayListCard key={idx} isLoaded={Boolean(item.sermonID)}
                                    title={item.title} image={item.featureImage || LandingImage}
                                    subtitle={item.author}
                                />
                            ))}
                        </VStack>
                    </TabPanel>
                    <TabPanel>
                        <VStack spacing={4} width="100%"
                         className={classes.prayerContainer}>
                            {churchSermon.map((item,idx) => (
                                <PlayListCard key={idx} isLoaded={Boolean(item.sermonID)}
                                    icon={IconComponent(AiFillPlayCircle,"4rem")}
                                    title={item.title} image={item.featureImage || LandingImage}
                                    subtitle={item.author}
                                />
                            ))}
                        </VStack>
                    </TabPanel>
                    <TabPanel>
                        <VStack spacing={4} width="100%"
                         className={classes.prayerContainer}>
                            {churchSermon.map((item,idx) => (
                                <PlayListCard key={idx} isLoaded={Boolean(item.sermonID)}
                                    icon={IconComponent(MdAudiotrack,"4rem")}
                                    title={item.title} image={item.featureImage || LandingImage}
                                    subtitle={item.author}
                                />
                            ))}
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </VStack>
    )
}

export default Sermon