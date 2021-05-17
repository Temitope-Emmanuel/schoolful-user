import React from "react";
import { Link, LinkProps } from "react-router-dom"
import { createStyles, makeStyles } from "@material-ui/styles"
import {
  Box, Flex, Menu, MenuButton, Text, chakra,
  MenuList, MenuItem
} from "@chakra-ui/react";
import { Logo } from "components/Logo"
import { Button } from "components/Button"
import { useSelector } from 'react-redux'
import { AppState } from "store"
import { Dialog } from "components/Dialog"
import {SearchChurch} from "./FindChurch"


const useStyles = makeStyles((theme: any) => (
  createStyles({
    root: {
      fontFamily: "MulishRegular",
      position: "absolute",
      top: 0,
      width: "100%",
      fontWeight: "normal",
      fontStyle: "normal",
      zIndex: 3,
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "nowrap",
      padding: "1.5rem",
      "& p,a": {
        textAlign: "center",
        color: "white",
        fontSize: "1rem",
        letterSpacing: "0px",
        fontWeight: "normal"
      }
    },
    linkContainer: {
    }
  })
))


interface IMenuItem extends LinkProps {
  children: React.ReactNode
}

const ChakraLink = chakra(Link)

const MenuItems: React.FC<IMenuItem> = ({ children, ...props }) => (
  <ChakraLink mt={{ base: 4, md: 0 }} mr={6} display="block" {...props}>
    {children}
  </ChakraLink>
);

interface IProps {
  [key: string]: string
}


const Header: React.FC<IProps> = props => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const isAuthenticated = useSelector((state: AppState) => state.system.isAuthenticated)
  const currentUser = useSelector((state: AppState) => state.system.currentUser)

  const handleToggle = () => {
    setOpen(!open)
  }

  return (
    <>
      <Dialog open={open} close={handleToggle} >
        <SearchChurch handleClose={handleToggle} />
      </Dialog>
      <Flex className={classes.root}
        as="nav"
        {...props}
        p={{ base: "3", md: "10" }}
      >
        <Flex display={{ base: "none", md: "inline-block" }} flex={1} />
        <Logo />
        <Menu>
          <Box display={{ md: "none" }}>
            <MenuButton
              px={4}
              py={2}
              transition="all 0.2s"
              rounded="md"
              borderWidth="1px"
            >
              <svg
                fill="white"
                width="12px"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </MenuButton>
          </Box>
          <MenuList display="flex" flexDirection="column">
            <MenuItem as={Link} to="/signup/admin" color="primary">Find Your Church</MenuItem>
            <MenuItem color="primary">About us</MenuItem>
            <MenuItem color="primary">Contact us</MenuItem>
            {
              isAuthenticated ?
                <MenuItem color="primary">
                  <Link to={`/church/${currentUser.churchId}/dashboard`}>
                    church
            </Link>
                </MenuItem>
                :
                <MenuItem color="primary">
                  <Link to="/login">
                    Login
            </Link>
                </MenuItem>

            }
            <Link to="/signup/role">
              <MenuItem color="primary">
                Sign Up
            </MenuItem>
            </Link>
          </MenuList>
        </Menu>
        <Flex flex={2} display={{ base: "none", md: "inline-block" }} />
        <Box
          display={["none", "", "flex"]}
          width={["full", "", "auto"]}
          alignItems="center" flexDirection="row"
          justifyContent="flex-end"
          flexGrow={1} className={classes.linkContainer}
        >
          <Text mt={{ base: 4, md: 0 }} mr={6} cursor="pointer"
            display="block" onClick={handleToggle}>
            Find your church
        </Text>
          <MenuItems to="/#section">About us</MenuItems>
          <MenuItems to="/#section">Contact us</MenuItems>
        </Box>
        <Flex flex={2} display={{ base: "none", md: "inline-block" }} />
        <Flex
          alignItems="center"
          flexDirection="row" mr="2.5rem"
          display={["none", "", "flex"]}
          mt={{ base: 4, md: 0 }}
        >
          <MenuItems to="/login">
            Login
        </MenuItems>
          <Button px="9" height="2em">
            <Link to="/signup/role" >
              Sign Up
          </Link>
          </Button>
        </Flex>
      </Flex>

    </>
  );
};

export default Header;