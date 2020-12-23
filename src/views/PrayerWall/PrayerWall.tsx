import React from "react"
import {
    Avatar, AvatarGroup, HStack, Icon,
    Tab, TabList, TabPanel, Textarea, ModalHeader,
    TabPanels, Tabs, VStack, Text, IconButton, ModalBody,
    ModalCloseButton, ModalContent, ModalFooter
} from "@chakra-ui/react"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Button } from "components/Button"
import { DetailCard } from "components/Card"
import { FaPrayingHands, FaComment } from "react-icons/fa"
import { Dialog } from "components/Dialog"
import { TextInput } from "components/Input"
import * as Yup from 'yup'
import { Formik, Field, FieldProps, FormikProps } from "formik"
import { AiFillInfoCircle } from "react-icons/ai"
import { getPrayer, getTestimony, addTestimony as addTestimonyChurch,
    CommentOnTestimony,    
    addPrayerRequest, getPrayerRequest,prayerForPrayerRequest } from "core/services/prayer.service"
import { useSelector } from "react-redux"
import { AppState } from "store"
import useParams from "utils/Params"
import useToast from "utils/Toast"
import { IPrayer } from "core/models/Prayer"
import { IPrayerRequest } from "core/models/PrayerRequest"
import { MessageType } from "core/enums/MessageType"
import { Testimony } from "core/enums/Testimony"
import { ITestimony,ICommentTestimony } from "core/models/Testimony"


const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        flex: 6,
        "& > div": {
            width: "100%"
        }
    },
    tabsContainer: {
        paddingBottom: "1rem",
        "& button": {
            borderBottom: "0 !important"
        }
    },
    prayerContainer: {
        width: "100%",
        maxWidth: "27rem",
        marginTop: "3rem !important",
        "& > *": {
            width: "100%",
            shadow: "5px 0px 6px #0000001A",
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "6px",
            alignItems: "flex-start !important"
        }
    }
}))


interface IAddPrayerRequestForm {
    title: string;
    detail: string;
}

interface IAddPrayerRequest {
    addNewPrayer(arg: IPrayerRequest): void
}

const AddPrayerRequest: React.FC<IAddPrayerRequest> = ({ addNewPrayer }) => {
    const toast = useToast()
    const params = useParams()
    const currentUser = useSelector((state: AppState) => state.system.currentUser)
    const initialValues = {
        title: "",
        detail: ""
    }
    const submitAddPrayerForm = (values: IAddPrayerRequestForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const newPrayer: IPrayerRequest = {
            churchId: Number(params.churchId),
            dateEntered: (new Date()).toJSON(),
            personId: currentUser.id,
            prayerDetail: values.detail,
            prayerTile: values.title,
            prayerTitle: values.title,
        }

        addPrayerRequest(newPrayer).then(payload => {
            actions.setSubmitting(false)
            addNewPrayer(payload.data)
            toast({
                title: "New Prayer",
                subtitle: `New Prayer ${values.title} has been created`,
                messageType: "success"
            })
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title: "Unable to Create New Prayer",
                subtitle: `Error:${err}`,
                messageType: "error"
            })
        })
    }

    const FormValidation = () => (
        Yup.object({
            title: Yup.string().required(),
            request: Yup.string().required()
        })
    )


    return (
        <ModalContent display="flex" flexDir="column"
            justifyContent="center" alignItems="center" bgColor="bgColor2">
            <ModalHeader color="primary" mt={10}
             fontWeight={600} fontSize="1.8rem" >
                Add a prayer request
            </ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <Formik initialValues={initialValues}
                onSubmit={submitAddPrayerForm} validationSchema={FormValidation}
            >
                {(formikProps: FormikProps<IAddPrayerRequestForm>) => {
                    return (
                        <>
                            <ModalBody display="flex" flexDirection="column"
                                alignItems="center" p={5} maxW="md" width="100%">
                                <TextInput name="title" placeholder="Enter Title" />
                                <Field name="request" >
                                    {({ field }: FieldProps) => (
                                        <Textarea placeholder="Enter Prayer detail" rows={7} width="100%" {...field} />
                                    )}
                                </Field>
                            </ModalBody>
                            <ModalFooter display="flex" flexDirection="column"
                                alignItems="center" px={6} >
                                <Button disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                    isLoading={formikProps.isSubmitting} loadingText={`Creating new Prayer ${formikProps.values.title}`}
                                    onClick={(formikProps.handleSubmit as any)} px="10" fontSize="1rem"
                                >
                                    Add
                            </Button>
                            </ModalFooter>
                        </>
                    )
                }}
            </Formik>
        </ModalContent>
    )
}

