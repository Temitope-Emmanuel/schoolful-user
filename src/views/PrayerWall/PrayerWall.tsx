import React from "react"
import {
    Avatar, AvatarGroup, HStack, Icon,
    Tab, TabList, TabPanel, Textarea, ModalHeader, Heading,
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
import {
    getTestimony, addTestimony as addTestimonyChurch,
    CommentOnTestimony,
    addPrayerRequest, prayerForPrayerRequest
} from "core/services/prayer.service"
import { useDispatch, useSelector } from "react-redux"
import { AppState } from "store"
import useParams from "utils/Params"
import useToast from "utils/Toast"
import { IPrayerRequest } from "core/models/Prayer"
import { MessageType } from "core/enums/MessageType"
import { Testimony } from "core/enums/Testimony"
import { ITestimony, ICommentTestimony } from "core/models/Testimony"
import { loadChurchPrayer, loadChurchPrayerRequest, createNewPrayerRequest, addUserToHasPrayed } from "store/Prayer/actions"
import axios from "axios"


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
            borderBottom: "0 !important",
            fontFamily: "MulishBold"
        }
    },
    prayerContainer: {
        width: "100%",
        maxWidth: "27rem",
        // marginTop: "3rem !important",
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
    request: string;
}

interface IAddPrayerRequest {
    handleClose:() => void
}

