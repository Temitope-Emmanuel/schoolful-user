import React from "react"
import {
    Box, Flex,Heading, Text, Skeleton, SimpleGrid,
    AspectRatio, Image, VStack, ModalFooter,Avatar,
    ModalHeader, ModalBody, ModalContent,Stack,IconButton,
    ModalCloseButton, HStack, Icon
} from "@chakra-ui/react"
import { Button } from "components/Button"
import {BsCardImage} from "react-icons/bs"
// eslint-disable-next-line
import { Formik, FormikProps } from "formik"
import {Fade} from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Dialog } from "components/Dialog"
import { Link } from "components/Link"
import { TextInput, Select,DatePicker,SearchInput } from "components/Input"
import * as Yup from "yup"
import {MainLoginLayout} from "layouts/MainLoginLayout"
import { IChurchMember } from 'core/models/ChurchMember'
import { IDenomination } from "core/models/Denomination"
import { IState } from "core/models/Location"
import { IChurch } from "core/models/Church"
import useToast from "utils/Toast"
import * as churchService from "core/services/church.service"
import { getState } from "core/services/utility.service"
import * as accountService from "core/services/account.service"
import { MessageType } from 'core/enums/MessageType'
import { BsCheckCircle } from "react-icons/bs"
import { AiFillCheckCircle} from "react-icons/ai"
import {BiLeftArrowCircle} from "react-icons/bi"
import {buttonBackground} from "theme/chakraTheme/palette"
import {ChurchImage} from "assets/images"
import {login} from "store/System/actions"
import {useDispatch} from "react-redux"




const useStyles = makeStyles(theme => createStyles({
    root: {
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "column",
        marginTop:"1.9rem",
        "& > *:first-child": {
            marginTop: "0 !important"
        }
    },
    inputContainer: {
        maxHeight: "35rem",
        minHeight: "24rem",
        overflowY: "auto",
        "& > div": {
            "& > p": {
                fontSize: "1rem",
                margin: "1rem 0"
            }
        }
    },
    searchInput: {
        width:"100%",
        [theme.breakpoints.up("sm")]:{
            width:"45vw",
        }
    },
    birthdayContainer: {
        maxWidth: "25rem"
    },
    imageContainer: {
        border: "1px dashed rgba(0, 0, 0, .5)",
        borderRadius: "4px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // [theme.breakpoints.up("sm")]:{
            width: "17.5vh",
            height: "17.5vh",
        // },
        "& svg": {
            color: "#151C4D",
        },
        "& h4,p": {
            color: "#151C4D",
            whiteSpace: "nowrap"
        }
    },
    input: {
        display: "none"
    }
}))

interface IForm {
    firstname: string;
    lastname: string;
    username:string;
    genderID: number;
    denominationId: number;
    state: number;
    churchId: number;
    email: string;
    password: string;
    birthday: Date;
    phoneNumber: number | null;
    confirmPassword: string;
}

const churchStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        minHeight: "10rem",
        boxShadow:"0px 3px 6px #0000000D",
        borderRadius:"4px"
    }
}))

interface IChurchView {
    churchName: string;
    address: string;
    image: string | undefined;
}

const ChurchView: React.FC<IChurchView> = ({ churchName, address, image }) => {
    const classes = churchStyles()
    return (
        <Box maxW={{ sm: "17rem" }} className={classes.root}>
            <AspectRatio ratio={1.85 / 1} >
                <Image src={image || ChurchImage} />
            </AspectRatio>
            <Box>
                <Text as="h6" color="tertiary">
                    {churchName}
                </Text>
                <Text color="tertiary" opacity={.7}>
                    {address || ""}
                </Text>
            </Box>
        </Box>
    )
}

interface IShowChurchDetail {
    name: string;
    value: string | number;
}

const ShowDetail: React.FC<IShowChurchDetail> = ({ name, value }) => (
    <VStack align={["center", "flex-start"]} mb="5" >
        <Text>
            {name}
        </Text>
        <Text as="b" >
            {value}
        </Text>
    </VStack>
)

interface IVerifyChurchDialog {
    church: IChurch;
    handleClose: any;
    handleConfirmation: any
}

