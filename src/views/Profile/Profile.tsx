import React from "react"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import {
    VStack, Avatar, AvatarBadge, HStack,
    Icon, StackDivider
} from "@chakra-ui/react"
import { AiFillCamera } from "react-icons/ai"
import { Button } from "components/Button"
import { FaUserAlt, FaChurch, FaBirthdayCake } from "react-icons/fa"
import { HiPhone } from "react-icons/hi"
import { MdEmail, MdModeEdit } from "react-icons/md"
import { IoMdExit } from "react-icons/io"
import { IconInput } from "components/Input"
import { Formik, FormikProps } from "formik"
import * as Yup from "yup"
import * as authManager from "utils/auth"
import useToast from "utils/Toast"
import { getUserChurchInfo, updateChurchMember } from "core/services/account.service"
import { useSelector, useDispatch } from "react-redux"
import { AppState } from "store"
import { IChurchMember } from "core/models/ChurchMember"
import { IChurch } from "core/models/Church"
import { DatePicker } from 'components/Input'
import { Dialog } from "components/Dialog"
import {SearchChurch} from "components/Header/FindChurch"
import { setCurrentUser } from "store/System/actions"
import { useHistory } from "react-router"
import useParams from "utils/Params"
import { useImageState } from "utils/useImageState"

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        flex: 6,
    },
    formContainer: {
        width: "90vw",
        maxWidth: "30rem",
        marginBottom: "2rem",
        [theme.breakpoints.up("sm")]: {
            width: "75%"
        }
    },
    dateContainer: {
        width: "100%",
        "& > *:nth-child(2)": {
            width: "100%"
        }
    },
    input: {
        display: "none",
        width:"100%"
    },
    label: {
        display: "flex"
    }
}))

interface IProfileDetail extends IChurchMember {
    church: IChurch
}
interface IProfileForm {
    church: string;
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    dateOfbirth: Date;
}

