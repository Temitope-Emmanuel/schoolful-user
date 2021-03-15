import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import {
  VStack,
  Text,
  Image,
  Heading,
  Button,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { BiStar } from "react-icons/bi";
import useToast from "utils/Toast"
import { IoIosArrowDown } from "react-icons/io"
import { ICurrentActivity} from "core/models/Activity"
import { MessageType } from "core/enums/MessageType"
import { ICurrentEvent} from "core/models/Event"
import DatePicker from "react-date-picker"
import { tertiary } from 'theme/chakraTheme/palette'
import { AppState } from "store";
import {updateActivity,updateEvent} from "store/Activity/actions"
import {showLoading,hideLoading} from "store/System/actions"
import { useSelector,useDispatch } from "react-redux";
import useScroll from "utils/Scroll"


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 6,
      "& > div:first-child": {
        position: "sticky",
        top: "10%",
        zIndex: 10,
        alignItems: "flex-start",
        width: "100%",
        padding: theme.spacing(1, 2),
        borderRadius: "4px",
        transition: "all .6s linear",
        marginBottom:"2rem",
        "& > div:last-child": {
          width: "100%",
          justifyContent: "space-between",
        },
      },
    },
    active: {
      boxShadow: "0px 5px 10px #0000001A",
      borderRadius: "4px",
      padding: theme.spacing(1),
      backgroundColor: "white",
      "& p": {
        color: `${tertiary} !important`
      }
    },
    dateContainer: {
      padding: theme.spacing(1),
      marginRight: theme.spacing(2),
      "& > *": {
        border: "none",
        "&::focus,&::active": {
          borderColor: "2px solid black",
          borderRadius: "2px",
        },
        "& select": {
          appearance: "none"
        }
      }
    }
  })
);

interface ICurrentWeek {
  date: number;
  day: string;
  rawDate: Date
}

const activityCardStyles = makeStyles((theme) => createStyles({
  activityContainer: {
    boxShadow: "0px 5px 10px #0000001A",
    width: "100%",
    borderRadius: "4px",
    "& > div:first-child": {
      width: "100%",
    },
    "& > div:nth-child(2)": {
      width: "100%",
      padding: theme.spacing(2),
      paddingBottom: theme.spacing(4),
      "& h2": {
        fontSize: "1.18rem",
      },
      "& p": {
        fontSize: "0.82rem",
      },
      // alignSelf:"flex-start !important",
      alignItems: "flex-start !important",
    },
    "& button": {
      borderRadius: "100px",
      "& svg": {
        marginRight: ".4rem",
      },
      boxShadow: "0px 3px 6px #00000029",
    },
  }
}))

interface IChurchActivityCardProps {
  id: number;
  image?: string;
  title: string;
  description: string;
  recurringInfo?: string;
  addToCalendar: any;
  time: string;
  disableInterested:boolean
}

const ChurchActivityCard: React.FC<IChurchActivityCardProps> = ({ id, image, title, description,
  recurringInfo, addToCalendar, time,disableInterested }) => {
  const classes = activityCardStyles()
  const isLoading = useSelector((state:AppState) => state.system.isLoading)
  return (
    <VStack key={id} className={classes.activityContainer}>
      <VStack height="25vh" backgroundColor={image ? "transparent" : "primary"}>
        {
          image &&
          <Image src={image} width="100%" height="100%" objectFit="cover" />
        }
      </VStack>
      <VStack>
        <Heading color="tertiary">{title}</Heading>
        <Text color="tertiary">{time}</Text>
        <Text color="tertiary" maxW="sm">
          {description}
        </Text>
        {
          recurringInfo &&
          <Text color="tertiary" maxW="sm">
            {recurringInfo}
          </Text>
        }
        <HStack mt={5} width="100%" justify="space-between">
          <Button colorScheme="primary" disabled={disableInterested || isLoading } onClick={addToCalendar} bgColor="primary">
            <Icon as={BiStar} />
               {disableInterested ? "Attending" : "Interested"}
              </Button>
          <Button colorScheme="#FF0000" bgColor="#FF0000">
            Live
              </Button>
        </HStack>
      </VStack>
    </VStack>
  )
}

