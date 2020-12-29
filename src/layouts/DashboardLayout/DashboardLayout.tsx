import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Link, useLocation } from "react-router-dom"
import { Stack, Icon,Heading, Text, Flex, Avatar,
   Spacer,Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import { CgBell,CgProfile } from 'react-icons/cg'
import { Logo } from "components/Logo"
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux"
import {LoadActivitiesForChurch,LoadEventsForChurch} from "store/Activity/actions"
import {AdvertLayout} from "layouts/AdvertLayout"
import { MdDashboard } from "react-icons/md"
import { FaPrayingHands, FaHandHoldingHeart, FaUserAlt, FaBible } from "react-icons/fa"
import { FiActivity } from "react-icons/fi"
import { TiGroup } from "react-icons/ti"
import {FiLogOut} from "react-icons/fi"
import { RiBroadcastLine } from "react-icons/ri"
import { GiPodiumWinner,GiHamburgerMenu } from "react-icons/gi"
import {getChurch,logout} from "store/System/actions"
import useToast from "utils/Toast"
import useParams from "utils/Params"
import { AppState } from 'store';


const drawerWidth = 210;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      backgroundColor: "white",
      zIndex: theme.zIndex.drawer + 1,
    },
    optionContainer: {
      margin: ".5rem",
      "& a": {
        textDecoration: "none",
        "& > div":{
          transition:".3s all linear"
        }
      },
      "& p": {
        margin: ".5rem 0"
      },
      "& svg": {
        marginRight: ".5rem"
      },
      "& > *": {
        cursor: "pointer",
        alignItems: "center"
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        display: 'none'
      }
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      display: "flex",
      justifyContent: "flex-start",
      paddingTop: "5rem",
      alignItems: "center"
    },
    content: {
      flexGrow: 1,
      backgroundColor:"#F9F5F9"
    },
    link: {
      color: "#383838",
      opacity: .8
    },
    activeLink: {
      color: "#B603C9",
      transform:"scale(1.1)",
      marginLeft:".7rem",
      opacity: "1 !important"
    }
  }),
);

interface IProps {
  children: any
}



const dashboardMenu = [
  { icon: MdDashboard, name: "Home", link: "/home" },
  { icon: FaPrayingHands, name: "Prayer Wall", link: "/prayer" },
  { icon: FaBible, name: "Bible", link: "/bible" },
  { icon: GiPodiumWinner, name: "Sermon", link: "/sermon" },
  { icon: FaUserAlt, name: "Profile", link: "/profile" },
  { icon: FaHandHoldingHeart, name: "Giving", link: "/giving" },
  { icon: FiActivity, name: "Church Activity", link: "/activity" },
  { icon: FiActivity, name: "Daily Reflection", link: "/reflection" },
  { icon: TiGroup, name: "Groups", link: "/groups" },
  { icon: RiBroadcastLine, name: "Announcement", link: "/announcement" }
]


const DashboardLayout:React.FC<IProps> = (props) => {
  const location = useLocation()
  const activeLink = location.pathname
  const dispatch = useDispatch()
  const params = useParams()
  const toast = useToast()
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopOpen,setDesktopOpen] = React.useState(true)
  const currentUser = useSelector((state:AppState) => state.system.currentUser)

  const atProfile = location.pathname.includes("/profile")
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleDesktopToggle = () => {
    setDesktopOpen(!desktopOpen)
  };

  React.useEffect(() => {
    dispatch(getChurch(toast))
    dispatch(LoadActivitiesForChurch(params.churchId,toast))
    dispatch(LoadEventsForChurch(params.churchId,toast))
  },[])

  const drawer = (
    <>
      <div className={classes.toolbar} />
      <Stack className={classes.optionContainer} spacing={2}>
        {dashboardMenu.map((item, idx) => (
          <Link key={idx} to={`/church/${params.churchId}${item.link}`} >
            <Flex align="center"
              className={activeLink.includes(item.link) ? classes.activeLink : classes.link} >
              <Icon boxSize="1rem" as={item.icon} />
              <Text ml="4" fontSize="1rem" >{item.name}</Text>
            </Flex>
          </Link>
        ))}
      </Stack>
    </>
  );
  
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <Icon color="black" w="1.69rem" h="1.13rem" as={GiHamburgerMenu} />
          </IconButton>
          <Flex align="center" justify="space-around" flex={3}>
            <Logo white={false} />
          </Flex>
          <Flex flex={4} justify="flex-end">
            <Heading textStyle="h5" color="primary" whiteSpace="nowrap" display={["none", "initial"]}>
              Dashboard
            </Heading>
          </Flex>
          <Spacer flex={8} />
          <Flex mr={["auto", "10"]} align="center" justifyContent="space-around"
            flex={2} >
            <Icon as={CgBell} boxSize="1.82rem" color="black" />
              <Menu>
              <MenuButton>
              <Avatar border="2px solid #B603C9"
                size="sm" name="Temitope Emmanuel"
                src={currentUser.picture_url || "https://bit.ly/ryan-florence"} />
              </MenuButton>
              <MenuList>
                {
                  !atProfile && 
                  <MenuItem as={Link} to={`/church/${params.churchId}/profile`} color="rgba(0,0,0,.6)">
                    <Icon as={CgProfile}/>
                    Profile
                  </MenuItem>
                }
                <MenuItem color="rgba(0,0,0,.6)" onClick={logout}>
                  <Icon as={FiLogOut} />
                    Logout
                  </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden mdUp implementation="css">
          <Drawer
            // container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
          <AdvertLayout>
            {props.children}
          </AdvertLayout>
      </main>
    </div>
  );
}

export default DashboardLayout