import React from "react"
import {Link as RouterLink } from "react-router-dom"
import {Link as ChakraLink} from "@chakra-ui/react"



interface ILink {
    to:string;
    makePurple?:boolean;
    color?:string;
    children:React.ReactNode;
    [key:string]:any
}

const Link:React.FC<ILink> = ({to,color,makePurple,children,...props}) => {
    return(
        <RouterLink to={to}>
            <ChakraLink textDecoration="underline" color={color || "primary"} {...props}>
                {children}
            </ChakraLink>
            </RouterLink>
    )
}


export default Link