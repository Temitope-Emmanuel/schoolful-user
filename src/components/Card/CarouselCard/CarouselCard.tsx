import React from 'react';
import { makeStyles,createStyles } from '@material-ui/core/styles';
import {AspectRatio,Image,Icon,VStack,Text} from "@chakra-ui/react"
import {FiShare2} from "react-icons/fi"


const useStyles = makeStyles(theme => createStyles({
  root: {
    width:"50%",
    backgroundColor:"white",
    borderRadius:"4px",
    boxShadow:" 0px 5px 10px #151C4D1F"
  },
  titleContainer:{
    alignItems:"flex-start !important",
    margin:theme.spacing(3,1),
    marginLeft:"8px !important",
    marginTop:0,
    alignSelf:"flex-start"
  }
}));

interface IProps {
    image:string;
    title:string;
    subtitle:string;
    alt:string;
    share?:string;
    icon?:any
}

const CarouselCard:React.FC<IProps> = ({image,title,subtitle,alt}) => {
  const classes = useStyles();

  return (
      <VStack className={classes.root}>
          <AspectRatio width="100%" maxW="400px" ratio={4/3} >
              <Image src={image} alt={alt} />
          </AspectRatio>
          <VStack className={classes.titleContainer}>
              <Text>
                  {title}
              </Text>
              <Text>
                  {subtitle}
              </Text>
              <Icon as={FiShare2} color="primary" />
          </VStack>
      </VStack>
  );
}

export default CarouselCard