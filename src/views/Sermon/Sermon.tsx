import React from "react"
import { 
        Tab,TabList,TabPanel,Icon,Flex,HStack,
        TabPanels,Tabs,VStack,Heading,Text,Divider
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
import { useSelector,useDispatch } from "react-redux"
import { AppState } from "store"
import {setCurrentStream} from "store/Livestream/actions"
import { LiveStreamChurchResponse } from "core/models/livestream"
import {MdLiveTv} from "react-icons/md"
import { useHistory } from "react-router-dom"



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
            borderBottom:"0 !important",
            fontFamily:"MulishBold"
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
        churchID:0,
        featureDateFrom:new Date(),
        featureDateTo:new Date(), 
        sermonContent:"",
        title:"",
        mediaType: 'text',
    }

    const defaultMediaSermon:IMediaSermon = {
        ...defaultSermon,
        previous:false,
        next:false
    }
    const params = useParams()
    const history = useHistory()
    const scrolling = useScroll()
    const toast = useToast()
    const dispatch = useDispatch()
    const classes = useStyles()
    const selected = {color:"primary"}
    const [tabIndex,setTabIndex] = React.useState(0)
    const [justRendered,setJustRendered] = React.useState(false)
    const [mediaInLocal,setMediaInLocal] = React.useState<null | IMediaSermon>()
    const [churchSermon,setChurchSermon] = React.useState<ISermon[]>(new Array(10).fill(defaultSermon))
    const [currentMedia,setCurrentMedia] = React.useState<IMediaSermon>(defaultMediaSermon)
    const [textSermon,setTextSermon] = React.useState<ISermon[]>([])
    const [videoSermon,setVideoSermon] = React.useState<ISermon[]>([])
    const [audioSermon,setAudioSermon] = React.useState<ISermon[]>([])
    const livestream = useSelector((state: AppState) => ({
        upComing: state.livestream.upComing,
        isLive: state.livestream.isLive
    }))

    React.useEffect(() => {
        if(justRendered){
            if ('URLSearchParams' in window) {
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.set("tabs", String(tabIndex));
                const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                window.history.pushState(null, '', newRelativePathQuery);
                // window.location.search = searchParams.toString();
            }
        }
    },[tabIndex])
    
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabs = urlParams.get('tabs');
        if((Number(tabs) > -1) && (4 > Number(tabs))){
            setTabIndex(Number(tabs))
        }
        setJustRendered(true)
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
            const textSermon = churchSermon.filter((item) => item.mediaType === 'text').map(item => ({
                ...item,
                mediaType:MediaType.TEXT
            }))
            const audioSermon = churchSermon.filter(item => item.mediaType === 'audio').map(item => ({
                ...item,
                mediaType:MediaType.AUDIO
            }))
            const videoSermon = churchSermon.filter(item => item.mediaType === 'video').map(item => ({
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

    const handleSetCurrentStream = (arg:LiveStreamChurchResponse) => () => {
        dispatch(setCurrentStream({
            broadCastID:arg.liveBroadcastID,
            toast
        }))
        history.push(`/church/${params.churchId}/livestream/${arg.liveBroadcastID}`)
    }
    
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
            <Tabs align="center" zIndex={5} index={tabIndex} onChange={setTabIndex} >
                <TabList className={classes.tabsContainer} 
                    bgColor={scrolling.scrolling ? "bgColor" : "" } defaultValue={2}>
                    <Tab color="tertiary" _selected={selected} >Written</Tab>
                    <Tab color="tertiary" _selected={selected}>Video</Tab>
                    <Tab color="tertiary" _selected={selected}>Audio</Tab>
                    <Tab color="tertiary" _selected={selected}>Livestream</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <VStack spacing={4} width="100%"
                         className={classes.prayerContainer}>
                            {textSermon.length ? 
                                textSermon.map((item,idx) => (
                                    <PlayListCard key={idx} isLoaded={Boolean(item.sermonID)}
                                        title={item.title} image={item.featureImage || LandingImage}
                                        subtitle={item.author}
                                    />
                                )) : 
                                <Text color="primary" textStyle="h5">
                                    No Available Written Sermon
                                </Text>    
                        }
                        </VStack>
                    </TabPanel>
                    <TabPanel>
                        <VStack spacing={4} width="100%"
                         className={classes.prayerContainer}>
                            {videoSermon.length ? videoSermon.map((item,idx) => (
                                <PlayListCard key={idx} isLoaded={Boolean(item.sermonID)}
                                    icon={IconComponent(AiFillPlayCircle,"4rem")} onClick={handleCurrentMedia({
                                        ...item,
                                        next: !(idx >= (videoSermon.length - 1)),
                                        previous: !(idx <= 0)
                                    })}
                                    title={item.title} image={item.featureImage || LandingImage}
                                    subtitle={item.author}
                                />
                            )) : 
                            <Text color="primary" textStyle="h5">
                                No Available Video Sermon
                            </Text> 
                         }
                        </VStack>
                    </TabPanel>
                    <TabPanel>
                        <VStack spacing={4} width="100%"
                         className={classes.prayerContainer}>
                            {audioSermon.length ?  audioSermon.map((item,idx) => (
                                <PlayListCard key={idx} isLoaded={Boolean(item.sermonID)}
                                    icon={IconComponent(MdAudiotrack,"4rem")} onClick={handleCurrentMedia({
                                        ...item,
                                        next: !(idx >= (audioSermon.length - 1)),
                                        previous: !(idx <= 0)
                                    })}
                                    title={item.title} image={item.featureImage || LandingImage}
                                    subtitle={item.author}
                                />
                            )) :
                                <Text color="primary" textStyle="h5">
                                    No Available Audio Sermon
                                </Text>
                            }
                        </VStack>
                    </TabPanel>
                <TabPanel>
                <VStack spacing={4} width="100%"
                         className={classes.prayerContainer}>
                             <Text>
                                Live
                             </Text>
                            {livestream.isLive.map((item,idx) => (
                                <PlayListCard key={idx} isLoaded={Boolean(item.liveBroadcastID)}
                                    icon={IconComponent(MdLiveTv,"3rem")} onClick={handleSetCurrentStream(item)}
                                    title={item.title} image={LandingImage}
                                    subtitle={item.description}
                                />
                            ))}
                            <Divider/>
                            <Text>
                                UpComing
                            </Text>
                            {livestream.upComing.map((item,idx) => (
                                <PlayListCard key={idx} isLoaded={Boolean(item.liveBroadcastID)}
                                    icon={IconComponent(MdLiveTv,"3rem")} onClick={handleSetCurrentStream(item)}
                                    title={item.title} image={LandingImage}
                                    subtitle={item.description}
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