const Activity = () => {
  const gapi = (window as any).gapi
  const googleClientId = process.env.REACT_APP_CLIENT_ID
  const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY
  const discoveryDocs = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ];
  const scopes = "https://www.googleapis.com/auth/calendar";

  const classes = useStyles();
  const todayDate = new Date()
  todayDate.setUTCHours(0)
  todayDate.setUTCMinutes(0)
  todayDate.setUTCSeconds(0)
  todayDate.setUTCMilliseconds(0)
  const dispatch = useDispatch()
  const churchActivity = useSelector((state:AppState) => state.activity.activities)
  const churchEvent = useSelector((state:AppState) => state.activity.events)
  const [currentWeek, setCurrentWeek] = React.useState<ICurrentWeek[]>([]);
  const [currentDate, setCurrentDate] = React.useState<Date>(todayDate);
  const [activeIndex, setActiveIndex] = React.useState<Date>(currentDate);
  const [currentActivity, setCurrentActivity] = React.useState<ICurrentActivity[]>([])
  const [currentChurchEvent, setCurrentChurchEvent] = React.useState<ICurrentEvent[]>([])
  const toast = useToast()
  const scrolling = useScroll()
  

  const handleActive = (arg: Date) => () => {
    setActiveIndex(arg);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const handleAuthClick = (func:Function): any => {
      return gapi.load("client:auth2", () => {
        gapi.client.init({
          apiKey: googleApiKey,
          clientId: googleClientId,
          discoveryDocs,
          scope: scopes
        }).then((evt: any) => {
            if (!(gapi.auth2.getAuthInstance().isSignedIn.get())){
              gapi.auth2.getAuthInstance().signIn()
            }
          }).then(() => {func()})
          .catch((err: any) => {
            toast({
              title: "Unable to Load Google Sign in",
              subtitle: `Error:${err.details}`,
              messageType: MessageType.ERROR
            })
          })
      })
  }

  const addToCalendar = (idx: number, eventName: "activity" | "event") => async () => {
    dispatch(showLoading())
    const addEventToCalendar = () => {
    const isActivity = eventName === "activity"
    const foundActivity = isActivity ? currentActivity[idx] : currentChurchEvent[idx]
    let removeDStart;
    if (isActivity) {
      const recurrence = (foundActivity as ICurrentActivity).schedule.recurrence?.replace("BYWEEKDAY", "BYDAY")
      const removeNewLine = recurrence?.replace("\n", "")
      removeDStart = `RRULE${removeNewLine?.split("RRULE")[1]}`
    }
    const event = {
      'summary': foundActivity.title,
      'description': foundActivity.description,
      'start': {
        'dateTime': isActivity ? (foundActivity as ICurrentActivity).schedule.time.startDate : (foundActivity as ICurrentEvent).startDateTime,
        'timeZone': 'Africa/Lagos'
      },
      'end': {
        'dateTime': isActivity ? (foundActivity as ICurrentActivity).schedule.time.endDate : (foundActivity as ICurrentEvent).endDateTime,
        'timeZone': 'Africa/Lagos'
      },
      'reminders': {
        'useDefault': false,
        'overrides': [
          { 'method': 'email', 'minutes': 24 * 60 },
          { 'method': 'popup', 'minutes': 10 }
        ]
      },
      ...(isActivity && {
        'recurrence': [
          removeDStart
        ]
      })
    };

    gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      resource: event
    }).then(function (response: any) {
      toast({
        title: "New Event Successfully added",
        subtitle: "",
        messageType: "success"
      })
      // Update The Activity to show the attendee
      if (isActivity) {
        dispatch(updateActivity(foundActivity as ICurrentActivity,toast))
        } else {
        // Update the Event to show the attendee
        dispatch(updateEvent(foundActivity as ICurrentEvent,toast))
        }
    }).catch((err: any) => {
      dispatch(hideLoading())
      toast({
        title: "Unable to add new Google Event",
        subtitle: `Error:${err.result.error.message}`,
        messageType: "error"
      })
    })
  }
  handleAuthClick(addEventToCalendar)
  }

  // Generating the list of days in the week
  React.useEffect(() => {
    const optionForDate:Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric" };
    const currentWeek = [0, 1, 2, 3, 4, 5, 6].map((item) => {
      const currentDateHolder = new Date(currentDate);
      const newDate = new Intl.DateTimeFormat("en-US", optionForDate)
        .format(currentDateHolder.setDate(currentDateHolder.getDate() + item))
        .split(" ");
      return {
        day: newDate[1],
        date: Number(newDate[0]),
        rawDate: new Date(currentDateHolder.getTime())
      };
    });
    setCurrentWeek(currentWeek);
    setActiveIndex(currentWeek[0].rawDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  // Search For Activity on the current Date
  console.log("this is the church activity",churchActivity)
  React.useEffect(() => {
    if ( churchActivity[0] && churchActivity[0].activityID) {
      // Find the next Day value add the amount of seconds in a day to the current active day
      const nextDay = new Date(activeIndex.getTime() + 86400000)
      const currentChurchActivity: ICurrentActivity[] = []
      for (let i = 0; i < churchActivity.length; i++) {
        if (churchActivity[i].recurringRule.between(activeIndex, nextDay, true).length > 0) {
          const activity = churchActivity[i]

          const { schedule: { time: {
            startDate,
            endDate
          } } } = activity

          currentChurchActivity.push({
            ...activity,
            schedule: {
              ...activity.schedule,
              time: {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
              }
            }
          })
        }
      }
      setCurrentActivity(currentChurchActivity)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, churchActivity])

  React.useEffect(() => {
    const currentChurchEvent = []
    const nextDay = new Date(activeIndex.getTime() + 86400000)

    for (let i = 0; i < churchEvent.length; i++) {
      const eventStartTime = (new Date(churchEvent[i].startDateTime))
      const event = churchEvent[i]
      if (eventStartTime.getTime() > activeIndex.getTime() && eventStartTime.getTime() < nextDay.getTime()) {
        currentChurchEvent.push({
          ...event
        })
      }
    }

    setCurrentChurchEvent([...currentChurchEvent])

  }, [activeIndex, churchEvent])

  // Update the currentDate
  const handleCurrentDate = (e: Date | Date[]) => {
    setCurrentDate((e as Date));
  }


  return (
    <VStack className={classes.root} maxW="lg">
      <VStack bgColor={scrolling.scrolling ? "primary" : "#0000001A"}>
        <DatePicker minDetail="month" minDate={todayDate}
          className={classes.dateContainer} onChange={handleCurrentDate}
          calendarIcon={<IoIosArrowDown />} format="MMMM y"
          value={currentDate}
          clearIcon={null} />
        <HStack>
          {currentWeek.map((item, idx) => (
            <VStack
              cursor="pointer"
              key={idx}
              className={activeIndex === item.rawDate ? classes.active : ""}
              onClick={handleActive(item.rawDate)}
            >
              <Text color={scrolling.scrolling ? "whitesmoke" : "tertiary"} fontWeight={600} fontSize="1.1rem">
                {item.date}
              </Text>
              <Text color={scrolling.scrolling ? "whitesmoke" : "tertiary"} mt={0} opacity={0.7} fontSize="1rem">
                {item.day}
              </Text>
            </VStack>
          ))}
        </HStack>
      </VStack>
      <VStack width={["95%"]}>
        {currentChurchEvent.map((item, idx) => (
          <ChurchActivityCard key={item.eventId} title={item.title} id={item.eventId || idx} disableInterested={item.isInterested}
            image={item.bannerUrl} recurringInfo="This is a church Event" time={
              `${(new Date(item.startDateTime)).toLocaleTimeString()} - ${(new Date(item.endDateTime)).toLocaleTimeString()}`
            }
            addToCalendar={addToCalendar(idx, "event")} description={item.description}
          />
        ))}
        {currentActivity.map((item, idx) => (
          <ChurchActivityCard
            key={item.activityID}
            addToCalendar={addToCalendar(idx, "activity")} description={item.description} disableInterested={item.isInterested}
            id={item.activityID || idx} title={item.title} image={item.bannerUrl} recurringInfo={item.recurringInfo}
            time={
              `${(item.schedule.time.startDate as Date).toLocaleTimeString()} - ${(item.schedule.time.startDate as Date).toLocaleTimeString()}`
            }
          />
        ))}
        {!(currentChurchEvent.length > 0) && !(currentActivity.length > 0) &&
          <Text>
            No Available Church Activities
          </Text>
        }
      </VStack>
    </VStack>
  );
};

export default Activity;
