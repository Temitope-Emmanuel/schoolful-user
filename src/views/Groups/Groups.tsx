import React from "react"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"
import {VStack,Stack} from "@chakra-ui/react"
import {Button} from "components/Button"
import {GroupCard} from "components/Card"
import useParams from "utils/Params"
import useToast from "utils/Toast"
import {IGroup} from "core/models/Group"
import * as groupService from "core/services/group.service"


const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        flex:6
    }
}))


const Groups = () => {
    const defaultGroup:IGroup = {
        churchId:0,
        denominationId:0,
        description:"",
        isDeleted:false,
        memberCount:0,
        name:""
    }
    const classes = useStyles()
    const params = useParams()
    const toast = useToast()
    const [churchGroup,setChurchGroup] = React.useState<IGroup[]>(new Array(10).fill(defaultGroup))
    const [currentGroup,setCurrentGroup] = React.useState<number>(0)
    
    const handleSetCurrentGroup = (idx:number) => () => {
        setCurrentGroup(idx)
    }
    
    React.useEffect(() => {
        const getGroupsByChurch = async () => {
            await groupService.getGroupByChurch(params.churchId).then(payload => {
                setChurchGroup(payload.data)
            }).catch(err => {
                toast({
                    title:"Unable to get Church Group",
                    subtitle:`Error: ${err}`,
                    messageType:"error"
                })
            })
        }
        getGroupsByChurch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    return(
        <Stack direction={["column","row"]} className={classes.root}>
            <VStack justify="center" flex={4} bgColor="bgColor2">
                <Button>
                    Join Group
                </Button>
                <VStack spacing={10} width={{base:"95%",md:"80%"}}>
                    {churchGroup.map((item,idx) => (
                        <GroupCard isLoaded={Boolean(item.societyID)}
                         imgSrc={item.imageUrl} name={item.name} onClick={handleSetCurrentGroup(item.societyID || 0)}
                            active={currentGroup === item.societyID} member={item.memberCount} key={item.societyID || idx}
                        />
                    ))}
                </VStack>
            </VStack>
            <VStack bgColor="#F9F5F9" flex={6}>
                This is the chat handle
            </VStack>
        </Stack>
    )
}

export default Groups