import React from "react"
import {makeStyles,createStyles, Box} from "@material-ui/core"
import {Text} from "@chakra-ui/react"
import { useSelector } from "react-redux"
import { AppState } from "store"
import { useHistory } from "react-router"
import useParams from "utils/Params"

const useStyles = makeStyles((theme) => createStyles({
    root:{

    }
}))


const LiveStream = () => {
    const classes = useStyles()
    const params = useParams()
    const currentStream = useSelector((state:AppState) => state.livestream.currentStream)
    const history = useHistory()

    console.log({currentStream})

    // React.useEffect(() => {
    //     if(!currentStream.liveBroadcastID){
    //          history.push(`/church/${params.churchId}/home`)
    //     }
    // },[currentStream])

    return(
        <Box className={classes.root}>
            <iframe
                width="853"
                height="480"
                src={`https://www.youtube.com/embed/${currentStream.liveBroadcastID}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentStream.title}
            />
            
        </Box>
    )
}

export default LiveStream