const VerifyChurchDialog: React.FC<IVerifyChurchDialog> = ({ handleClose, handleConfirmation, church: {
    name, countryID, denominationId,
    address, stateName,
} }) => {
    const handleConfirmationClose = () => {
        handleConfirmation()
        handleClose()
    }
    return (
        <ModalContent p="12" display="flex" justifyContent="center"
            alignItems="center" flexDirection="column" >
            <ModalHeader color="primary" textAlign="center" >
                Please confirm, is this your church ?
            </ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)" onClick={handleClose}
                outline="none" borderRadius="50%" opacity={.5} />
            <ModalBody display="flex" width="100%" flexDirection={["column", "row"]} maxW="45rem"
                alignItems={["center", "flex-start"]} justifyContent="space-around">
                <VStack align={["center", "flex-start"]}>
                    <ShowDetail
                        name="Church Name"
                        value={name}
                    />
                    <ShowDetail
                        name="Denomination"
                        value={denominationId}
                    />
                    <ShowDetail
                        name="Church Address"
                        value={address}
                    />
                    <ShowDetail
                        name="Closest Landmark"
                        value="Bismark"
                    />
                    <ShowDetail
                        name="State"
                        value="Lagos"
                    />
                </VStack>
                <VStack align={["center", "flex-start"]}>
                    <ShowDetail
                        name="Country"
                        value={countryID}
                    />
                    <ShowDetail
                        name="Head Pastor"
                        value="Pastor Chike, Obi"
                    />
                    <ShowDetail
                        name="Church Email"
                        value="faithfulschurch@gmail.com"
                    />
                    <ShowDetail
                        name="Church Motto"
                        value="Build Jesus Communities"
                    />
                </VStack>
            </ModalBody>
            <ModalFooter display="flex" flexDirection="column"
                alignItems="center" >
                <Flex width="98%" flexDirection={["column", "row"]}
                    justify="center">
                    <Button mb={["2", "auto"]} onClick={handleConfirmationClose}
                        px="18" mr={{ sm: 4 }}>
                        Yes, this is my church
                    </Button>
                    <Button px="18" variant="outline" onClick={handleClose} >
                        No,keep searching
                    </Button>
                </Flex>
            </ModalFooter>
        </ModalContent>
    )
}

interface IProps {
    churchDetail:IChurch
}
const ShowSuccess:React.FC<IProps> = () => {
    return(
        <ModalContent>
            <ModalBody my="10" >
                <VStack>
                    <Icon as={BsCheckCircle} color="primary" boxSize="5rem" />
                    <Text maxW="2xs" textAlign="center" fontWeight="600" >
                        Sign up completed successfully
                    </Text>
                </VStack>
            </ModalBody>
        </ModalContent>
    )
}

const GoBack = ({func}:any) => (
    <IconButton aria-label="go-back" color="primary" bgColor="transparent" onClick={func}
        as={BiLeftArrowCircle} />
)


