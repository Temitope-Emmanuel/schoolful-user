import React from "react"
import {Link} from "react-router-dom"
import {Flex,Text} from "@chakra-ui/react"
import {MainLoginLayout} from "layouts/MainLoginLayout"
import {ResetPassword as ResetPasswordComponent} from "components/Forms"


const ResetPassword = () => {
   
   return(
        <MainLoginLayout showLogo={true}>
            <Flex alignSelf="center" mx="auto"
                justifyContent="center" alignItems={["center", "flex-start"]}
                flexDirection="column" px={{ sm: "3" }} flex={[1, 3]} >    
            <ResetPasswordComponent/>
                        <Text textStyle="h6" >Already have an account? &nbsp;
                    <Link to="/login">
                        Login here
                    </Link>
                        </Text>
            </Flex>
        </MainLoginLayout>
    )
}


export default ResetPassword