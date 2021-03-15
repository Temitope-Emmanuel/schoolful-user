import React from "react"
import {
    Box, Flex, Heading, Text, Skeleton, SimpleGrid,
    AspectRatio, Image, VStack, ModalFooter, Avatar,
    ModalHeader, ModalBody, ModalContent, IconButton,
    ModalCloseButton, HStack, Icon
} from "@chakra-ui/react"
import { Button } from "components/Button"
import { BsCardImage } from "react-icons/bs"
// eslint-disable-next-line
import { Formik, FormikProps } from "formik"
import { Fade } from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Dialog } from "components/Dialog"
import { Link } from "components/Link"
import { TextInput, Select, DatePicker, SearchInput,PasswordInput } from "components/Input"
import * as Yup from "yup"
import { MainLoginLayout } from "layouts/MainLoginLayout"
import { IChurchMember } from 'core/models/ChurchMember'
import {ICountry} from "core/models/Location"
import { IDenomination } from "core/models/Denomination"
import { IState } from "core/models/Location"
import { IChurch } from "core/models/Church"
import useToast from "utils/Toast"
import * as churchService from "core/services/church.service"
import { getState,getCountry } from "core/services/utility.service"
import * as accountService from "core/services/account.service"
import { MessageType } from 'core/enums/MessageType'
import { BsCheckCircle } from "react-icons/bs"
import { AiFillCheckCircle } from "react-icons/ai"
import { BiLeftArrowCircle } from "react-icons/bi"
import { buttonBackground } from "theme/chakraTheme/palette"
import { ChurchImage } from "assets/images"
import { login } from "store/System/actions"
import { useDispatch } from "react-redux"
import {primary} from "theme/chakraTheme/palette"