const AddPrayerRequest: React.FC<IAddPrayerRequest> = ({handleClose}) => {
    const toast = useToast()
    const dispatch = useDispatch()
    const params = useParams()
    const currentUser = useSelector((state: AppState) => state.system.currentUser)
    const initialValues = {
        title: "",
        request: ""
    }
    const submitAddPrayerForm = (values: IAddPrayerRequestForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const createdAt =  (new Date()).toJSON();
        const newPrayer: IPrayerRequest = {
            churchID: Number(params.churchId),
            createdAt,
            personID: currentUser.id,
            prayerDetail: values.request,
            prayerTitle: values.title,
            fullName: currentUser.fullname,
            pictureUrl: currentUser.picture_url,

        }
        dispatch(createNewPrayerRequest(newPrayer, toast))
        actions.setSubmitting(false)
        actions.resetForm()
        handleClose()
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
    addTestimonyComment(arg: ITestimony): void;
    testimony: ITestimony
}
interface IAddTestimonyCommentForm {
    comment: string
}
const AddTestimonyComment: React.FC<IAddTestimonyComment> = ({ addTestimonyComment, testimony }) => {
    const toast = useToast()
    const params = useParams()
    const currentUser = useSelector((state: AppState) => state.system.currentUser)
    const initialValues = {
        comment: ""
    }
    const submitAddCommentToTestimony = (values: IAddTestimonyCommentForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const newTestimonyComment: ICommentTestimony = {
            comment: values.comment,
            personId: currentUser.id,
            testimonyId: testimony.testimonyID as number
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
                {`Add Comment to ${testimony.testimonyTitle}`}
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
                                    isLoading={formikProps.isSubmitting} loadingText={`Adding Comment to ${testimony.testimonyTitle}`}
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
            churchID: Number(params.churchId),
            dateEntered: new Date(),
            personID: currentUser.id,
            testimonyDetail: values.testimony,
            testimonyTitle: values.title
        }
        addTestimonyChurch(newTestimony).then(payload => {
            toast({
                title: "Added Testimony",
                subtitle: "",
                messageType: "success"
            })
            addTestimony(payload.data)
        }).catch(err => {
            actions.setSubmitting(false)
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
    const defaultTestimony: ITestimony = {
        churchID: 0,
        dateEntered: new Date(),
        personID: "",
        testimonyDetail: "",
        testimonyTitle: ""
    }
    const classes = useStyles()
    const toast = useToast()
    const params = useParams()
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false)
    const [tabIndex, setTabIndex] = React.useState(0)
    const prayerRequest = useSelector((state: AppState) => state.prayer.prayerRequest)
    const churchPrayer = useSelector((state: AppState) => state.prayer.churchPrayer)
    const currentChurch = useSelector((state: AppState) => state.system.currentChurch)
    const currentUser = useSelector((state: AppState) => state.system.currentUser)
    const [currentTestimony, setCurrentTestimony] = React.useState<ITestimony>(defaultTestimony)
    const [justRendered, setJustRendered] = React.useState(false)
    const [showPrayerForm, setShowPrayerForm] = React.useState(false)
    const [showCommentTestimony, setShowCommentTestimony] = React.useState(false)
    const selected = { color: "primary" }
    const [churchTestimony, setChurchTestimony] = React.useState<ITestimony[]>(new Array(10).fill(defaultTestimony))
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    const dateMonth = new Intl.DateTimeFormat('en-US', options).format(new Date())

    const addToPrayerRequest = (newPrayerRequest: IPrayerRequest) => {
        // setMemberPrayerRequest([...memberPrayerRequest, newPrayerRequest])
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
    const handleTabIndex = (index: number) => {
        setTabIndex(index)
    }
    React.useEffect(() => {
        if (justRendered) {
            if ('URLSearchParams' in window) {
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.set("tabs", String(tabIndex));
                const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                window.history.pushState(null, '', newRelativePathQuery);
                // window.location.search = searchParams.toString();
            }
        }
    }, [tabIndex])
    React.useEffect(() => {
        const source = axios.CancelToken.source()
        const urlParams = new URLSearchParams(window.location.search);
        const tabs = urlParams.get('tabs');
        if ((Number(tabs) > -1) && (3 > Number(tabs))) {
            setTabIndex(Number(tabs))
        }
        setJustRendered(true)
        const token = axios.CancelToken.source()
        dispatch(loadChurchPrayer({
            cancelToken: source,
            churchId: params.churchId as any,
            toast
        }))
        dispatch(loadChurchPrayerRequest({
            cancelToken: source,
            churchId: params.churchId as any,
            toast
        }))
        const getChurchTestimony = async () => {
            getTestimony({ churchId: Number(params.churchId), testimonyType: Testimony.GENERAL }, token).then(payload => {
                setChurchTestimony(payload.data)
            }).catch(err => {
                if (!axios.isCancel(err)) {
                    toast({
                        title: "Unable to Get Church Testimony",
                        subtitle: `Error:${err}`,
                        messageType: MessageType.ERROR
                    })
                }
            })
        }
        getChurchTestimony()
        return () => {
            token.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addToPrayed = (prayerId: number) => () => {
        prayerForPrayerRequest(prayerId, currentUser.id).then(payload => {
            toast({
                title: `Added ${currentUser.fullname} to list of prayed`,
                subtitle: "",
                messageType: MessageType.SUCCESS
            })
        }).catch(err => {
            toast({
                title: "Unable to get User list of prayed",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }
    const addToTestimonyComment = (arg: ITestimony) => {
        handleDialog()
        const newTestimony = [...churchTestimony]
        const testimonyId = churchTestimony.findIndex(item => item.testimonyID === arg.testimonyID)
        newTestimony.splice(testimonyId, 1, arg)
        setChurchTestimony([...newTestimony])
    }
    const handleTestimonyCommentForm = (arg: ITestimony) => () => {
        setShowCommentTestimony(true)
        setShowPrayerForm(false)
        setCurrentTestimony(arg)
        handleDialog()
    }

    const addChurchMemberToPrayed = (prayerId:number) => () => {
        dispatch(addUserToHasPrayed({
            toast,
            prayerId
        }))
    }

    return (
        <>
            <VStack className={classes.root}>
                <Tabs align="center" index={tabIndex} onChange={handleTabIndex} >
                    <TabList className={classes.tabsContainer}>
                        <Tab color="tertiary" _selected={selected} >Prayer Requests</Tab>
                        <Tab color="tertiary" _selected={selected}>Testimonies</Tab>
                        <Tab color="tertiary" _selected={selected}>Church Prayers</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Button my={5} onClick={handlePrayerForm}>
                                Add Prayer Request
                        </Button>
                            <VStack spacing={4} width="100%"
                                className={classes.prayerContainer}>
                                {prayerRequest.map((item, idx) => (
                                    <DetailCard key={item.prayerRequestID} isLoaded={Boolean(item.prayerRequestID)}
                                        title={item.prayerTitle}
                                        subtitle={""}
                                        timing={new Date(item.createdAt)}
                                        image="https://bit.ly/ryan-florence"
                                        body={item.prayerDetail}
                                    >
                                        <HStack width="100%" justify="space-between">
                                            {item.prayedPrayerRequests?.length &&
                                                <>
                                                    <AvatarGroup size="sm" max={5}>
                                                        {item.prayedPrayerRequests.map((item) => (
                                                            <Avatar name={item.fullName} src={item.pictureUrl} />
                                                        ))}
                                                    </AvatarGroup>
                                                    <Text mr="auto">
                                                        <Text as="b">{`${item.prayedPrayerRequests.length} ${item.prayedPrayerRequests.length === 1 ? "Person has" : "People"}`}</Text> Prayed
                                                    </Text>
                                                </>
                                            }
                                            <Icon ml="auto" boxSize="1rem" cursor="pointer" display={item.hasPrayed ? "none" :"initial"}
                                                onClick={addChurchMemberToPrayed(item.prayerRequestID as number)} as={FaPrayingHands} />
                                        </HStack>
                                    </DetailCard>
                                ))}
                            </VStack>
                        </TabPanel>
                        <TabPanel>
                            <Button my={5} onClick={handleTestimonyForm}>
                                Add a Testimony
                            </Button>
                            <VStack spacing={4} width="100%"
                                className={classes.prayerContainer}>
                                {churchTestimony.map((item, idx) => (
                                    <DetailCard isLoaded={Boolean(item.testimonyID)}
                                        title={item.testimonyTitle} key={idx} subtitle="Prayer For Help"
                                        image="https://bit.ly/ryan-florence"
                                        body={item.testimonyDetail}
                                    >
                                        <HStack width="100%" justify="space-between">
                                            <IconButton bgColor="transparent" onClick={handleTestimonyCommentForm(item)} aria-label="add comment to Testimony" icon={
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
                                <Heading p={0} as="h6" color="primary" size="1rem" textAlign="left"
                                    alignSelf="flex-start" bgColor="transparent"
                                >
                                    {`${dateMonth} Daily Fasting & Prayer`}
                                </Heading>
                                {churchPrayer.map((item, idx) => (
                                    <DetailCard isLoaded={Boolean(item.prayerID)} title={item.prayerName}
                                        key={idx} subtitle=""
                                        image={currentChurch.churchLogo}
                                        body={item.prayerDetail}
                                    >
                                    </DetailCard>
                                ))}
                            </VStack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </VStack>
            <Dialog open={open} close={handleDialog} size="xl" >
                {showPrayerForm ? <AddPrayerRequest handleClose={handleDialog} /> :
                    showCommentTestimony ? <AddTestimonyComment addTestimonyComment={addToTestimonyComment} testimony={currentTestimony} /> : <AddTestimony addTestimony={addToTestimony} />}
            </Dialog>
        </>
    )
}

export default PrayerWall