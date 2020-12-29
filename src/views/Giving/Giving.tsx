import React from "react"
import { Link } from "react-router-dom"
import {FaSeedling} from "react-icons/fa"
import {FiCreditCard} from "react-icons/fi"
import {IoIosArrowForward,IoMdGift} from "react-icons/io"
import { PaystackConsumer } from "react-paystack"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { LandingImage } from "assets/images"
import { VStack, Icon, Text,Skeleton, Heading, HStack, AspectRatio, Image } from "@chakra-ui/react"
import { FaHandHoldingHeart } from "react-icons/fa";
import * as donationService from 'core/services/donation.service'
import {IDonation} from "core/models/Donation"
import useParams from "utils/Params"
import useToast from "utils/Toast"
import {Donation} from "core/enums/Donation"


const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        flex: 6,
        "& > a": {
            textDecoration: "underline",
            color: "#151C4D",
            fontSize: "14px"
        }
    },
    givingContainer: {
        width: "100%",
        "& > div:first-child": {
            width: "100%",
            borderRadius: "4px",
            boxShadow: "0px 5px 10px #0000000D",
            padding: theme.spacing(3, 5),
            cursor:"pointer",
            justifyContent: "space-between",
            "& p": {
                fontSize: ".9rem",
                color: "white"
            },
            "& svg": {
                width: "2rem",
                height: "1.85rem"
            }
        },
        "& > div:nth-child(2)": {
            width: "100%",
            height: "104px",
            overflow: "hidden",
            "& > div": {
                width: "50%",
                cursor:"pointer",
                borderRadius: "4px",
                boxShadow: "0px 5px 10px #0000000D",
                padding: theme.spacing(3, 5),
                justifyContent: "center",
                "& p": {
                    color: "white",
                    whiteSpace: "nowrap"
                },
                "& svg": {
                    width: "2rem",
                    height: "1.85rem"
                }
            }
        },
        "& > div:last-child": {
            marginTop: theme.spacing(10)
        }
    },
    detailContainer: {
        position: "relative",
        boxShadow: "0px 5px 10px #0000001A",
        height: "37.5vh",
        borderRadius: "4px",
        "& > svg": {
            borderRadius: "50%",
            position: "absolute",
            top: "49%",
            zIndex: 3,
            right: "3%"
        },
        "& > div:first-child": {
            height: "60%"
        },
        "& > div:last-child": {
            alignItems: "flex-start !important",
            zIndex: 3,
            alignSelf: "flex-start !important",
            padding: theme.spacing(1),
            "& h6": {
                letterSpacing: "0px",
                fontSize: "1.1rem"
            },
            "& p": {
                fontSize: "0.8rem",
                letterSpacing: "0px",
                marginTop: "0 !important",
                paddingRight: "1rem"
            }
        }
    }
}))


const Giving = () => {
    const defaultDonation:IDonation = {
        churchID:0,
        donationDescription:"",
        donationName:"",
        donationType:Donation.General,
        societyId:0,

    }
    const config = {
        reference: String((new Date()).getTime()),
        email: "user@example.com",
        amount: 20000,
        publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || "",
        firstname: 'cool',
        lastname: 'story'
    };
    const onSuccess = (reference: any) => {
        // Implementation for whatever you want to do with reference and after success call.
        console.log(reference);
    };

    const onClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed')
    }
    const componentProps = {
        ...config,
        text: 'Paystack Button Implementation',
        onSuccess,
        onClose
    };
    const [churchDonation,setChurchDonation ] = React.useState<IDonation[]>(new Array(5).fill(defaultDonation))

    const classes = useStyles()
    const params = useParams()
    const toast = useToast()
    React.useEffect(() => {
        const donationApiCall = async () => {
            await donationService.GetDonationByChurch(Number(params.churchId)).then(payload => {
                setChurchDonation(payload.data)
            }).catch(err => {
                toast({
                    title:"Unable to Get Church Donation",
                    subtitle:`Error:${err}`,
                    messageType:"error"
                })
            })
        }
        donationApiCall()
     },[])


    return (
        <VStack maxWidth="lg" className={classes.root}>
            <Link to="/">
                View History
            </Link>
            <VStack className={classes.givingContainer}>
                <PaystackConsumer {...componentProps}>
                    {({ initializePayment }:any) => (
                        <>
                        <HStack bgColor="tertiary" onClick={initializePayment}>
                        <Icon color="primary" as={FaSeedling} />
                        <Text>
                            Sow a seed
                        </Text>
                        <Icon color="white" as={IoIosArrowForward} />
                    </HStack>
                    <HStack>
                        <VStack bgColor="tertiary" onClick={initializePayment} >
                            <Icon color="primary" as={IoMdGift} />
                            <Text>
                                Give your offering
                            </Text>
                        </VStack>
                        <VStack  bgColor="tertiary" onClick={initializePayment}>
                            <Icon color="primary" as={FiCreditCard} />
                            <Text>
                                Tithe
                            </Text>
                        </VStack>
                    </HStack>
                    </>
                    )}
                </PaystackConsumer>
                <VStack spacing={8} width="100%">
                    {churchDonation.map((item, idx) => (
                        <Skeleton key={idx} width="100%" isLoaded={Boolean(item.donationID)} >
                                <VStack className={classes.detailContainer}>
                                <AspectRatio width="100%" ratio={16 / 9} >
                                    <Image src={LandingImage} />
                                </AspectRatio>
                                <Icon boxSize="3rem" bgColor="primary"
                                    padding=".8rem" color="white" as={FaHandHoldingHeart} />
                                <VStack>
                                    <Heading as="h6" color="tertiary">
                                        {item.donationName}
                                    </Heading>
                                    <Text noOfLines={2} color="tertiary" opacity={.8} >
                                        {item.donationDescription}
                                    </Text>
                                </VStack>
                            </VStack>
                        
                        </Skeleton>
                    ))}
                </VStack>
            </VStack>
        </VStack>
    )
}


export default Giving