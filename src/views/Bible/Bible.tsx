import React from "react"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"
import {VStack,HStack,StackDivider,Text,Select} from "@chakra-ui/react"


const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        flex:6,
        "& select":{
            border:"none",
            fontSize:"1.3rem",
            marginTight:"2rem",
            letterSpacing:0
        },
        "& p":{
            fontSize:"1.3rem"
        },
        "& > select:first-child":{
            marginRight:theme.spacing(8)
        },
        "& > div:first-child":{
            width:"100%",
            "& > div:first-child":{
                width:"100%",
                justifyContent:"space-around"
            },
        },
    }
}))


const Bible = () => {
    const classes = useStyles()

    return(
        <VStack className={classes.root}>
            <VStack width={"95%"} alignSelf="flex-end"
                align="flex-end"
                divider={<StackDivider my={10} borderColor="gray.200" />}>
                <HStack>
                    <HStack>
                        <Select mr={10} color="tertiary">
                            <option>
                                Genesis 1
                            </option>
                        </Select>
                        <Select color="tertiary" >
                            <option>
                                KJV
                            </option>
                        </Select>
                    </HStack>
                    <Text>
                        Aa
                    </Text>
                </HStack>
            <VStack>

            </VStack>
            </VStack>
        </VStack>
    )
}

export default Bible