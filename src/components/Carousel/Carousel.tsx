import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import {AiOutlineArrowLeft,AiOutlineArrowRight} from "react-icons/ai"
import {HStack,VStack,Text} from "@chakra-ui/react"
import {Button} from "components/Button"
import {Pyramid,Couple} from "assets/images"
import { ISermon } from 'core/models/Sermon';



const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const tutorialSteps = [
  {
    label: 'San Francisco – Oakland Bay Bridge, United States',
    imgPath:Pyramid,
  },
  {
    label: 'Bird',
    imgPath:Couple,
  },
  {
    label: 'Bali, Indonesia',
    imgPath:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    label: 'NeONBRAND Digital Marketing, Las Vegas, United States',
    imgPath:
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    label: 'Goč, Serbia',
    imgPath:
      'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60',
  },
];


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width:"50%",
    "& > div":{
      width:"100%"
    },
    "& .MuiMobileStepper-positionStatic": {
      justifyContent: "center",
      margin:"auto",
      width:"min-content"
    },
    "& .MuiMobileStepper-dot": {
      backgroundColor: "#383838"
    },
    "& .MuiMobileStepper-dotActive": {
      backgroundColor: "#B603C9"
    }
  },
  img: {
    height: 200,
    display: 'block',
    overflow: 'hidden',
    width: '100%'
  },
  imageContainer:{
    boxShadow:"0px 5px 10px #151C4D1F",
    backgroundColor:"white",
    maxW:"3rem !important",
    margin:`${theme.spacing(2,1)} !important`,
    borderRadius:"4px",
    flex:1,
    "& > div":{
      alignSelf:"flex-start",
      alignItems:"flex-start"
    },
    "& p:first-child":{
      fontSize:"1.2rem",
      fontWeight:"600"
    },
    "& p:nth-child(2)":{
      fontSize:"0.85rem",
      fontStyle:"italic"
    }
  }
}));

interface IProps {
  churchSermon:ISermon[]
}

const SwipeableTextMobileStepper:React.FC<IProps> = ({churchSermon}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = churchSermon.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };


  return (
    <div className={classes.root}>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        // index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {churchSermon.map((item, index) => (
          <HStack maxW="40rem" mx="auto">
            <VStack key={item.sermonID} className={classes.imageContainer}>
                {Math.abs(activeStep - index) <= 2 ? (
                <img className={classes.img} src={item.featureImage} alt={item.title} />
                ) : null}
                <VStack pl={3}>
                  <Text color="tertiary" >
                      {item.title}
                  </Text>
                  <Text color="tertiary" >
                    {item.sermonContent.substr(0,20)}
                  </Text>
                </VStack>
            </VStack>
            <VStack key={`${item.sermonID}-2`} className={classes.imageContainer}>
                {Math.abs(activeStep - index) <= 2 ? (
                <img className={classes.img} src={item.featureImage} alt={item.title} />
                ) : null}
                <VStack pl={3}>
                  <Text color="tertiary" >
                      More than Gold
                  </Text>
                  <Text color="tertiary" >
                    Pst Emeka
                  </Text>
                </VStack>
            </VStack>
          </HStack>
        ))}
        
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="dots"
        activeStep={activeStep}
        nextButton={
          <Button display="none" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            {theme.direction === 'rtl' ? <AiOutlineArrowLeft /> : <AiOutlineArrowRight />}
          </Button>
        }
        backButton={
          <Button display="none" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <AiOutlineArrowRight /> : <AiOutlineArrowLeft/>}
            Back
          </Button>
        }
      />
    </div>
  );
}

export default SwipeableTextMobileStepper;