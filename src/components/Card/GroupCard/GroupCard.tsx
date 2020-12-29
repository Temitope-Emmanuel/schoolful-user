import React from "react"
import {Box,Flex,Heading,Skeleton,AvatarBadge,
    Text,Icon,Avatar} from "@chakra-ui/react"
import {RiGroupFill} from "react-icons/ri"



interface IProps {
    name:string;
    active:boolean;
    member:number;
    isLoaded:boolean;
    imgSrc?:string;
    [key:string]:any;
}

const GroupCard:React.FC<IProps> = ({name,active,imgSrc,isLoaded,member,...props}) => {

    return(
        <Skeleton width="100%" cursor="pointer" isLoaded={isLoaded}>
            <Flex shadow="0px 5px 10px #00000005" bgColor={active ? "primary" : "white" }
                align="center"
                borderRadius="4px" py="3" px="2" {...props} >
                <Avatar size="md" name={name} mr="2" bgColor="blue.100"
                    src={imgSrc}>
                    <AvatarBadge border={`2px solid`} borderColor={active ? "#383838" : "white"}
                        transform="translate(-32%,-4%)"
                        boxSize=".6em" bg="green.300" />
                </Avatar>
                <Box>
                    <Heading as="h4" color={active ? "white" : "black"}
                        fontSize="1.4rem" lineHeight="1" >
                        {name}
                    </Heading>
                    <Text fontSize=".75rem" color={active ? "white" : "black"}>
                        {active ? "Active" : "Inactive"}
                    </Text>
                    <Box opacity={.7}  color={active ? "white" : "black"}>
                        <Icon as={RiGroupFill}/>
                        <Box as="span">
                            {member} members
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </Skeleton>
    )
}

export default GroupCard