import React from "react"
import {Link,useLocation} from "react-router-dom"
import {Flex,Text} from "@chakra-ui/react"
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
                        <Text whiteSpace="nowrap" >Don't have an account? &nbsp;
                            <a href="localhost:3000/signup/member">
                                <Text color="primary">
                                    Sign Up here
                                </Text>
                            </a>
                        </Text>
                        :
                        <Text textStyle="h6" >Already have an account? &nbsp;
                    <Link to="localhost:3001/login">
                        Login here
                    </Link>
                        </Text>
                }
            </Flex>
        </MainLoginLayout>
    )
}


export default Login