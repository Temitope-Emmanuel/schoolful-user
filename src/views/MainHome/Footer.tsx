import { Stack, VStack, HStack, Text, Icon,Image, InputGroup, Input, InputRightElement } from "@chakra-ui/react"
import { makeStyles, createStyles } from "@material-ui/core"
import { Logo } from "assets/images"
import { Button } from "components/Button"
import React from "react"
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa"
import { HiOutlineMail } from "react-icons/hi"
import { Link } from "react-router-dom"
import { primary } from "theme/chakraTheme/palette"
import useToast from "utils/Toast"


const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: "100%",
        padding: theme.spacing(7, 0),
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.up("sm")]: {
            padding: theme.spacing(16, 0),
            "& a": {
                textAlign: "left"
            }
        },
        "& button": {
            fontFamily: "MulishRegular"
        },
        "& p,a": {
            fontSize: "1.1875rem"
        },
        "& > div": {
            borderTop: "1px solid whitesmoke",
            justifyContent: "space-between",
            maxWidth: "70rem",
            paddingTop: "3rem",
            [theme.breakpoints.up("sm")]: {
                marginBottom: theme.spacing(20)
            },
            "& a": {
                color: "white"
            },
            "& input": {
                backgroundColor: "transparent",
                border: "1px solid white",
                "& svg": {
                    color: `${primary} !important`
                }
            },
            "& button": {
                width: "100%"
            },
            "& > div": {
                alignItems: "center",
                marginTop: "0 !important",
                [theme.breakpoints.up("sm")]: {
                    marginRight: theme.spacing(4),
                    alignItems: "flex-start",
                },
                "& p": {
                    textAlign: "center",
                    maxWidth: "20rem",
                    [theme.breakpoints.up("sm")]: {
                        textAlign: "left",
                    }
                },
                "& p:first-child": {
                    textAlign: "left",
                    color: primary,
                    maxWidth: "20rem"
                }
            }
        },
    },
    middleText: {
        margin: `${theme.spacing(3, 0)} !important`,
    },
    socialContainer: {
        marginTop: `${theme.spacing(3)}px !important`,
        "& svg": {
            color: "white",
            marginRight: theme.spacing(1)
        }
    },
    button: {
        fontWeight: 400,
        padding: `${theme.spacing(3, 7)} !important`,
        fontSize: ".9rem",
        [theme.breakpoints.up("sm")]: {
            fontSize: "1.3rem",
        }
    }
}))



const Footer = () => {
    
    const toast = useToast()
    const classes = useStyles()
    const handleSubscribe = () => {
        toast({
            messageType:"info",
            subtitle:"Successfully subscribed",
            title:""
        })
    }

    return (
        <Stack bgColor="tertiary" className={classes.root}>
            <Stack width={["95%", "75%"]} flexDirection={{ base: 'column', md: 'row' }}>
                <VStack>
                    <Image src={Logo} />
                    <Text color="primary">
                        But I must explain to you how all this mistaken idea of denouncing
                        pleasure and praising pain was born and I will give you a complete account of the.
                        </Text>
                    <Text color="whitesmoke" className={classes.middleText}>
                        1st Floor, Leasing House,C & I Leasing Drive, Off Bisola Durosinmi
                        Etti Drive, Off Admiralty Way, Lekki Phase 1, Lagos, Nigeria
                        </Text>
                    <VStack align="flex-start">
                        <Text color="whitesmoke">
                            +234-1-342-9192
                            </Text>
                        <Text color="whitesmoke">
                            info@thefaithfuls.com
                            </Text>
                    </VStack>
                    <HStack spacing={3} className={classes.socialContainer}>
                        <Icon as={FaFacebookF} />
                        <Icon as={FaTwitter} />
                        <Icon as={FaLinkedinIn} />
                    </HStack>
                </VStack>
                <VStack>
                    <Text>Menu</Text>
                    <Link to="/" >
                        Home
                    </Link>
                    <Link to="/">
                        Find Your Church
                    </Link>
                    <Link to="/" >
                        About Us
                    </Link>
                    <Link to="/">
                        Contact Us
                    </Link>
                </VStack>
                <VStack>
                    <Text>
                        Company
                    </Text>
                    <Link to="/">
                        Terms of service
                    </Link>
                    <Link to="/">
                        Privacy Policy
                    </Link>
                    <Link to="/">
                        Blog
                    </Link>
                </VStack>
                <VStack>
                    <Text>
                        Subscribe
                    </Text>
                    <Text color="white">
                        For our Newletter and updates
                    </Text>

                    <InputGroup>
                        <Input color="white" placeholder="Enter your Email" />
                        <InputRightElement children={<Icon color="primary" as={HiOutlineMail} />} />
                    </InputGroup>
                    <Button className={classes.button} onClick={handleSubscribe} >
                        Subscribe
                    </Button>
                </VStack>
            </Stack>
        </Stack>

    )
}

export default Footer