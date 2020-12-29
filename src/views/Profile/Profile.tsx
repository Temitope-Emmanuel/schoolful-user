import React from "react"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { 
    VStack, Avatar, AvatarBadge,HStack,
    Icon,Text,StackDivider
 } from "@chakra-ui/react"
import { AiFillCamera } from "react-icons/ai"
import { Button } from "components/Button"
import { FaUserAlt,FaChurch,FaBirthdayCake} from "react-icons/fa"
import { HiPhone } from "react-icons/hi"
import { MdEmail, MdModeEdit} from "react-icons/md"
import { IoMdExit } from "react-icons/io"
import {IconInput} from "components/Input"
import {Formik,FormikProps} from "formik"
import * as Yup from "yup"
import useToast from "utils/Toast"
import {getUserChurchInfo} from "core/services/account.service"
import {updateChurchMember} from "core/services/userSetting.service"
import {useSelector,useDispatch} from "react-redux"
import {AppState} from "store"
import { IChurchMember } from "core/models/ChurchMember"
import { IChurch } from "core/models/Church"
import {DatePicker} from 'components/Input'


const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        flex:6,
    },
    formContainer: {
        width:"90vw",
        maxWidth:"30rem",
        marginBottom:"2rem",
        [theme.breakpoints.up("sm")]:{
            width:"75%"
        }
    },
    dateContainer:{
        width:"100%",
        "& > *:nth-child(2)":{
            width:"100%"
        }
    }
}))


interface IProfileDetail extends IChurchMember {
    church:IChurch
}
interface IProfileForm {
    church:string;
    email:string;
    firstname:string;
    lastname:string;
    password:string;
    dateOfbirth:Date;
}
const Profile = () => {
    const defaultChurch:IChurch = {
        address:"",
        cityID:0,
        countryID:0,
        denominationId:0,
        name:"",
        stateID:0
    }
    const defaultProfileDetail:IProfileDetail = {
        church:defaultChurch,
        email:"",
        username:"",
        phoneNumber:0,
        firstname:"",
        lastname:"",
        password:"",
        dateOfBirth:new Date()
    }
    const classes = useStyles()
    const dispatch = useDispatch()
    const currentUser = useSelector((state:AppState) => state.system.currentUser)
    const currentChurch = useSelector((state:AppState) => state.system.currentChurch)
    const [submitting,setSubmitting] = React.useState(true)
    const toast = useToast()
    const [profile,setProfile] = React.useState(defaultProfileDetail)


    React.useEffect(() => {
        const getUserProfile = async () => {
            getUserChurchInfo(currentUser.id).then(payload => {
                const newProfileDetail = {
                    ...payload.data[0],
                    dateOfBirth:payload.data[0].dateOfbirth
                }
                setProfile(newProfileDetail)
                setSubmitting(false)
            }).catch(err => {
                toast({
                    title:"Unable to Get User Detail",
                    subtitle:`Error: ${err}`,
                    messageType:"error"
                })
            })
        }
        getUserProfile()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const initialValues = {
        ...profile,
        church:profile.church.name,
        dateOfbirth:new Date(profile.dateOfBirth!) || new Date(2000,0,0)
    }
   
    const FormValidation = () => (
        Yup.object({
            email: Yup.string().email().required(),
            church: Yup.string().required()
        })
    )
    
    const handleSubmit = async (values:IProfileForm, {...actions}: any) => {
        actions.setSubmitting(true)
        const updateChurchMemberDetail = {
            ...profile,
            ...values
        }

        updateChurchMember((updateChurchMemberDetail as any)).then(payload => {
            actions.setSubmitting(false)
            toast({
                title:"User detail Updated",
                subtitle:"",
                messageType:"success"
            })
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title:"Unable to Update User Detail",
                subtitle:`Error: ${err}`,
                messageType:"error"
            })
        })
    }

    return (
        <VStack className={classes.root}>
            <VStack spacing={10}>
                <Avatar size="2xl" name="Christian Nwamba" src="https://bit.ly/code-beast">
                    <AvatarBadge bottom="20px" boxSize=".9em" borderColor="primary" bg="primary">
                        <Icon as={AiFillCamera} padding=".75rem" color="white" />
                    </AvatarBadge>
                </Avatar>
                <Button>
                    Switch Church
                </Button>
            </VStack>
            {
                !submitting &&
                <Formik validationSchema={FormValidation}
                initialValues={initialValues} onSubmit={handleSubmit}
            >
                {(formikProps:FormikProps<IProfileForm>) => {
                    const onChange = (name: string) => (e: Date | Date[]) => {
                        formikProps.setValues({ ...formikProps.values, [name]: e })
                    }

                    return(
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
                            <VStack width={["95%","90%"]} alignSelf="flex-end"
                                align="flex-end"
                                divider={<StackDivider my={10} borderColor="gray.200" />}>
                                <VStack>
                                    {/* <IconInput name="dateOfbirth" placeholder="2000-00-00" label="Birthday"
                                        children={<DatePicker name="deteofbirth" value={formikProps.values.dateofbirth}
                                         onChange={onChange("dateofbirth")}                    
                                        />}
                                        primaryIcon={FaBirthdayCake}
                                    /> */}
                                    <HStack className={classes.dateContainer}>
                                        <Icon as={FaBirthdayCake}/>
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
                                        <Text color="primary">
                                            Groups
                                        </Text>
                                        <Button onClick={(formikProps.handleSubmit as any)}
                                        isLoading={formikProps.isSubmitting} loadingText={`Updating User ${formikProps.values.firstname}`}
                                         disabled={ formikProps.isSubmitting || !formikProps.isValid}
                                        >
                                            Submit
                                        </Button>
                                        <Button>
                                            Join Group
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
    )
}

export default Profile