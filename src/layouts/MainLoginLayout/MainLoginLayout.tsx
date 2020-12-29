import React from "react"
import {useHistory} from "react-router-dom"
import {Flex,Box, Icon, IconButton} from "@chakra-ui/react"
import {BibleImage2x} from "assets/images"
import {Logo} from "components/Logo"
import { CgCloseO } from "react-icons/cg"

interface IProps {
    children:any;
    showLogo:boolean
}

const MainLoginLayout:React.FC<IProps> = ({children,showLogo}) => {
    const history = useHistory()
    const goBack = () => {
        history.goBack()
    }
    
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
            <IconButton aria-label="close-btn" bgColor="transparent" onClick={goBack} icon={
                <Icon as={CgCloseO} color="#383838"
                 opacity={.5} boxSize="2rem"  />
            } />
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