const Profile = () => {
    const defaultChurch: IChurch = {
        address: "",
        cityName: "",
        denomination: "",
        name: "",
        stateName: ""
    }
    const defaultProfileDetail: IProfileDetail = {
        church: defaultChurch,
        email: "",
        username: "",
        phoneNumber: 0,
        firstname: "",
        lastname: "",
        password: "",
        dateOfBirth: new Date(),
        genderID: 0,
        stateName: '',
        role: 'ChurchMember'
    }
    const classes = useStyles()
    const params = useParams()
    const [currentUserChurch,setCurrentChurch] = React.useState<IChurch>()
    const [open, setOpen] = React.useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const {handleImageTransformation,image,resetImage} = useImageState()

    const currentUser = useSelector((state: AppState) => state.system.currentUser)
    const currentChurch = useSelector((state: AppState) => state.system.currentChurch)
    const [submitting, setSubmitting] = React.useState(true)
    const toast = useToast()
    const [profile, setProfile] = React.useState(defaultProfileDetail)


    React.useEffect(() => {
        const getUserProfile = async () => {
            getUserChurchInfo(currentUser.id).then(payload => {
                const newProfileDetail = {
                    ...payload.data[0],
                    dateOfBirth: payload.data[0].dateOfbirth
                }
                setProfile(newProfileDetail)
                setSubmitting(false)
            }).catch(err => {
                toast({
                    title: "Unable to Get User Detail",
                    subtitle: `Error: ${err}`,
                    messageType: "error"
                })
            })
        }
        getUserProfile()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    React.useEffect(() => {
        if(currentChurch.churchID){
            setCurrentChurch({
                ...currentChurch
            })
        }
    },[currentChurch])

    const initialValues = {
        ...profile,
        church: profile.church.name,
        dateOfbirth: new Date(profile.dateOfBirth!) || new Date(2000, 0, 0)
    }

    const FormValidation = () => (
        Yup.object({
            email: Yup.string().email().required(),
            church: Yup.string().required()
        })
    )

    const handleToggle = () => {
        setOpen(!open)
    }
    const handleSubmit = async (values: IProfileForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const { role, ...newProfile } = profile
        const updateChurchMemberDetail = {
            ...newProfile,
            ...values,
            imageUrl: image.base64 || profile.picture_url,
            churchID:currentChurch.churchID,
            churchMemberID: currentUser.churchMemberID,
            personId: currentUser.personId,
            ...(image.base64 && { picture_url: image.base64 })
        }

        updateChurchMember((updateChurchMemberDetail as any)).then(payload => {
            actions.setSubmitting(false)
            const savedUserDetail = JSON.parse(authManager.getUserDetail() as string)
            dispatch(
                setCurrentUser({
                    ...savedUserDetail,
                    churchId:currentChurch.churchID as number
                },toast)
            )
            toast({
                title: "User detail Updated",
                subtitle: "",
                messageType: "success"
            })
            history.push(`/church/${params.churchId}/home`)
            resetImage()
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title: "Unable to Update User Detail",
                subtitle: `Error: ${err}`,
                messageType: "error"
            })
        })
    }


    return (
        <>
            <Dialog open={open} close={handleToggle}>
                <SearchChurch handleClose={handleToggle} />
            </Dialog>
            <VStack className={classes.root}>
                <VStack spacing={10}>
                    <Avatar size="2xl" name="Christian Nwamba" src={image.base64 || currentUser.picture_url}>
                        <AvatarBadge bottom="20px" boxSize=".9em" borderColor="primary" bg="primary">
                            <input accept="image/jpeg,image/png" onChange={handleImageTransformation} type="file"
                                className={classes.input} id="icon-button-file" />
                            <label htmlFor="icon-button-file" className={classes.label}>
                                <Icon cursor="pointer" as={AiFillCamera} padding=".75rem" color="white" />
                            </label>
                        </AvatarBadge>
                    </Avatar>
                    <Button onClick={handleToggle}>
                        Switch Church
                    </Button>
                </VStack>
                {
                    !submitting &&
                    <Formik validationSchema={FormValidation}
                        initialValues={initialValues} onSubmit={handleSubmit}
                    >
                        {(formikProps: FormikProps<IProfileForm>) => {
                            const onChange = (name: string) => (e: Date | Date[]) => {
                                formikProps.setValues({ ...formikProps.values, [name]: e })
                            }

                            return (
                                <VStack className={classes.formContainer}>
                                    <IconInput name="firstname" placeholder="Temitope Ojo" label="Firstname"
                                        primaryIcon={FaUserAlt}
                                    />
                                    <IconInput name="lastname" placeholder="Temitope Ojo" label="Lastname"
                                        primaryIcon={FaUserAlt}
                                    />
                                    <IconInput name="church" placeholder="St Mulumba New Haven" label="Church"
                                        primaryIcon={FaChurch}
                                    />
                                    <VStack width={["95%", "90%"]} alignSelf="flex-end"
                                        align="flex-end"
                                        divider={<StackDivider my={10} borderColor="gray.200" />}>
                                        <VStack>
                                            <HStack className={classes.dateContainer}>
                                                <Icon as={FaBirthdayCake} />
                                                <DatePicker name="dateOfbirth" value={formikProps.values.dateOfbirth}
                                                    onChange={onChange("dateOfbirth")}
                                                />
                                                <Icon as={MdModeEdit} boxSize={"2rem"} />
                                            </HStack>
                                            <IconInput name="email" placeholder="temitope@gmail.com" label="Email"
                                                primaryIcon={MdEmail}
                                            />
                                            <IconInput name="phoneNumber" placeholder="+234900000000" label="Phone"
                                                primaryIcon={HiPhone}
                                            />
                                        </VStack>
                                        <VStack>
                                            <HStack my={7} alignSelf="flex-start">
                                                <Button onClick={(formikProps.handleSubmit as any)}
                                                    isLoading={formikProps.isSubmitting} loadingText={`Updating User ${formikProps.values.firstname}`}
                                                    disabled={formikProps.isSubmitting || !formikProps.isValid}
                                                >
                                                    Submit
                                                </Button>
                                            </HStack>
                                            <IconInput name="member" placeholder="Member" label="Choir Group"
                                                secondaryIcon={IoMdExit}
                                            />
                                            <IconInput name="department" placeholder="Head of Department" label="Prayer Department"
                                                secondaryIcon={IoMdExit}
                                            />
                                        </VStack>
                                    </VStack>
                                </VStack>
                            )
                        }}
                    </Formik>

                }
            </VStack>

        </>
    )
}

export default Profile