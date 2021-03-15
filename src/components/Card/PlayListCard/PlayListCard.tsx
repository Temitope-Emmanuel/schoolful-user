import { VStack,Text,Icon,AspectRatio,Image } from "@chakra-ui/react"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"
import {FiShare2} from "react-icons/fi"
import React from "react"



const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        margin:theme.spacing(3,0),
        backgroundColor:"white",
        paddingBottom:".5rem",
        height:"35vh",
        boxShadow:"0px 3px 6px #0000000D",
        cursor:"pointer",
        borderRadius:"4px",
        width:"100%",
        alignItems:"flex-start", 
        "& > div:first-child":{
            minHeight:"55%",
            
        },
        "& > div:nth-child(2)":{
            margin:theme.spacing(.7,.5),
            marginLeft:".2rem !important",
            alignSelf:"flex-start",
            "& p:first-child":{
                fontSize:"1.4rem",
                fontWeight:"600"
            },
            "& p:nth-child(2)":{
                fontSize:"1.1rem",
                fontStyle:"italic"
            }
        },
        "& img":{
            borderRadius:"4px",
        }
    }
}))


interface IProps {
    title:string;
    image:string;
    subtitle:string;
    isLoaded:boolean;
    icon?:any;
    link?:string;
    onClick?:any
}


const PlayListCard:React.FC<IProps> = ({icon,isLoaded,onClick,image,title,subtitle,link}) => {
    const classes = useStyles()
    return(
        // <Skeleton isLoaded={isLoaded}>
            <VStack className={classes.root} onClick={onClick ? onClick : null} >
                <AspectRatio width="100%" ratio={7/5} position="relative" >
                    <>
                    <Image src={image} />
                    {icon &&
                        icon
                    }
                    </>
                </AspectRatio>
                <VStack align="flex-start" >
                    <Text>
                        {title}&nbsp;
                    </Text>
                    <Text>
                        {subtitle}
                    </Text>
                    {link && 
                    <Icon as={FiShare2} color="primary" />
                    }
                </VStack>
            </VStack>     
        // </Skeleton>
    )
}

export default PlayListCard