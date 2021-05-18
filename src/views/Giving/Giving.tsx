import React from "react"
import { Link } from "react-router-dom"
import { FaSeedling } from "react-icons/fa"
import { FiCreditCard } from "react-icons/fi"
import { IoIosArrowForward, IoMdGift } from "react-icons/io"
import { PaystackConsumer } from "react-paystack"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { LandingImage } from "assets/images"
import { NormalNumberStepper } from "components/Input"
import { VStack, Icon, Text, Skeleton, Heading, HStack, AspectRatio, Image, Button, ModalBody, ModalContent, ModalFooter, Collapse } from "@chakra-ui/react"
import { FaHandHoldingHeart } from "react-icons/fa";
import * as donationService from 'core/services/donation.service'
import * as paymentService from "core/services/payment.service"
import { IDonation } from "core/models/Donation"
import useParams from "utils/Params"
import useToast from "utils/Toast"
import { Donation } from "core/enums/Donation"
import { Dialog } from "components/Dialog"
import { Formik, FormikProps } from "formik"
import { useSelector } from "react-redux"
import { AppState } from "store"


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
            cursor: "pointer",
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
                cursor: "pointer",
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
        height: "22.5vh",
        borderRadius: "4px",
        "& > svg": {
            borderRadius: "50%",
            position: "absolute",
            top: "42%",
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
    },
    inputContainer:{
        "& > div:first-child":{
            display:"flex",
            flexDirection:"column"
        }
    }
}))

const initialValues = {
    amount: "1000"
}

type FormType = typeof initialValues
const Giving = () => {
    const [transactRef,setTransactRef] = React.useState({
        reference:"",
        publicKey:""
    })
    const defaultDonation: IDonation = {
        churchID: 0,
        donationDescription: "",
        donationName: "",
        donationType: Donation.General,
        societyId: 0,

    }
    const [open, setOpen] = React.useState(false)
    const [confirmation,setConfirmation] = React.useState(false)
    const [submitting,setSubmitting] = React.useState(false)
    const handleToggle = () => {
        setOpen(!open)
    }
    const toggleSubmitting = () => {
        setSubmitting(!submitting)
    }
    const toggleConfirmation = () => {
        setConfirmation(!confirmation)
    }
    const [churchDonation, setChurchDonation] = React.useState<IDonation[]>(new Array(5).fill(defaultDonation))
    const currentUser = useSelector((state:AppState) => state.system.currentUser)
    
    const [currentDonation, setCurrentDonation] = React.useState<IDonation>()
    const [value, setValue] = React.useState<string | number>(0)
    const classes = useStyles()
    const params = useParams()
    const toast = useToast()
    
    const config = {
        reference: transactRef.reference,
        email: currentUser.email,
        amount:value as number,
        publicKey: transactRef.publicKey,
        firstname: currentUser.fullname.split(" ")[0],
        lastname: currentUser.fullname.split(" ")[1]
    };
    const onSuccess = (reference: any) => {
        console.log("this is the ref",{reference})
        // Implementation for whatever you want to do with reference and after success call.
        paymentService.verifyDonationTransaction({
            donationId:currentDonation?.donationID as any,
            paymentGateway:"Paystack",
            referenceCode:reference.reference
        }).then(result => {
            if(result){
                toggleSubmitting()
                handleToggle()
            }
        }).catch(err => {
            toast({
                title:"Unable to complete verification",
                subtitle:`Error:${err}`,
                messageType:"error"
            })
        })
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

    React.useEffect(() => {
        const donationApiCall = async () => {
            await donationService.GetDonationByChurch(Number(params.churchId)).then(payload => {
                setChurchDonation(payload.data)
            }).catch(err => {
                toast({
                    title: "Unable to Get Church Donation",
                    subtitle: `Error:${err}`,
                    messageType: "error"
                })
            })
        }
        donationApiCall()
    }, [])

    const handleSubmit = (values: FormType, { ...actions }: any) => {

    }

    const beginPayment = () => {
        setTransactRef({
            publicKey:"",
            reference:""
        })
        paymentService.generateDonationReference({
            amount:value as any,
            donationId:currentDonation?.donationID as number,
            organizationId:params.churchId as any,
            organizationType:"church",
            paymentGateway:"Paystack",
            userId:currentUser.id,
            societyId:currentDonation?.societyId
        }).then(payload => {
            setTransactRef({
                reference: payload.data.reference,
                publicKey: payload.data.publicKey
            })
            Promise.resolve(() => {
              setTimeout(() => {},500)  
            }).then(() => {
                toggleConfirmation()
            })
        }).catch(err => {
            toast({
                messageType:"error",
                subtitle:`Error:${err}`,
                title:"Unable to complete request"
            })
        })
    }

    const handleSetCurrentDonation = (arg: IDonation) => () => {
        setCurrentDonation(arg)
        handleToggle()
    }


    return (
        <>
            <Dialog open={open} close={handleToggle}>
                <ModalContent>
                    <ModalBody display="flex" flexDirection="column"
                        justifyContent="center" alignItems="center">
                        <Heading textStyle="styleh6">
                            How much do you Want to pay
                            </Heading>
                        <Formik initialValues={initialValues} onSubmit={handleSubmit} >
                            {(formikProps: FormikProps<FormType>) => (
                                <VStack className={classes.inputContainer}>
                                    <NormalNumberStepper value={value as number} maxValue={100000}
                                    disabled={confirmation}
                                     onChange={setValue} label="Input Amount to send (NGN)" minValue={1000} />
                                    
                                    <PaystackConsumer {...componentProps}>
                                        {({initializePayment}: any) => (
                                            <>
                                                <Collapse in={!confirmation}>
                                                    <Button onClick={beginPayment}>
                                                        {`Pay ${value}`}
                                                    </Button>
                                                </Collapse>
                                                <Collapse in={confirmation}>
                                                    <HStack>
                                                        <Button onClick={initializePayment}>
                                                            Are You Sure ?
                                                        </Button>
                                                        <Button onClick={toggleConfirmation}>
                                                            Cancel
                                                        </Button>
                                                    </HStack>
                                                </Collapse>
                                            </>
                                        )}
                                    </PaystackConsumer>
                                </VStack>
                            )}
                        </Formik>
                    </ModalBody>
                    {/* <ModalFooter display="flex" justifyContent="center" >
                        <Link to="/dashboard" >
                            Resend Link
                        </Link>
                    </ModalFooter> */}
                </ModalContent>
            </Dialog>

            <VStack maxWidth="lg" className={classes.root}>
                <Link to="/">
                    View History
            </Link>
                <VStack className={classes.givingContainer}>
                    <PaystackConsumer {...componentProps}>
                        {({ initializePayment }: any) => (
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
                                    <VStack bgColor="tertiary" onClick={initializePayment}>
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
                                    <Icon cursor="pointer" boxSize="3rem" bgColor="primary"
                                        onClick={handleSetCurrentDonation(item)}
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
        </>
    )
}


export default Giving