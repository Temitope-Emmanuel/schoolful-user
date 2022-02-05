import {
    VStack, HStack, IconButton, Text, Icon, Box,Flex,Heading,
    Slider, SliderTrack, SliderFilledTrack, SliderThumb
} from "@chakra-ui/react"
import React from "react"
import { Media, Player, withMediaProps } from "react-media-player"
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"
import { BsArrowsFullscreen, BsFillVolumeUpFill} from "react-icons/bs"
import {createStyles,makeStyles,Theme} from "@material-ui/core/styles"
import { BiSkipNextCircle, BiSkipPreviousCircle } from "react-icons/bi"
import { GiPodiumWinner } from "react-icons/gi"
import { IMediaSermon } from "core/models/Sermon"
import {MediaType} from "core/enums/MediaType"


const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{},
    controlContainer:{
        alignItems:"center",
        justifyContent:"space-between",
        "& > div:nth-child(2)":{
            width:"50%"
        }
    }
}))

interface IProps {
    currentMedia: IMediaSermon;
    prevVideo:any;
    nextVideo:any;
    prevAudio:any;
    nextAudio:any;
    setMedia(arg:IMediaSermon):void
}

interface IMedia {
    addVolume(arg: number): void;
    currentTime: number;
    duration: number;
    fullscreen(): void
    isFullscreen: boolean;
    isLoading: boolean;
    isMuted: boolean;
    isPlaying: boolean;
    mute(arg: boolean): void;
    muteUnmute(): void;
    pause(): void;
    play(): void;
    playPause(): void;
    progress(): void;
    seekTo(arg: number): void;
    setVolume(arg: number): void;
    skipTime(arg: number): void;
    stop(): void;
    volume: number;
}

interface IMediaProps {
    media: IMedia
}

const PlayPause: React.FC<IMediaProps> = ({ media }) => {
    return (
        <IconButton aria-label="play-pause" onClick={media.playPause}
            icon={<Icon boxSize="3rem" color="primary" borderRadius="50%" as={media.isPlaying ? AiFillPauseCircle : AiFillPlayCircle} />} />
    )
}
const ShowTime: React.FC<IMediaProps> = ({ media }) => {
    const padString = (arg: number) => (
        String(arg).length >= 2 ? arg : `0${arg}`
    )
    const currentTime = `${Math.floor(media.currentTime / 60)}:${padString(Math.floor(media.currentTime % 60))}`
    const duration = `${Math.floor(media.duration / 60)}:${padString(Math.floor(media.duration % 60))}`
    return (
        <Text fontWeight={600} color="tertiary" fontSize="1.2rem" >
            {`${currentTime}/${duration}`}
        </Text>
    )
}

const Progress: React.FC<IMediaProps> = ({ media }) => {
    const seekTime = (e:any) => {
        media.seekTo(e)
    }

    const newTime = Number((media.currentTime / media.duration) * 100)
    return (
        <Slider aria-label="seek Time" onChange={seekTime} defaultValue={0} focusThumbOnChange={false}
            value={newTime} >
            <SliderTrack height="7px">
                <SliderFilledTrack bg="primary" />
            </SliderTrack>
            <SliderThumb boxSize="2rem">
                <Box color="tertiary" as={GiPodiumWinner} />
            </SliderThumb>
        </Slider>
    )
}
const FullScreen: React.FC<IMediaProps> = ({ media }) => {
    return (
        <Flex flex={1} justifyContent="flex-end">
            <IconButton bgColor="bgColor" borderRadius="50%" aria-label="show-full-screen" onClick={media.fullscreen} icon={<Icon as={BsArrowsFullscreen} />} />
        </Flex>
    )
}
const Volume: React.FC<IMediaProps> = ({ media }) => {
    
    const increaseVolume =(e:number) => {
        const newVolume = Number((e/100).toFixed(2))
        media.setVolume(newVolume)
    }

    return (
        <HStack flex={1}>
            {/* <IconButton aria-label="mute-icon" onClick={media.muteUnmute}
             icon={<Icon bgColor="transparent" as={media.isMuted ? GoUnmute : BsFillVolumeMuteFill } />} /> */}
            <Slider aria-label="volume-slider" step={.1} onChange={increaseVolume} defaultValue={media.volume*10}>
                <SliderTrack bg="gray.300">
                    <SliderFilledTrack bg="tertiary" />
                </SliderTrack>
                <SliderThumb boxSize={6}>
                    <Box color="tertiary" as={BsFillVolumeUpFill} />
                </SliderThumb>
            </Slider>
        </HStack>
    )
}

const MediaPlayer: React.FC<IProps> = ({ currentMedia,nextAudio,nextVideo,prevAudio,prevVideo,setMedia }) => {
    const classes = useStyles()
    const [currentTime,setCurrentTime] = React.useState(0)

    

    return (
        <VStack justifyContent="center" flex={1}>
            <Media>
                {(media:IMedia) => {
                    return(
                        <VStack justifyContent="space-evenly" width="100%" >
                        <Player autoPlay vendor={currentMedia.mediaType} src={currentMedia.mediaUrl} />
                        <Progress media={media} />
                        <ShowTime media={media} />
                        <HStack className={classes.controlContainer} w="100%">
                            <Volume media={media}/>
                            <Flex justifyContent="center">
                                <IconButton disabled={!currentMedia.previous} aria-label="previous-label"
                                    onClick={currentMedia.mediaType === MediaType.AUDIO ? 
                                    prevAudio(currentMedia.sermonID) : prevVideo(currentMedia.sermonID)
                                    }
                                icon={<Icon boxSize="2rem" as={BiSkipPreviousCircle} />} />
                                <PlayPause media={media}/>
                                <IconButton disabled={!currentMedia.next} aria-label="next-label"
                                onClick={currentMedia.mediaType === MediaType.AUDIO ? 
                                nextAudio(currentMedia.sermonID) : nextVideo(currentMedia.sermonID)
                                }
                                icon={<Icon boxSize="2rem" as={BiSkipNextCircle}/>} />
                            </Flex>
                            <FullScreen media={media}/>
                        </HStack>
                    </VStack>
                    )
                }}
            </Media>
            <VStack>
                <Heading>
                    {currentMedia.title}
                </Heading>
                <Text>
                    {currentMedia.author}
                </Text>
            </VStack>
        </VStack>
    )
}

export default withMediaProps(MediaPlayer)