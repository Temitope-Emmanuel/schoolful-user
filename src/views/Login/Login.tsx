import React from "react"
import {Link,useLocation} from "react-router-dom"
import {Flex,HStack,Text} from "@chakra-ui/react"
import {MainLoginLayout} from "layouts/MainLoginLayout"
import {Login as LoginComponent,ResetPassword} from "components/Forms"


const Login = () => {
   const location = useLocation()
   const isLogin = location.pathname === "/login"
   
   return(
        <MainLoginLayout showLogo={true}>
            <Flex alignSelf="center" mx="auto"
                justifyContent="center" alignItems={["center", "flex-start"]}
                flexDirection="column" px={{ sm: "3" }} flex={[1, 3]} >
                {isLogin ? 
                
            <LoginComponent/>
            :
            <ResetPassword/>
                }
                {
                    isLogin ?
                    <HStack>
                        <Text whiteSpace="nowrap" >Don't have an account?
                        </Text>
                            <Text color="primary" textDecoration="underline">
                                <Link to="/signup/member">
                                        Sign Up here
                                </Link>
                            </Text>
                    </HStack>
                        :
                        <Text textStyle="h6" >Already have an account? &nbsp;
                    <Link to="/login">
                        Login here
                    </Link>
                        </Text>
                }
            </Flex>
        </MainLoginLayout>
    )
}


export default Login