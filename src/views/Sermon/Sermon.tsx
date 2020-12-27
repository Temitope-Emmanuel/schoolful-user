import React from "react"
import { 
        Tab,TabList,TabPanel,Icon,Flex,HStack,
        TabPanels,Tabs,VStack,Heading,ButtonGroup
     } from "@chakra-ui/react"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"
import {Zoom} from "@material-ui/core"
import {PlayListCard} from "components/Card"
import {AiFillPlayCircle} from "react-icons/ai"
import {MdAudiotrack} from "react-icons/md"
import { LandingImage } from "assets/images"
import useParams from "utils/Params"
import useToast from "utils/Toast"
import {getChurchSermon} from "core/services/sermon.service"
import {ISermon,IMediaSermon} from "core/models/Sermon"
import useScroll from "utils/Scroll"
import {MediaPlayer} from "components/MediaPlayer"
import {MediaType} from "core/enums/MediaType"
import {Button} from "components/Button"



const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        flex:6,
        "& > div":{
            width:"100%"
        }
    },
    tabsContainer:{
        paddingBottom:"1rem",
        position: "sticky",
        top: "10%",
        zIndex: 10,
        alignItems: "flex-start",
        width: "100%",
        padding: theme.spacing(1, 2),
        borderRadius: "4px",
        transition: "all .6s linear",
        marginBottom:"2rem",
        "& button":{
            borderBottom:"0 !important"
        }
    },
    prayerContainer:{
        width:"100%",
        maxWidth:"27rem",
        marginTop:"3rem !important"
    },
    playlistContainer:{
        "& > div:last-child":{
            width:"90%"
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
    const mediaStorageToken = "Thefaithful-mediaStorage-token"
    const defaultSermon:ISermon = {
        author:"",
        authorDesignation:"",
        churchId:0,
        featureDateFrom:new Date(),
        featureDateTo:new Date(), 
        sermonContent:"",
        title:""
    }
    const defaultMediaSermon:IMediaSermon = {
        ...defaultSermon,
        previous:false,
        next:false
    }
    const params = useParams()
    const scrolling = useScroll()
    const toast = useToast()
    const classes = useStyles()
    const selected = {color:"primary"}
    const [tabIndex,setTabIndex] = React.useState(0)
    const [mediaInLocal,setMediaInLocal] = React.useState<null | IMediaSermon>()
    const [churchSermon,setChurchSermon] = React.useState<ISermon[]>(new Array(10).fill(defaultSermon))
    const [currentMedia,setCurrentMedia] = React.useState<IMediaSermon>(defaultMediaSermon)
    const [textSermon,setTextSermon] = React.useState<ISermon[]>([])
    const [videoSermon,setVideoSermon] = React.useState<ISermon[]>([])
    const [audioSermon,setAudioSermon] = React.useState<ISermon[]>([])

    React.useEffect(() => {
        const getChurchSermonApi = async () => {
            await getChurchSermon(params.churchId).then(payload => {
                setChurchSermon(payload.data)
            }).catch(err => {
                toast({
                    title:"Unable To get Church Sermon",
                    subtitle:`Error: ${err}`,
                    messageType:"error"
                })
            })
        }
        const getMediaInStorage = () => {
            const mediaInStorage = window.localStorage.getItem(mediaStorageToken)
            if(mediaInStorage){
                setMediaInLocal(JSON.parse(window.localStorage.getItem(mediaStorageToken) || "{}"))        
            }
        }
        getChurchSermonApi()
        getMediaInStorage()
        return () => {
            setCurrentMedia(defaultMediaSermon)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    React.useEffect(() => {
        if(churchSermon[0]?.sermonID){
            const textSermon = churchSermon.filter((item) => item.featureVidAudio === null).map(item => ({
                ...item,
                mediaType:MediaType.TEXT
            }))
            const audioSermon = churchSermon.filter(item => item.featureVidAudio && item.featureVidAudio.indexOf("mp3") > 0).map(item => ({
                ...item,
                mediaType:MediaType.AUDIO
            }))
            const videoSermon = churchSermon.filter(item => item.featureVidAudio && item.featureVidAudio.indexOf("mp4") > 0).map(item => ({
                ...item,
                mediaType:MediaType.VIDEO
            }))
            setTextSermon(textSermon)
            setAudioSermon(audioSermon)
            setVideoSermon(videoSermon)
        }
    }, [churchSermon])

    const IconComponent = (icon:any,size?:string) => (
        <Icon className={classes.icon} boxSize={size || "2rem"} as={icon}/>
    )

    const handleCurrentMedia = (arg:IMediaSermon) => () => {
        setCurrentMedia(arg)
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }
    
    React.useEffect(() => {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    },[tabIndex])

    React.useEffect(() => {
        if(currentMedia.sermonID){
            window.localStorage.setItem(mediaStorageToken,JSON.stringify(currentMedia))
        }
    },[currentMedia])


    const setNewCurrentMedia = (sermonType:ISermon[],inc:number) => (idx: string) =>  () => {
        let foundMedia = (sermonType.findIndex(item => item.sermonID === idx) + inc);
        
        const newCurrentMedia = sermonType[foundMedia]
        if (newCurrentMedia) {
            setCurrentMedia({
                ...newCurrentMedia,
                next: !(foundMedia >= (sermonType.length - 1)),
                previous: !(foundMedia <= 0)
            })
        }
    }
    const setMedia = (arg:IMediaSermon) => {
        setCurrentMedia(arg)
    }
    const removeLocal = () => {
        if(window.localStorage.getItem(mediaStorageToken)){
            window.localStorage.removeItem(mediaStorageToken)
            setMediaInLocal(defaultMediaSermon)
        }
    }
    
    const addLocalToCurrent = () => {
        if(mediaInLocal){
            setCurrentMedia(mediaInLocal)
            removeLocal()
        }
    }
    const flexRef = React.useRef<HTMLDivElement>(null)
    const setNextAudioSermon = setNewCurrentMedia(audioSermon,1)
    const setPreviousAudioSermon = setNewCurrentMedia(audioSermon,-1)

    const setNextVideoSermon = setNewCurrentMedia(videoSermon,1)
    const setPreviousVideoSermon = setNewCurrentMedia(videoSermon,-1)
    
    return (
        <VStack className={classes.root}>
            <VStack className={classes.playlistContainer} >
                {
                    mediaInLocal?.sermonID && 
                    <VStack>
                    <Heading color="primary" fontSize="1.25rem">
                        Continue from where you stopped
                    </Heading>
                    <HStack>
                        <Button variant="outline" onClick={addLocalToCurrent} >
                            Yes
                        </Button>
                        <Button variant="outline" onClick={removeLocal} >
                            No
                        </Button>
                    </HStack>
                </VStack>
                }
                <Zoom ref={flexRef} in={Boolean(currentMedia.sermonID)} >
                    <Flex ref={flexRef} >
                        {
                            currentMedia.sermonID &&
                            <MediaPlayer setMedia={setMedia}
                                prevVideo={setPreviousVideoSermon}
                                nextVideo={setNextVideoSermon}
                                prevAudio={setPreviousAudioSermon}
                                nextAudio={setNextAudioSermon}
                                currentMedia={currentMedia} /> 
                        }
                    </Flex>
                </Zoom>
            </VStack>
            <Tabs align="center" zIndex={5} onChange={(index) => setTabIndex(index)} >
                <TabList className={classes.tabsContainer} 
                bgColor={scrolling.scrolling ? "bgColor" : "" } defaultValue={2}>
                    <Tab color="tertiary" _selected={selected} >Written Sermon</Tab>
                    <Tab color="tertiary" _selected={selected}>Video Sermon</Tab>
                    <Tab color="tertiary" _selected={selected}>Audio Sermon</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <VStack spacing={4} width="100%"
                         className={classes.prayerContainer}>
                            {textSermon.map((item,idx) => (
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
                            {videoSermon.map((item,idx) => (
                                <PlayListCard key={idx} isLoaded={Boolean(item.sermonID)}
                                    icon={IconComponent(AiFillPlayCircle,"4rem")} onClick={handleCurrentMedia({
                                        ...item,
                                        next: !(idx >= (videoSermon.length - 1)),
                                        previous: !(idx <= 0)
                                    })}
                                    title={item.title} image={item.featureImage || LandingImage}
                                    subtitle={item.author}
                                />
                            ))}
                        </VStack>
                    </TabPanel>
                    <TabPanel>
                        <VStack spacing={4} width="100%"
                         className={classes.prayerContainer}>
                            {audioSermon.map((item,idx) => (
                                <PlayListCard key={idx} isLoaded={Boolean(item.sermonID)}
                                    icon={IconComponent(MdAudiotrack,"4rem")} onClick={handleCurrentMedia({
                                        ...item,
                                        next: !(idx >= (audioSermon.length - 1)),
                                        previous: !(idx <= 0)
                                    })}
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