interface IAddTestimonyComment {
    addTestimonyComment(arg:ITestimony):void;
    testimony:ITestimony
}
interface IAddTestimonyCommentForm {
    comment:string
}
const AddTestimonyComment:React.FC<IAddTestimonyComment> = ({ addTestimonyComment,testimony }) => {
    const toast = useToast()
    const params = useParams()
    const currentUser = useSelector((state: AppState) => state.system.currentUser)
    const initialValues = {
        comment: ""
    }
    const submitAddCommentToTestimony = (values: IAddTestimonyCommentForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const newTestimonyComment: ICommentTestimony = {
            comment:values.comment,
            personId:currentUser.id,
            testimonyId:testimony.testimonyID as number
        }

        CommentOnTestimony(newTestimonyComment).then(payload => {
            actions.setSubmitting(false)
            addTestimonyComment(testimony)
            toast({
                title: "Comment has been added to Testimony",
                subtitle: "",
                messageType: MessageType.SUCCESS
            })
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title: "Unable to Add Comment to Testimony",
                subtitle: `Error:${err}`,
                messageType: "error"
            })
        })
    }

    const FormValidation = () => (
        Yup.object({
            comment: Yup.string().required()
        })
    )


    return (
        <ModalContent display="flex" flexDir="column"
            justifyContent="center" alignItems="center" bgColor="bgColor2">
            <ModalHeader color="primary" mt={10}
             fontWeight={600} fontSize="1.8rem" >
                {`Add Comment to ${testimony.testimonyTile}`}
            </ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <Formik initialValues={initialValues}
                onSubmit={submitAddCommentToTestimony} validationSchema={FormValidation}
            >
                {(formikProps: FormikProps<IAddTestimonyCommentForm>) => {
                    return (
                        <>
                            <ModalBody display="flex" flexDirection="column"
                                alignItems="center" p={5} maxW="md" width="100%">
                                <Field name="comment" >
                                    {({ field }: FieldProps) => (
                                        <Textarea placeholder="Enter Comment" rows={7} width="100%" {...field} />
                                    )}
                                </Field>
                            </ModalBody>
                            <ModalFooter display="flex" flexDirection="column"
                                alignItems="center" px={6} >
                                <Button disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                    isLoading={formikProps.isSubmitting} loadingText={`Adding Comment to ${testimony.testimonyTile}`}
                                    onClick={(formikProps.handleSubmit as any)} px="10" fontSize="1rem"
                                >
                                    Add
                            </Button>
                            </ModalFooter>
                        </>
                    )
                }}
            </Formik>
        </ModalContent>
    )
}


interface AddTestimonyForm {
    title: string;
    testimony: string;
}

interface IAddTestimonyProps {
    addTestimony(arg: ITestimony): void
}
const AddTestimony: React.FC<IAddTestimonyProps> = ({ addTestimony }) => {
    const params = useParams()
    const currentUser = useSelector((state: AppState) => state.system.currentUser)
    const toast = useToast()
    const initialValues = {
        title: "",
        testimony: ""
    }
    const submitAddTestimonyForm = (values: AddTestimonyForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const newTestimony: ITestimony = {
            churchId: Number(params.churchId),
            dateEntered: new Date(),
            personId: currentUser.id,
            testimonyDetail: values.testimony,
            testimonyTile:values.title,
            testimonyType: Testimony.GENERAL
        }
        addTestimonyChurch(newTestimony).then(payload => {
            toast({
                title: "Added Testimony",
                subtitle: "",
                messageType: "success"
            })
            addTestimony(payload.data)
        }).catch(err => {
            toast({
                title: "Unable to Add new Testimony",
                subtitle: `Error:${err}`,
                messageType: "error"
            })
        })
    }
    const FormValidation = () => (
        Yup.object({
            title: Yup.string().required(),
            testimony: Yup.string().required()
        })
    )



    return (
        <ModalContent display="flex" flexDir="column"
            justifyContent="center" alignItems="center" bgColor="bgColor2">
            <ModalHeader mt={10} fontSize="1.8rem"
                color="primary" fontWeight={600}
            >
                Add a Testimony
            </ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <Formik initialValues={initialValues} validationSchema={FormValidation}
                onSubmit={submitAddTestimonyForm}>
                {(formikProps: FormikProps<AddTestimonyForm>) => {
                    return (
                        <>
                            <ModalBody display="flex" flexDirection="column"
                                alignItems="center" p={5} maxW="md" width="100%">
                                <TextInput name="title" placeholder="Enter Title" />
                                <Field name="testimony" >
                                    {({ field }: FieldProps) => (
                                        <Textarea placeholder="Enter Testimony" rows={7} width="100%" {...field} />
                                    )}
                                </Field>
                                <Text mt={3}>
                                    <Icon as={AiFillInfoCircle} boxSize="1.4rem" mr=".4rem" color="tertiary" />
                                    Your Testimony is subject to approval from the church admin
                                </Text>
                            </ModalBody>
                            <ModalFooter display="flex" flexDirection="column"
                                alignItems="center" px={6} >
                                <Button disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                    isLoading={formikProps.isSubmitting} px="10" fontSize="1rem"
                                    onClick={(formikProps.handleSubmit as any)} loadingText={`Creating Testimony ${formikProps.values.title}`}
                                >
                                    Add
                            </Button>
                            </ModalFooter>
                        </>
                    )
                }}
            </Formik>
        </ModalContent>
    )
}

