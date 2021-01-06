import React from "react"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { VStack, HStack, Icon, Text,SkeletonText } from "@chakra-ui/react"
import { FiShare2 } from "react-icons/fi"
import {FaBible} from "react-icons/fa"
import {IDailyReading} from "core/models/dailyReading"
import {IoMdArrowDropdown} from 'react-icons/io'
import {MessageType} from "core/enums/MessageType"
import useToast from "utils/Toast"
import axios from "axios"
import {getDailyReading} from "core/services/prayer.service"


const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        flex: 6,
        minWidth:"20rem",
        "& > div:first-child":{
            alignSelf:"flex-start",
            marginLeft:".8rem"
        }
    },
    bodyContainer: {
        boxShadow: "0px 5px 10px #0000001A",
        backgroundColor:"white",
        borderRadius: "4px",
        width:"100%",
        marginTop:`${theme.spacing(5)}px !important`,
        padding:theme.spacing(2),
        "& > div:first-child":{
            width:"100%"
        }
    },
    textMainContainer:{
        lineHeight:"1.4",
        width:"100%"
    }
}))




const Reflection = () => {
    const classes = useStyles()
    const toast = useToast()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const [dailyReading,setDailyReading] = React.useState<IDailyReading[]>([])
    const newDate = new Intl.DateTimeFormat('en-US', options).format(new Date())
    
    React.useEffect(() => {
        const token = axios.CancelToken.source()
        const getDailyReadingApi = async () => {
            await getDailyReading(token).then(payload => {
                const newReading:IDailyReading[] = payload.data.readings.map((item:IDailyReading,idx:number) => ({
                    ...item,
                    content:item.content.replace(/[1-9][0-9]*/g,(text:string) => (
                        `<br/> ${text} &nbsp; `
                    ))
                })) 
                setDailyReading(newReading)
            }).catch(err => {
                if(!axios.isCancel(err)){
                    toast({
                        title:"Unable to get Daily Reading",
                        subtitle:`Error:${err}`,
                        messageType:MessageType.ERROR
                    })
                }
            })
        }
       getDailyReadingApi() 
       return () => {
           token.cancel()
       }
    },[])
    
    return (
        <VStack className={classes.root} maxWidth="2xl">
            <VStack>
                <VStack align="flex-start">
                    <HStack color="tertiary" fontSize="1.01rem">
                        <Text fontWeight="600" letterSpacing={0}>
                            {newDate}
                        </Text>
                        <Icon as={IoMdArrowDropdown} />
                    </HStack>
                    <HStack color="tertiary" fontSize=".85rem">
                        <Text opacity={.7} letterSpacing={0}>
                            Faithful Church
                        </Text>
                        <Icon as={IoMdArrowDropdown} />
                    </HStack>
                </VStack>
            </VStack>
            <VStack className={classes.bodyContainer}>

                <HStack justify="space-between">
                    <VStack>
                        <SkeletonText startColor="pink.500" endColor="orange.500"  isLoaded={Boolean(dailyReading[0]?.name)}>
                            <Text fontSize="0.8rem" fontWeight={600} color="primary" >
                                {dailyReading.length > 0 && dailyReading[0].name}
                            </Text>
                        </SkeletonText>
                        <SkeletonText startColor="pink.500" endColor="orange.500"  isLoaded={Boolean(dailyReading[0]?.verse)}>
                            <Text fontSize="0.7rem" opacity={.7}>
                            {dailyReading.length > 0 && dailyReading[0].verse}
                            </Text>
                        </SkeletonText>
                    </VStack>
                    <HStack>
                        <Icon opacity={.5} color="tertiary" boxSize="1rem" as={FiShare2} />
                        <Icon opacity={.5} color="tertiary" boxSize="1rem" as={FaBible} />
                    </HStack>
                </HStack>
                <VStack className={classes.textMainContainer}>
                    <SkeletonText w="100%" startColor="gray.100" endColor="gray.500" noOfLines={14} spacing="1" 
                        isLoaded={Boolean(dailyReading[0]?.name.length > 2)}>
                     <Text fontWeight={600} color="tertiary" 
                      dangerouslySetInnerHTML={{__html: dailyReading.length > 0 ? dailyReading[1].content : ""}} />   
                    </SkeletonText>
                    <SkeletonText w="100%" startColor="gray.100" endColor="gray.500" noOfLines={14}
                     spacing="1" isLoaded={Boolean(dailyReading[0]?.name.length > 2)}>
                        <Text color="tertiary" 
                          dangerouslySetInnerHTML={{__html: dailyReading.length > 1 ? dailyReading[0].content : ""}} />
                    </SkeletonText>
                </VStack>
            </VStack>
        </VStack>
    )
}

export default Reflection