const Signup = () => {
    const defaultChurch: IChurch = {
        name: "",
        countryID: 0,
        stateID: 0,
        cityID: 0,
        denominationId: 0,
        churchStatus: "",
        address: ""
    }
    const [currentChurch, setCurrentChurch] = React.useState<IChurch>(defaultChurch)
    const [churchSelect, setChurchSelect] = React.useState<IChurch[]>(new Array(10).fill(defaultChurch))
    const [showChurchSelect,setShowChurchSelect] = React.useState<IChurch[]>([])
    const currentDate = new Date()
    const dispatch = useDispatch()
    const minDate = new Date()
    minDate.setFullYear(1900,0,0,)
    currentDate.setFullYear(2000,0,0)
    const [denomination, setDenomination] = React.useState<IDenomination[]>([])
    const [showBirthday, setShowBirthday] = React.useState(false)
    const [inputValue,setInputValue] = React.useState("")
    const [showSuccess, setShowSuccess] = React.useState(false)
    const [showDialog, setShowDialog] = React.useState(false)
    const [state, setState] = React.useState<IState[]>([])
    const [open, setOpen] = React.useState(true)
    const [image, setImage] = React.useState({
        name: "",
        base64: ""
    })
    const classes = useStyles()
    const toast = useToast()
    // const [churchSelect,setChurchSelect] = React.useState<IChurch[]>((ChurchDetail.data as any))

    React.useEffect(() => {
        const getStateLocation = async () => {
            await getState(160).then(payload => {
                setState([...state, ...payload.data])
            }).catch(err => {
                toast({
                    title: "Unable to get State List",
                    subtitle: `Error:${err}`,
                    messageType: MessageType.ERROR
                })
            })
        }

        const getDenomination = async () => {
            try {
                await churchService.getChurchDenomination().then(payload => {
                    setDenomination([...denomination, ...payload.data])
                })
            } catch (err) {
                toast({
                    title: "Unable to get Church Denomination",
                    subtitle: `Error:${err}`,
                    messageType: MessageType.WARNING
                })
            }
        }

        getStateLocation()
        getDenomination()
        return () => {
            setShowDialog(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        const testString = new RegExp(inputValue,"i")
        const newChurchSelect = churchSelect.filter((item) => testString.test(item.name))
        setShowChurchSelect([...newChurchSelect])
    },[inputValue])

    const handleInputChange = (e:React.SyntheticEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value)
    }

    const initialValues = {
        firstname: "",
        lastname: "",
        username:"",
        genderID: 0,
        denominationId: 0,
        state: 0,
        churchId: 0,
        email: "",
        password: "",
        birthday: currentDate,
        phoneNumber: null,
        confirmPassword: "",
    }
    const handleImageTransformation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                setImage({ ...image, base64: (reader.result as string), name: file.name })
            }
            reader.readAsDataURL(file)
        }
    }

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid Email address").required(),
        firstname: Yup.string().min(3, "Name must be at 5 character")
            .max(15, "Name is too long").required(),
        lastname: Yup.string().min(1, "Name must be at 1 character")
            .max(15, "Name is too long").required(),
        password: Yup.string().min(5, "Password is too short").required(),
        genderID:Yup.string().oneOf(["1","2"],"Please Select Your gender Type").required(),
        churchId: Yup.string().required()
    })

    // Show the second part of the form
    const handleToggle = () => {
        setOpen(!open)
    }
    // Show the dialog 
    const handleDialogToggle = () => {
        setShowDialog(!showDialog)
    }
    // Set the current church selected
    const handleSetCurrentChurch = (church: IChurch) => () => {
        setCurrentChurch(church)
        handleDialogToggle()
    }
    // Show Success Dialog 
    const handleShowSuccess = () => {
        setShowSuccess(true)
        setShowDialog(true)
    }
    // Show the birthday form and clears the current church
    const showBirthdayForm = () => {
        setCurrentChurch(defaultChurch)
        setShowBirthday(!showBirthday)
    }
    const getChurch = async (denominationId: number, stateId: number) => {
        churchService.getChurchByDenomination(denominationId, stateId).then(payload => {
            setChurchSelect(payload.data)
            setShowChurchSelect([...payload.data])
        }).catch(err => {
            toast({
                title: "Unable to get Church List",
                subtitle: `Error: ${err}`,
                messageType: MessageType.ERROR
            })
        })
    }

    const handleSubmit = async (values: IForm, actions: any) => {
        if (values.password !== values.confirmPassword) {
            actions.setErrors({
                confirmPassword: "Password do not match",
                password: "Password do not match"
            })
        } else {
            if (!showBirthday) {
                getChurch(values.denominationId, values.state)
                handleToggle()
            } else {
                actions.setSubmitting(true)
                const { firstname, password, phoneNumber, email,lastname,birthday } = values
                const newUser: IChurchMember = {
                    firstname,
                    lastname,
                    username:String(phoneNumber),
                    personTypeID: 1,
                    genderID:values.genderID,
                    email,
                    phoneNumber,
                    password,
                    role: "ChurchMember",
                    enteredBy: "ChurchMember",
                    ...(currentChurch.churchID && { churchId: currentChurch.churchID }),
                    isDataCapture: false,
                    dateOfBirth:birthday.toJSON(),
                    ...(image.base64 && { picture_url:image.base64}),
                    societies: [],
                    societyPosition: []
                }
                await accountService.createChurchMember(newUser).then(payload => {
                    handleShowSuccess()
                    dispatch(login(newUser.phoneNumber as number,newUser.password,toast))
                    toast({
                        title: "Success",
                        subtitle: "New User Created",
                        messageType: MessageType.SUCCESS
                    })
                }).catch(err => {
                    actions.setSubmitting(false)
                    toast({
                        title: "Something went Wrong",
                        subtitle: `Error:${err}`,
                        messageType: MessageType.ERROR
                    })
                    handleToggle()
                    setShowBirthday(false)
                    actions.setSubmittiong(false)
                })
            }
        }

    }
    const handleBirthdayToggle = () => {
        setShowBirthday(!showBirthday)
    }

    
    return (
        <>
            <MainLoginLayout showLogo={true}>
                <Flex className={classes.root} px={{ sm: "3" }}
                    alignItems={["center", "flex-start"]}
                    mx="auto" flex={[1, 3]} >
                    <Heading textStyle="h3" my={["2", 5]} >
                        Sign Up
                </Heading>
                    <Text textStyle="h6" textAlign={["center", "left"]} maxWidth="sm" mt={["3"]}>
                        Register as a church member by providing your details
                </Text>
                    <Formik initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {(formikProps: FormikProps<IForm>) => {
                            const onChange = (e: Date | any) => {
                                formikProps.setValues({ ...formikProps.values, birthday: e })
                            }
                            return (
                                <Box width={["90vw", "100%"]} className={classes.inputContainer}
                                    px="1" mx={["auto", "initial"]} maxWidth={open ? "sm" : ""} >
                                    {
                                        showBirthday ?
                                            <VStack className={classes.birthdayContainer}>
                                                <Heading textStyle="h5">
                                                    Let's know your Birthday
                                                </Heading>
                                                <DatePicker value={formikProps.values.birthday}
                                                    onChange={(onChange as any)} minDate={minDate} name="birthday"
                                                />
                                                <HStack w="100%">
                                                <GoBack func={handleBirthdayToggle} />
                                                {
                                                    currentChurch.churchID &&
                                                    <HStack width="100%" ml={3} my="auto">
                                                        <Image maxW="5rem"
                                                         src={currentChurch.churchLogo || ChurchImage} />
                                                        <VStack mr="auto" align="flex-start" >
                                                            <Text as="b">
                                                                {currentChurch.name}
                                                            </Text>
                                                            <Text opacity={.7} >
                                                                {currentChurch.address}
                                                            </Text>
                                                        </VStack>
                                                        <Icon color="primary" boxSize="2rem" as={AiFillCheckCircle} />
                                                    </HStack>
                                                }
                                                </HStack>
                                                <Stack direction={{ base: "column-reverse", md: "row" }} align="center" >
                                                    <Flex className={classes.imageContainer} p={5} >
                                                        <input accept="image/jpeg,image/png" onChange={handleImageTransformation} type="file"
                                                            className={classes.input} id="icon-button-file" />
                                                        <label htmlFor="icon-button-file">
                                                            <IconButton as="span" padding={[2,4]} boxSize={["2.5rem","5rem"]} aria-label="submit image"
                                                                borderRadius="50%" bgColor={buttonBackground}
                                                                icon={<BsCardImage fontSize="2rem" />} />
                                                        </label>
                                                        <Heading as="h4" mt={2} fontSize="1.125rem" >Profile Image</Heading>
                                                        {
                                                            image.name ?
                                                                <Text fontSize="0.68rem" opacity={.5} isTruncated maxW="2xs" >{image.name}</Text> :
                                                                <Text fontSize="0.68rem" opacity={.5}>Dimension 200px by 400px</Text>
                                                        }
                                                    </Flex>
                                                    {image.base64 &&
                                                        <Avatar size="2xl" src={image.base64} />
                                                    }
                                                </Stack>
                                                <Button width="100%" disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                                    isLoading={formikProps.isSubmitting}
                                                    loadingText={`Creating new Church Member ${formikProps.values.firstname}`}
                                                    onClick={(formikProps.handleSubmit as any)} >
                                                    Next
                                                </Button>
                                            </VStack> :
                                            open ?
                                                <Fade timeout={150} in={open}>
                                                        <Box maxWidth="sm">
                                                            <TextInput name="firstname" placeholder="Input your First Name" />
                                                            <TextInput name="lastname" placeholder="Input Your Last Name" />
                                                            <TextInput name="email" placeholder="email" />
                                                            <TextInput name="phoneNumber" placeholder="Phone Number" />
                                                            <Select name="genderID" placeholder="gender" value={formikProps.values.genderID} >
                                                                {["male", "female"].map((item, idx) => (
                                                                    <option key={idx} value={idx+1} >
                                                                        {item}
                                                                    </option>
                                                                ))}
                                                            </Select>
                                                            <Select name="denominationId" placeholder="Select Denomination">
                                                                {denomination.map((item, idx) => (
                                                                    <option key={idx} value={item.denominationID}>
                                                                        {item.denominationName}
                                                                    </option>
                                                                ))}
                                                            </Select>
                                                            <Select name="state" placeholder="Select Church State">
                                                                {state.map((item, idx) => (
                                                                    <option key={idx} value={item.stateID}>
                                                                        {item.name}
                                                                    </option>
                                                                ))}
                                                            </Select>
                                                            <TextInput name="password"
                                                                type="password" placeholder="Password" />
                                                            <TextInput name="confirmPassword"
                                                                type="password" placeholder="Confirm Password" />
                                                            <Text textStyle="h6">
                                                                By signing up you accept the &nbsp;
                                                    <Link to="/" >
                                                                    Terms of Service
                                                    </Link>
                                                    &nbsp;and&nbsp;
                                                    <Link to="/" >
                                                        Privacy Policy
                                                    </Link>
                                                        </Text>
                                                            <Button disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                                                onClick={(formikProps.handleSubmit as any)} width={["90vw", "100%"]}
                                                                my="6">
                                                                {formikProps.isValid ? "Next" : "Please Complete Form"}
                                                            </Button>
                                                        </Box>
                                                    
                                                </Fade>
                                                :
                                                <Fade timeout={150} in={!open}>
                                                    <Box >
                                                            <Text>
                                                                If you can't find your church&nbsp;
                                                                <Text as="b" onClick={showBirthdayForm} >
                                                                        Click Here
                                                                </Text>
                                                            </Text>
                                                            <HStack my={6}>
                                                                <GoBack func={handleToggle} />
                                                                <SearchInput className={classes.input}
                                                                 value={inputValue} width={["100%","50%"]}
                                                                  setValue={handleInputChange} />
                                                            </HStack>
                                                            <SimpleGrid minChildWidth="12.5rem" gridGap=".5rem"
                                                                spacing="40px">
                                                                {showChurchSelect.length > 0 ? 
                                                            showChurchSelect.map((item, idx) => (
                                                                <Skeleton onClick={handleSetCurrentChurch(item)} key={idx}
                                                                    isLoaded={Boolean(item.churchID)} cursor="pointer" >
                                                                    <ChurchView churchName={item.name}
                                                                        address={item.address} image={item.churchLogo}
                                                                    />
                                                                </Skeleton>
                                                            )) : 
                                                            <Text>
                                                                Church Does Not Exist
                                                            </Text>    
                                                            }
                                                            </SimpleGrid>
                                                        </Box>
                                                </Fade>
                                    }
                                </Box>
                            )
                        }}
                    </Formik>
                    <Text textStyle="h6" >Already have an account? &nbsp;
                        <Link to="/login">
                            Login here
                        </Link>
                    </Text>
                </Flex>
            </MainLoginLayout>
            <Dialog open={showDialog} size={showSuccess ? "sm" : "full"}
                close={handleDialogToggle}>
                {showSuccess ?
                    <ShowSuccess churchDetail={currentChurch} /> :
                    <VerifyChurchDialog handleClose={handleDialogToggle} handleConfirmation={handleBirthdayToggle}
                        church={(currentChurch || defaultChurch)} />
                }
            </Dialog>
        </>
    )
}

export default Signup