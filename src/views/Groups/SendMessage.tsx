import React from "react"
import {Box} from "@material-ui/core"
import {createStyles,makeStyles} from "@material-ui/core/styles"
import {GoPlus} from "react-icons/go"
import {TextInput} from "components/Input"
import {FormikProps,Formik} from "formik"
import {HubConnection} from "@aspnet/signalr"
import {IGroup} from "core/models/Group"
import useToast from "utils/Toast"
import {AppState} from "store"
import {useSelector} from "react-redux"
import {AiOutlineSend} from "react-icons/ai"
import TouchRipple from "@material-ui/core/ButtonBase";
import {VscLoading} from "react-icons/vsc"
import * as Yup from "yup"

const useStyles = makeStyles((theme) => createStyles({
    root:{
        boxShadow:"0px 0px 6px #00000029",
        borderRadius:"2.5px",
        display:"flex",
        backgroundColor:"white",
        alignItems:"center",
        width:"85%",
        padding:theme.spacing(2),
        "& svg":{
            fontSize:"1.75rem"
        },
        "& svg:first-child":{
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
    },
    rotate:{
        animation:"rotation 2s infinite linear"
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
    const currentUser = useSelector((state:AppState) => state.system.currentUser)
    const toast = useToast()

    const handleSubmit = async (values:messageForm,{...actions}:any) => {
        try{
            actions.setSubmitting(true)
            const newMessage = {
                groupId:societyID,
                groupName:name,
                when:(new Date()).toJSON() as any,
                text:values.message,
                personId:currentUser.id
            }
            connection.send("SendGroupMessage",newMessage)
            actions.setSubmitting(false)
            actions.resetForm()
            // toast({
            //     messageType:"info",
            //     subtitle:"Message Sent successful",
            //     title:""
            // })
        }catch(err){
            actions.setSubmitting(false)
            toast({
                messageType:"error",
                title:"Something went wrong while Sending Message",
                subtitle:`Error:${err}`
            })
        }
    }

    const validationScheme = Yup.object({
        message:Yup.string().required()
    })

    return(
        <Box className={classes.root}>
            <Formik initialValues={initialValues} validationSchema={validationScheme}
             onSubmit={handleSubmit}>
                {(formikProps:FormikProps<messageForm>) => (
                    <>
                        <GoPlus/>
                        <TextInput name="message" placeholder="Write a message"
                        />
                        <TouchRipple 
                            disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                            onClick={formikProps.handleSubmit as any}>
                            {formikProps.isSubmitting ? <VscLoading className={classes.rotate} /> : <AiOutlineSend/>}
                        </TouchRipple>
                    </>
                )}
            </Formik>
        </Box>
    )
}

export default SendMessage