const useStyles = makeStyles(theme => createStyles({
    root: {
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor:"white",
        marginTop: "1.9rem",
        "& > *:first-child": {
            marginTop: "0 !important"
        },
        "& button": {
            fontFamily: "MulishRegular"
        },
        "& p":{
            color:"#383838",
            "& span":{
                textDecoration:'underline',
                color:primary
            }
        }
    },
    inputContainer: {
        minHeight: "24rem",
        marginRight: "0 !important",
        "& > div": {
            "& > p": {
                fontSize: "1rem",
                margin: "1rem 0"
            }
        }
    },
    searchInput: {
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "45vw",
        }
    },
    birthdayContainer: {
        maxWidth: "25rem",
        "& > div:nth-child(2)":{
            width:"100% !important"
        }
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
    username: string;
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
        boxShadow: "0px 3px 6px #0000000D",
        borderRadius: "4px",
        "& p:first-child":{
            fontFamily:"MulishBold",
            fontSize:"1.25rem"
        },
        "& p:last-child":{
            fontSize:"1.1rem",
            fontFamily:"MulishLight",
            fontStyle:"italic"
        }
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
                <Text color="tertiary">
                    {churchName}
                </Text>
                <Text color="tertiary">
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
        <Text fontSize="1.25rem">
            {name}
        </Text>
        <Text as="b"  fontSize="1rem">
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
    name, country, denomination,
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
            <ModalCloseButton mt={5} mr={5} border="2px solid rgba(0,0,0,.5)" onClick={handleClose}
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
                        value={denomination as string}
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
                        value={stateName || ""}
                    />
                </VStack>
                <VStack align={["center", "flex-start"]}>
                    <ShowDetail
                        name="Country"
                        value={country || ""}
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
    churchDetail: IChurch
}
const ShowSuccess: React.FC<IProps> = () => {
    return (
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


const TermDialog = () => {
    return (
        <ModalContent pb="5">
            <ModalBody display="flex" flexDirection="column"
                alignItems="center" mt="2">
                <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus lectus nec metus facilisis feugiat. Aliquam non aliquet libero. Etiam aliquet metus ac ex malesuada pretium et in massa. Vestibulum et hendrerit libero. Praesent a semper erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed lobortis dapibus mi, in consectetur libero euismod quis. Donec mi massa, placerat sit amet vestibulum id, suscipit nec nunc. Vestibulum nibh mauris, molestie et est a, aliquam lobortis sem. Mauris sed leo rhoncus, viverra orci sed, vehicula diam. Donec eget justo sit amet nulla mattis porttitor. Morbi ac suscipit ante. Vivamus sit amet sagittis eros, ac sodales tellus. Donec eu ex ligula. Donec commodo id ipsum non convallis. Nullam ut mi nec nibh pulvinar scelerisque ac a mauris.

                    Nam mi ligula, congue ac tellus vel, tempus dapibus neque. Quisque rhoncus mollis justo sed mattis. Sed vel dui at leo blandit bibendum at ut nibh. Ut vel ornare nunc. Morbi mi elit, tincidunt eu ligula ac, rhoncus tincidunt dui. Pellentesque in aliquam mi. Phasellus tincidunt et massa vel fermentum. Fusce convallis efficitur nisl eu consectetur. Etiam nec velit sed eros fringilla tincidunt ut vel nisi. Nunc purus elit, vehicula vel dolor et, lacinia tristique risus. Sed malesuada augue enim, eu placerat magna porta nec. Nam justo lectus, rutrum ut arcu at, tempor laoreet tortor. Nulla facilisi. Aliquam erat volutpat. Donec suscipit lacus vitae neque pulvinar, a dictum tellus dictum. Morbi tincidunt nisi in nulla aliquam varius.

                    Integer ullamcorper sit amet nibh non pellentesque. Donec feugiat ipsum vitae felis varius tempor. Maecenas et urna ut dolor interdum rutrum consequat lobortis elit. Aenean ultricies mi vel suscipit posuere. Nam auctor, mauris vitae dapibus porttitor, enim quam viverra mauris, eget ornare tortor felis eu risus. Curabitur sollicitudin sem sit amet lacus aliquam, molestie facilisis massa rutrum. Cras maximus est ut tortor finibus laoreet. Nullam pharetra pretium ipsum, et efficitur nunc. Aliquam sit amet nunc libero. Fusce pellentesque leo quis augue ullamcorper accumsan. Vestibulum quis leo eget metus dignissim vulputate.

                    Ut velit dolor, ultricies ut gravida sit amet, commodo at justo. Suspendisse porta leo enim, nec finibus mi venenatis vel. Praesent lacinia ipsum auctor feugiat volutpat. Vivamus blandit, elit sed sagittis ultrices, sapien ex posuere quam, at feugiat quam elit eu justo. Suspendisse ac dolor eget dolor tincidunt cursus nec et tellus. Vivamus id condimentum eros, id porta lacus. Pellentesque leo metus, fringilla vel turpis a, placerat luctus felis. Maecenas sed posuere felis. Vivamus tempor euismod laoreet. Aliquam varius in ex ac suscipit. Aliquam ac interdum justo.

                    Quisque id orci at erat rutrum tincidunt. Nullam erat est, laoreet eu mollis in, vehicula ac justo. In at rhoncus nibh. Cras sapien erat, tristique dapibus tempus non, pharetra sit amet leo. Suspendisse nec lorem quis ante suscipit interdum ut sed sem. Cras nec nunc sem. Quisque eu ante nisi. Donec sed velit venenatis, tempor tellus vel, iaculis nisi. Ut porttitor ligula tempus, aliquet lorem nec, commodo sapien. Nullam fringilla hendrerit congue. Maecenas id magna non ipsum luctus euismod. Vivamus semper, ligula at semper elementum, libero nulla fermentum urna, non venenatis tortor nisi quis metus. Duis in nulla ut nisl posuere elementum. Sed dapibus, elit non molestie sagittis, nibh tellus dignissim ante, et pulvinar tellus massa quis sem. In hac habitasse platea dictumst.

                    Aenean luctus purus non volutpat eleifend. Mauris a elit massa. Sed maximus eu elit eu pulvinar. Vestibulum vulputate molestie malesuada. Donec vel euismod magna. Aenean cursus aliquet dolor, vel luctus diam blandit id. Mauris dictum dignissim augue et rhoncus. Praesent feugiat luctus mollis. Proin nulla tellus, porttitor sed ligula sed, imperdiet dignissim mi. Phasellus viverra eleifend sem eu lacinia. Curabitur tempor rhoncus enim, non cursus dolor pulvinar nec. Maecenas efficitur, justo at finibus tristique, augue enim auctor augue, et placerat eros ex nec purus. Aliquam elit massa, lacinia vel metus eget, tincidunt aliquet felis. Suspendisse ex lacus, lacinia et eros eu, vehicula suscipit leo. Sed cursus iaculis mauris, quis elementum turpis aliquet sed. In vitae luctus lectus.

                    Nulla nec aliquam nisi. Suspendisse potenti. In eu nulla ligula. Cras sit amet tincidunt leo. Pellentesque porttitor rutrum neque, vel varius purus congue in. Nulla nec ipsum placerat, mollis massa at, efficitur sapien. Pellentesque a lorem non magna gravida mattis. Maecenas facilisis dui a leo tempus gravida. Quisque ac neque pretium, venenatis lorem eu, interdum tortor. Nam eget purus sit amet tortor sollicitudin fringilla. Duis luctus, nulla ut rutrum hendrerit, nisl tellus feugiat velit, at dignissim augue justo vel ipsum.

                    Duis porttitor risus ut dolor accumsan interdum. Vivamus risus mauris, luctus eu urna a, viverra tristique nulla. Sed ut malesuada erat. Duis ut pharetra odio. Sed vel orci scelerisque, suscipit enim sit amet, sodales neque. Mauris sit amet rhoncus neque. Curabitur facilisis diam id libero posuere tincidunt. Vestibulum fermentum arcu molestie, faucibus massa sit amet, eleifend eros. Fusce suscipit consequat neque quis mollis. Ut finibus, lectus eu mattis rutrum, enim est auctor lectus, ut eleifend mi eros pretium diam. Curabitur non mi quis erat ultricies laoreet pellentesque et purus. Sed convallis urna augue.

                    Aliquam efficitur urna ut felis pharetra, nec mollis arcu maximus. Proin volutpat tincidunt leo, nec maximus nisl ultrices nec. Nulla id dui neque. Nunc lobortis aliquet orci, eu malesuada nulla molestie et. In nec sem id urna pretium semper. Ut aliquam vel mauris nec efficitur. Vivamus erat orci, molestie mattis ultricies nec, congue bibendum libero. Duis tortor nisi, laoreet ac ex eget, rhoncus tincidunt magna. Cras at rutrum sem. Vivamus quis ante diam. Nam sagittis sem mi, ac vulputate justo porta ut. Fusce blandit tempor interdum. Cras imperdiet urna sit amet semper vulputate. Proin massa velit, egestas vitae venenatis at, consectetur sed libero.

                    Vivamus interdum elit non felis eleifend, vitae condimentum enim varius. Vivamus ac auctor lacus. Vestibulum aliquam augue volutpat euismod tristique. Maecenas lobortis quis tortor at pellentesque. Duis euismod cursus placerat. Suspendisse nec laoreet orci. Maecenas convallis, odio at suscipit euismod, turpis justo venenatis nisl, ut fringilla mauris libero in erat. Vivamus vel consequat sem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam viverra gravida metus eget aliquam. Donec vitae fermentum magna. Aenean nec molestie turpis. Vivamus elementum odio id tortor vulputate feugiat. In vitae nisi pretium, eleifend urna nec, aliquam dolor. Vivamus volutpat fringilla nisl, eget dapibus magna posuere eget. Proin sagittis elit sed velit consectetur hendrerit.

                    Phasellus sagittis gravida tellus, at luctus neque suscipit non. Donec accumsan varius rutrum. Vivamus non bibendum magna. Ut gravida nulla purus, in tincidunt turpis vestibulum quis. Donec ultricies ipsum enim, ut posuere ligula molestie nec. Aenean ipsum ex, euismod vel tortor in, tristique rutrum sapien. Vestibulum ultricies, nisi sed volutpat dictum, nisi tortor bibendum tellus, in interdum dui urna vitae augue. Sed fringilla id est non pulvinar. Suspendisse non eros tristique, rhoncus mi in, ultricies leo. Pellentesque ut mi congue nisi blandit sodales. Sed facilisis varius felis eu tristique. Donec sit amet nisi quam. Suspendisse eget ex at augue auctor rhoncus. Cras lectus magna, consectetur bibendum placerat sit amet, cursus non velit. Ut vitae feugiat libero, quis tincidunt orci.

                    Integer sit amet malesuada justo, eu vestibulum diam. Vivamus venenatis magna eget velit elementum, eu rutrum est tempus. Ut bibendum, turpis eu viverra tristique, felis ligula consequat arcu, in tempus mi sem ac magna. Sed justo sapien, molestie ut rutrum sed, euismod et diam. Nam vitae magna condimentum, posuere mauris eu, accumsan nunc. Proin gravida id lacus quis fringilla. Cras vel facilisis eros. Proin ornare enim efficitur eros tristique maximus. Nullam sagittis ullamcorper ante. Maecenas eleifend risus quis sapien fermentum finibus. Suspendisse consequat massa at urna varius, pharetra ornare tellus malesuada. Proin egestas orci vitae tristique bibendum. Sed feugiat lobortis quam vel pellentesque. Vivamus blandit, arcu sit amet tristique vestibulum, metus massa pellentesque risus, sed tincidunt lorem metus ut dolor. Sed fermentum felis interdum orci ultricies, nec finibus dui dictum. Aliquam sit amet nunc quis nunc pharetra facilisis non nec elit.

                    Praesent ullamcorper metus at nisi dictum tempus. Proin tempus erat metus, a tincidunt ligula elementum eget. Nullam pretium, turpis non facilisis luctus, ligula tellus eleifend lorem, et commodo neque erat vitae massa. Nulla diam diam, tincidunt eget gravida sit amet, porttitor feugiat ligula. Mauris ex nisi, pretium sed iaculis eget, molestie in lorem. In cursus malesuada elit ut volutpat. Maecenas et commodo sem. Vestibulum tincidunt ante sit amet ipsum convallis blandit. Nulla facilisi. Vestibulum fermentum purus id urna ultricies, eu ornare libero feugiat. Quisque eu purus eu mi tristique pharetra sed at augue. Nam eu feugiat augue. Proin et finibus massa. Duis in dapibus sapien. Morbi aliquet turpis in ligula aliquam maximus. Aliquam at ante aliquet, elementum quam a, sodales metus.

                    Etiam mattis ligula ut turpis lobortis interdum. Maecenas metus augue, euismod nec ante et, imperdiet tristique dui. Curabitur a feugiat velit, sit amet accumsan nibh. Nam cursus augue ut nisl semper, eu vestibulum magna cursus. Suspendisse potenti. Mauris nec justo eu lacus placerat volutpat eu ac lacus. Cras sit amet maximus sem. Etiam in libero ac risus consequat consectetur. Vivamus leo lectus, imperdiet a faucibus at, convallis ut risus. Morbi ornare pretium feugiat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla facilisi. Sed neque tortor, tincidunt ullamcorper vehicula vel, sagittis at diam. Nulla vulputate elementum arcu, vel suscipit leo suscipit at.

                    Morbi malesuada dictum sapien eget viverra. Pellentesque ligula erat, hendrerit eu dui sed, placerat condimentum diam. Ut sem urna, accumsan in vestibulum efficitur, tristique ac enim. Pellentesque nisi lectus, dignissim et dui sit amet, sodales dictum justo. Nunc nisi sem, volutpat in aliquet ut, bibendum id nulla. Duis porta turpis id tortor auctor rutrum. Nullam a sapien in erat fermentum semper. Nullam in arcu orci. Vivamus tristique libero metus, vitae vulputate ex vestibulum id. Curabitur in viverra nisl. Fusce pellentesque gravida bibendum. Vestibulum eget egestas nunc. Curabitur viverra turpis nec lectus scelerisque, ut sagittis libero aliquet. Nunc lacinia nisl nibh, vitae luctus erat ultrices sed. Phasellus ac rutrum ante. Ut a neque quis dui pretium bibendum sit amet ac nisl.

            </Text>
            </ModalBody>
        </ModalContent>

    )
}

const GoBack = ({ func }: any) => (
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
    const [showChurchSelect, setShowChurchSelect] = React.useState<IChurch[]>([])
    const currentDate = new Date()
    const dispatch = useDispatch()
    const minDate = new Date()
    minDate.setFullYear(1900, 0, 0,)
    currentDate.setFullYear(2000, 0, 0)
    const [denomination, setDenomination] = React.useState<IDenomination[]>([])
    const [showTerm,setShowTerm] = React.useState(false)
    const [country,setCountry] = React.useState<ICountry[]>([])
    const [showBirthday, setShowBirthday] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
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
                setState([...payload.data])
            }).catch(err => {
                toast({
                    title: "Unable to get State List",
                    subtitle: `Error:${err}`,
                    messageType: MessageType.ERROR
                })
            })
        }
        const getCountryLocation = async () => {
            await getCountry().then(payload => {
                setCountry([...payload.data])
            }).catch(err => {
                
            })
        }

        const getDenomination = async () => {
            try {
                await churchService.getChurchDenomination().then(payload => {
                    setDenomination([...payload.data])
                })
            } catch (err) {
                toast({
                    title: "Unable to get Church Denomination",
                    subtitle: `Error:${err}`,
                    messageType: MessageType.WARNING
                })
            }
        }

        getCountryLocation()
        getStateLocation()
        getDenomination()
        return () => {
            setShowDialog(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        const testString = new RegExp(inputValue, "i")
        const newChurchSelect = churchSelect.filter((item) => testString.test(item.name))
        setShowChurchSelect([...newChurchSelect])
    }, [inputValue])

    const handleInputChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value)
    }

    const initialValues = {
        firstname: "",
        lastname: "",
        username: "",
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
        genderID: Yup.string().oneOf(["1", "2"], "Please Select Your gender Type").required(),
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
    // Show the terms and condition
    const handleShowTerms = () => {
        handleDialogToggle()
        setShowTerm(true)
    }
    // Set the current church selected
    const handleSetCurrentChurch = (church: IChurch) => () => {
        const currentChurch:IChurch = {
            ...church,
            country:country.find(item => item.countryID === church.countryID)?.name,
            denomination:denomination.find(item => item.denominationID === church.denominationId)?.denominationName || ""
        }
        setCurrentChurch(currentChurch)
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
                const { firstname, password, phoneNumber, email, lastname, birthday } = values
                const newUser: IChurchMember = {
                    firstname,
                    lastname,
                    username: String(phoneNumber),
                    personTypeID: 1,
                    genderID: values.genderID,
                    email,
                    phoneNumber,
                    password,
                    role: "ChurchMember",
                    enteredBy: "ChurchMember",
                    ...(currentChurch.churchID && { churchId: currentChurch.churchID }),
                    isDataCapture: false,
                    dateOfBirth: birthday.toJSON(),
                    ...(image.base64 && { picture_url: image.base64 }),
                    societies: [],
                    societyPosition: []
                }
                await accountService.createChurchMember(newUser).then(payload => {
                    handleShowSuccess()
                    dispatch(login(newUser.phoneNumber as number, newUser.password, toast))
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
                    <Text textStyle="h6" opacity={.8} textAlign={["center", "left"]}
                     maxWidth="sm" mt={["3"]}>
                        Register as a church member by providing your details
                </Text>
                    {!showBirthday && !open &&
                        <VStack align="flex-start" w="100%">
                            <Heading color="tertiary" fontFamily="MulishBold" fontSize="3rem" >
                                Find Your Church
                            </Heading>
                            <Text fontSize="0.875rem">
                                If you can't find your church&nbsp;
                            <Text as="b" onClick={showBirthdayForm} >
                                    Click Here
                            </Text>
                            </Text>
                            <HStack my={6} w="100%">
                                <GoBack func={handleToggle} />
                                <SearchInput className={classes.input}
                                    value={inputValue} width={["100%", "50%"]}
                                    setValue={handleInputChange} />
                            </HStack>
                        </VStack>

                    }

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
                                                        <HStack width="100%" borderRadius="4px"
                                                        boxShadow="0px 3px 6px #0000000D"
                                                        ml={3} my="auto">
                                                            <Image maxW="5rem"
                                                                src={currentChurch.churchLogo || ChurchImage} />
                                                            <VStack mr="auto" align="flex-start" >
                                                                <Text fontSize="1.25rem" as="b">
                                                                    {currentChurch.name}
                                                                </Text>
                                                                <Text fontFamily="MulishLight" as="i"
                                                                 opacity={.7}  fontSize="1rem" >
                                                                    {currentChurch.address}
                                                                </Text>
                                                            </VStack>
                                                            <Icon color="primary" boxSize="2rem" as={AiFillCheckCircle} />
                                                        </HStack>
                                                    }
                                                </HStack>
                                                
                                                <VStack align="center" >
                                                    <Flex className={classes.imageContainer} p={5} >
                                                        <input accept="image/jpeg,image/png" onChange={handleImageTransformation} type="file"
                                                            className={classes.input} id="icon-button-file" />
                                                        <label htmlFor="icon-button-file">
                                                            <IconButton as="span" padding={[2, 4]} boxSize={["7.5rem"]}
                                                             aria-label="submit image"
                                                                borderRadius="50%" bgColor={buttonBackground}
                                                                icon={image.name ? 
                                                                <Avatar size="2xl" src={image.base64} /> : 
                                                                <BsCardImage fontSize="2rem" />
                                                            } />
                                                        </label>
                                                        <Heading as="h4" mt={2} fontSize="1.125rem" >Profile Image</Heading>
                                                    </Flex>
                                                        {
                                                            image.name &&
                                                                <Text fontSize="10px" opacity={.5} isTruncated maxW="2xs" 
                                                                >{image.name}
                                                                </Text>
                                                        }
                                                </VStack>
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
                                                                <option key={idx} value={idx + 1} >
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
                                                        <PasswordInput name="password"
                                                            type="password" placeholder="Password" />
                                                        <PasswordInput name="confirmPassword"
                                                            type="password" placeholder="Confirm Password" />
                                                        <Text onClick={handleShowTerms}>
                                                            Agree to our &nbsp;
                                                            <span>
                                                                Terms of Service and Policy
                                                            </span>
                                                            &nbsp; and  &nbsp;
                                                            {/* <span> and</span> */}
                                                            <span >
                                                                    Privacy Policy
                                                            </span>
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
                                                    <Box maxH="35rem" overflowY="auto" >
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
                    <Text fontSize="1.125rem" >Already have an account? &nbsp;
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
                    showTerm ? <TermDialog/> : <VerifyChurchDialog handleClose={handleDialogToggle} handleConfirmation={handleBirthdayToggle}
                    church={(currentChurch || defaultChurch)} />
                }
            </Dialog>
        </>
    )
}

export default Signup