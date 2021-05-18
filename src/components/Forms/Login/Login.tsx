import React from "react"
import {useHistory} from "react-router-dom"
import {useDispatch} from "react-redux"
import {Box,Heading,FormHelperText,FormControl,Text} from "@chakra-ui/react"
import {Button} from "components/Button"
import {useSelector} from "react-redux"
// import {AppState} from "store"
// eslint-disable-next-line
import {Formik,FormikProps} from "formik"
import {TextInput,PasswordInput} from "components/Input"
import useToast from "utils/Toast"
import {login} from "store/System/actions"
import {AppState} from "store"
import * as Yup from "yup"


interface IForm {
    phoneNumber: number | null;
    password: string;
}


const Signup = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const isAuthenticated = useSelector((state:AppState) => state.system.isAuthenticated)
    const currentUser = useSelector((state:AppState) => state.system.currentUser)
    const toast = useToast()
    const moveToChangePassword = () => {
        history.push("/reset?password")
    }

    const validationScheme = Yup.object({
        phoneNumber: Yup.number().required(),
        password: Yup.string().min(5, "Password is too short").required(),
    })

    
    const handleSubmit = (values: IForm, actions : any) => {
        actions.setSubmitting(true)
        const loginPromise = Promise.resolve(dispatch(login(values.phoneNumber as number,values.password,toast)))
        loginPromise.then(() => {
            actions.setSubmitting(false)
        })
    }
    const initialValue = {
        phoneNumber: null,
        password: ""
    }

    return (
        <>
        <Text textStyle="h3" mb={"6"} textAlign={["center", "left"]}>
            Login
        </Text>   
        <Formik initialValues={initialValue}
            validationSchema={validationScheme}
            onSubmit={handleSubmit}
        >
            {(formikProps: FormikProps<IForm>) => {
                return (
                    <Box my={["4"]} width={["90vw", "100%"]} maxWidth="sm" >
                        <TextInput name="phoneNumber" placeholder="Phone number" />
                        <PasswordInput mt="6" name="password" type="password"
                         placeholder="Password" />
                        <FormControl>
                            <FormHelperText cursor="pointer" mb="3"
                             ml="2" onClick={moveToChangePassword}>
                                Forgot Password
                            </FormHelperText>
                        </FormControl>
                        <Button
                         disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                        loadingText={`Login User`} color="white" maxWidth="sm"
                        width={["90vw", "100%"]} isLoading={formikProps.isSubmitting}
                        onClick={(formikProps.handleSubmit as any)} backgroundColor="primary" my="3">
                            { formikProps.isValid ? "Login" : "Please Fill Form"}
                        </Button>
                    </Box>
                )
            }}
        </Formik>
        </>
        )
}

export default Signup