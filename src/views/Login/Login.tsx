import React from "react"
import {Link} from "react-router-dom"
import {Flex,HStack,Text} from "@chakra-ui/react"
import {MainLoginLayout} from "layouts/MainLoginLayout"
import {Login as LoginComponent} from "components/Forms"


const Login = () => {
   
   return(
        <MainLoginLayout showLogo={true}>
            <Flex alignSelf="center" mx="auto"
                justifyContent="center" alignItems={["center", "flex-start"]}
                flexDirection="column" pr={{ sm: "3" }} flex={[1, 3]} >
            <LoginComponent/>
                    <HStack opacity={.66}>
                        <Text fontSize="1.125rem" whiteSpace="nowrap" >Don't have an account?
                        </Text>
                            <Text fontSize="1.125rem" color="primary" textDecoration="underline">
                                <Link to="/signup/member">
                                        Sign Up here
                                </Link>
                            </Text>
                    </HStack>
            </Flex>
        </MainLoginLayout>
    )
}


export default Login