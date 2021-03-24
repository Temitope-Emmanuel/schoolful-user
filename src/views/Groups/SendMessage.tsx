import React from "react"
import {Box} from "@material-ui/core"
import {createStyles,makeStyles,Theme} from "@material-ui/core/styles"
import {GoPlus} from "react-icons/go"
import {TextInput} from "components/Input"
import {FaMicrophone} from "react-icons/fa"
import {FormikProps,Formik} from "formik"
import {HubConnection} from "@aspnet/signalr"
import {IGroup} from "core/models/Group"
import useToast from "utils/Toast"
import {sendMessageToGroup} from "core/services/chat.service"


const useStyles = makeStyles((theme) => createStyles({
    root:{
        boxShadow:"0px 0px 6px #00000029",
        borderRadius:"2.5px",
        display:"flex",
        backgroundColor:"white",
        alignItems:"center",
        width:"85%",
        padding:theme.spacing(2),
        "& > svg":{
            fontSize:"1.75rem"
        },
        "& > svg:first-child":{
            color:"#B603C9"
        },
        "& > *:nth-child(2)":{
            margin:theme.spacing(0,3),
            "& input":{
                borderWidth:"0",
                borderRadius:"0",
                borderBottomWidth:"1px",
                borderBottomColor:"black"
            }
        }
    }
}))




const initialValues = {
    message:""
}

type messageForm = typeof initialValues

interface IProps {
    connection:HubConnection;
    currentGroupDetail:Required<Pick<IGroup,"name"|"societyID">>
}

const SendMessage:React.FC<IProps> = ({connection,currentGroupDetail:{name,societyID}}) => {
    const classes = useStyles()
    const toast = useToast()
    const handleSubmit = async (values:messageForm,{...actions}:any) => {
        try{
            actions.setSubmitting(true)
            // const response = await connection.invoke("sendMessage",{
            //     id:0,
            //     groupId:societyID,
            //     groupName:name,
            //     when:(new Date()).toJSON(),
            //     text:values.message
            // })
            const response = await sendMessageToGroup({
                    id:0,
                    groupId:societyID,
                    groupName:name,
                    when:(new Date()).toJSON() as any,
                    text:values.message
                })
                console.log("this is the response",response)
            actions.setSubmitting(true)
        }catch(err){
            actions.setSubmitting(true)
            toast({
                messageType:"error",
                title:"Something went wrong while Sending Message",
                subtitle:`Error:${err}`
            })
        }
    }
    const handleKeyPress = (e:React.SyntheticEvent<HTMLInputElement>) => {
        console.log(e)
    }
    return(
        <Box className={classes.root}>
            <GoPlus/>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} >
                {(formikProps:FormikProps<messageForm>) => (
                    <TextInput name="message" placeholder="Write a message" onKeyPress={handleKeyPress} />
                )}
            </Formik>
            <FaMicrophone/>
        </Box>
    )
}

export default SendMessage