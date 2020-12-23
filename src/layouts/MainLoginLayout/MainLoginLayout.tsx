import React from "react"
import {Flex,Box} from "@chakra-ui/react"
import {BibleImage2x} from "assets/images"
import {Logo} from "components/Logo"

interface IProps {
    children:any;
    showLogo:boolean
}

const MainLoginLayout:React.FC<IProps> = ({children,showLogo}) => {
    
    return(
        <Flex height="100vh" width="100vw">
            <Box flex={[0,2]} display={["none","block"]}
                backgroundImage={`url(${BibleImage2x})`}
                backgroundRepeat="no-repeat" backgroundPosition="center"
                height="100%" backgroundSize="cover"
            />
            <Flex position="relative" flex={[1,3]} pr={{sm:"5", md:"24"}}
             pt={{sm:"5", md:"16"}} ml={[0,"2","32"]} flexDirection={["column","row-reverse"]}
            >   
                {
                    showLogo && 
                <Box position="absolute" display={["none","block"]} left="0" top="7.5em" >
                    <Logo white={false} />
                </Box>
                }
                {children}
            </Flex>
        </Flex>
    )
}


export default MainLoginLayout