const PrayerWall = () => {
    const defaultPrayer: IPrayer = {
        denominationID: 0,
        prayerName: "",
        prayerdetail: "",
        denomination: ""
    }
    const defaultPrayerRequest: IPrayerRequest = {
        churchId: 0,
        dateEntered: new Date(),
        personId: "",
        prayerDetail: "",
        prayerTile: ""
    }
    const defaultTestimony: ITestimony = {
        churchId: 0,
        dateEntered: new Date(),
        personId: "",
        testimonyDetail: "",
        testimonyTile: "",
        testimonyType: Testimony.GENERAL
    }
    const classes = useStyles()
    const toast = useToast()
    const params = useParams()
    const [open, setOpen] = React.useState(false)
    const currentChurch = useSelector((state:AppState) => state.system.currentChurch)
    const currentUser = useSelector((state:AppState) =>  state.system.currentUser)
    const [currentTestimony,setCurrentTestimony] = React.useState<ITestimony>(defaultTestimony)
    const [showPrayerForm, setShowPrayerForm] = React.useState(false)
    const [showCommentTestimony,setShowCommentTestimony] = React.useState(false)
    const selected = { color: "primary" }
    const [churchPrayer, setChurchPrayer] = React.useState<IPrayer[]>(new Array(10).fill(defaultPrayer))
    const [memberPrayerRequest, setMemberPrayerRequest] = React.useState<IPrayerRequest[]>(new Array(10).fill(defaultPrayerRequest))
    const [churchTestimony, setChurchTestimony] = React.useState<ITestimony[]>(new Array(10).fill(defaultTestimony))

    const addToPrayerRequest = (newPrayerRequest: IPrayerRequest) => {
        setMemberPrayerRequest([...memberPrayerRequest, newPrayerRequest])
        handleDialog()
    }
    const addToTestimony = (newTestimony: ITestimony) => {
        setChurchTestimony([...churchTestimony, newTestimony])
        handleDialog()
    }

    const handleDialog = () => {
        setOpen(!open)
    }
    const handlePrayerForm = () => {
        handleDialog()
        setShowPrayerForm(true)
    }
    const handleTestimonyForm = () => {
        handleDialog()
        setShowPrayerForm(false)
        setShowCommentTestimony(false)
    }

    React.useEffect(() => {
        const getChurchPrayerByChurch = async () => {
            getPrayer(3).then(payload => {
                setChurchPrayer(payload.data)
            }).catch(err => {
                toast({
                    title: "Unable to Get Church Prayers",
                    subtitle: `Error:${err}`,
                    messageType: "error"
                })
            })
        }
        const getChurchMemberPrayer = async () => {
            getPrayerRequest(Number(params.churchId)).then(payload => {
                setMemberPrayerRequest(payload.data)
            }).catch(err => {
                toast({
                    title: "Unable to Get Church Prayer Request",
                    subtitle: `Error:${err}`,
                    messageType: MessageType.ERROR
                })
            })
        }
        const getChurchTestimony = async () => {
            getTestimony({ churchId: Number(params.churchId), testimonyType: Testimony.GENERAL }).then(payload => {
                setChurchTestimony(payload.data)
            }).catch(err => {
                toast({
                    title: "Unable to Get Church Testimony",
                    subtitle: `Error:${err}`,
                    messageType: MessageType.ERROR
                })
            })
        }

        getChurchPrayerByChurch()
        getChurchMemberPrayer()
        getChurchTestimony()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addToPrayed = (prayerId:number) => () => {
        prayerForPrayerRequest(prayerId,currentUser.id).then(payload => {
            toast({
                title:`Added ${currentUser.fullname} to list of prayed`,
                subtitle:"",
                messageType:MessageType.SUCCESS
            })
        }).catch(err => {
            toast({
                title:"Unable to get User list of prayed",
                subtitle:`Error:${err}`,
                messageType:MessageType.ERROR
            })
        })
    }
    const addToTestimonyComment = (arg:ITestimony) => {
        handleDialog()
        const newTestimony = [...churchTestimony]
        const testimonyId = churchTestimony.findIndex(item => item.testimonyID === arg.testimonyID)
        newTestimony.splice(testimonyId,1,arg)
        setChurchTestimony([...newTestimony])
    }
    const handleTestimonyCommentForm = (arg:ITestimony) => () => {
        setShowCommentTestimony(true)
        setShowPrayerForm(false)
        setCurrentTestimony(arg)
        handleDialog()
    } 

    return (
        <>
            <VStack className={classes.root}>
                <Tabs align="center" defaultValue={2}>
                    <TabList className={classes.tabsContainer}>
                        <Tab color="tertiary" _selected={selected} >Prayer Requests</Tab>
                        <Tab color="tertiary" _selected={selected}>Testimonies</Tab>
                        <Tab color="tertiary" _selected={selected}>Church Prayers</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Button onClick={handlePrayerForm}>
                                Add Prayer Request
                        </Button>
                            <VStack spacing={4} width="100%"
                                className={classes.prayerContainer}>
                                {memberPrayerRequest.map((item, idx) => (
                                    <DetailCard isLoaded={Boolean(item.prayerRequestID)}
                                     title={item.prayerTile}
                                        key={idx}
                                         subtitle={""}
                                        image="https://bit.ly/ryan-florence" timing="2d"
                                        body={item.prayerDetail}
                                    >
                                        <HStack width="100%" justify="space-between">
                                            <AvatarGroup size="sm" max={3}>
                                                <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                                                <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                                                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                                                <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
                                                <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
                                            </AvatarGroup>
                                            <Text mr="auto">
                                                <Text as="b">14 People</Text> Prayed
                                            </Text>
                                            <IconButton aria-label="add-to-prayed"
                                             onClick={addToPrayed(item.prayerRequestID as number)}
                                              icon={<Icon  boxSize="1rem" as={FaPrayingHands} />} />
                                        </HStack>
                                    </DetailCard>
                                ))}
                            </VStack>
                        </TabPanel>
                        <TabPanel>

                            <Button onClick={handleTestimonyForm}>
                                Add a Testimony
                        </Button>
                            <VStack spacing={4} width="100%"
                                className={classes.prayerContainer}>
                                {churchTestimony.map((item, idx) => (
                                    <DetailCard isLoaded={Boolean(item.testimonyID)}
                                        title={item.testimonyTile} key={idx} subtitle="Prayer For Help"
                                        image="https://bit.ly/ryan-florence"
                                        body={item.testimonyDetail}
                                    >
                                        <HStack width="100%" justify="space-between">
                                            <IconButton onClick={handleTestimonyCommentForm(item)} aria-label="add comment to Testimony" icon={
                                            <Icon fontSize="1.5rem" as={FaComment} color="tertiary" opacity={.5} />
                                            } />
                                        </HStack>
                                    </DetailCard>
                                ))}
                            </VStack>
                        </TabPanel>
                        <TabPanel>
                            <VStack spacing={4} width="100%"
                                className={classes.prayerContainer}>
                                {/* <Heading p={0} as="h6" color="primary" size="1rem" textAlign="left"
                                    alignSelf="flex-start" bgColor="transparent"
                                >
                                    October Daily Fasting & Prayer
                                </Heading> */}
                                {churchPrayer.map((item, idx) => (
                                    <DetailCard isLoaded={Boolean(item.prayerID)} title={item.prayerName}
                                        key={idx} subtitle=""
                                         image={currentChurch.churchLogo}
                                        body={item.prayerdetail}
                                    >
                                        {/* <HStack width="100%" justify="space-between">
                                            <AvatarGroup size="sm" max={3}>
                                                <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                                                <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                                                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                                                <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
                                                <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
                                            </AvatarGroup>
                                            <Text mr="auto">
                                                <Text as="b">14 People</Text> Prayed
                                                    </Text>
                                            <Icon boxSize="1rem" as={FaPrayingHands} />
                                        </HStack> */}
                                    </DetailCard>
                                ))}
                            </VStack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </VStack>
            <Dialog open={open} close={handleDialog} size="xl" >
                {showPrayerForm ? <AddPrayerRequest addNewPrayer={addToPrayerRequest} /> :
                showCommentTestimony ? <AddTestimonyComment addTestimonyComment={addToTestimonyComment} testimony={currentTestimony} />: <AddTestimony addTestimony={addToTestimony} />}
            </Dialog>
        </>
    )
}

export default PrayerWall