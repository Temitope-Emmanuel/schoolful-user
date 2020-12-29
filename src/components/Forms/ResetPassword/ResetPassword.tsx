import React from "react"
import {Box,useDisclosure,Heading,Text, Icon,
        Link, ModalBody, ModalContent, ModalFooter} from "@chakra-ui/react"
import {Button} from "components/Button"
// eslint-disable-next-line
import {Formik,FormikValues,FormikProps} from "formik"
import {TextInput} from "components/Input"
import {Dialog} from "components/Dialog"
import * as Yup from "yup"



interface IForm {
    currentPassword:string;
    newPassword:string
}



export const ResetEmail = () => (
    <ModalContent>
        <ModalBody display="flex" flexDirection="column"
            justifyContent="center" alignItems="center">
            <Icon name="check-circle" boxSize="24px" color="primary" />
            <Heading textAlign="center" my="4" color="primary">
                Please check your email
            </Heading>
            <Text textAlign="center">
                An email has been sent to your
                inbox with a link to reset your password
            </Text>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="center" >
            <Link to="/dashboard" >
                Resend Link
            </Link>
        </ModalFooter>
    </ModalContent>
)


const ResetPassword = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    return (
        <>
        <Dialog open={isOpen} close={onClose}>
            <ResetEmail/>
        </Dialog>
            <Heading mt={{md:"-5rem"}} mb={{md:"3rem"}} textAlign={["center", "left"]}>
                Reset Password
            </Heading>        
            <Formik initialValues={{
            currentPassword:"",
            newPassword:""
            }}
                validationSchema={Yup.object({
                    email: Yup.string().email("Email is not valid").required(),
                    })}
                onSubmit={(values: FormikValues, { ...actions }: any) => {
                    console.log(actions)
                    actions.setSubmitting(true)
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        actions.setSubmitting(false);
                        actions.resetForm()
                    }, 1000);
                }}
            >
                {(FormikProps: FormikProps<IForm>) => {
                    return (
                        <Box my={["4"]} width={["90vw", "100%"]} maxWidth="sm" >
                            <TextInput name="email" placeholder="email" />
                            {/* <TextInput name="password" placeholder="Confirm New Password" /> */}
                            <Button disabled={!FormikProps.dirty || !FormikProps.isValid}
                             width={["90vw", "100%"]} onClick={onOpen} my="6">
                                {FormikProps.isValid ? "Send Reset Email" : "Please Fill Form"}
                            </Button>
                        </Box>
                    )
                }}
            </Formik>
        </>
        )
}

export default ResetPassword