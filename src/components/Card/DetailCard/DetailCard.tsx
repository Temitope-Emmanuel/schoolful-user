import React from "react"
import { VStack, Skeleton, HStack, Avatar, Text, Heading } from "@chakra-ui/react"

interface IDetailProps {
    image?: string;
    title: string;
    smallText?: string;
    subtitle?: string;
    timing?: string
    body?: string;
    isLoaded: boolean
}

const DetailCard: React.FC<IDetailProps> = ({ image, isLoaded = true, title, children, timing, smallText, subtitle, body }) => (
    // <Skeleton isLoaded={isLoaded} maxWidth="25rem" >
    <Skeleton isLoaded={isLoaded} >
        <VStack spacing={4}>
            <HStack flex={1} width="100%">
                {
                    image &&
                    <Avatar
                        size="md" name="Temitope Emmanuel"
                        src={image} />
                }
                <VStack mr="auto" align="flex-start" width="100%" >
                    <Heading as="h5" size="sm" >
                        {title}
                    </Heading>
                    {smallText &&
                        <Text opacity={.7}>
                            {smallText}
                        </Text>
                    }
                </VStack>
                {timing &&
                    <Text opacity={.5}>
                        {timing}
                    </Text>
                }
            </HStack>
            <VStack alignSelf="flex-start" align="flex-start">
                {subtitle &&
                    <Heading as="h6" size="xs" >
                        {subtitle}
                    </Heading>
                }
                <Text textAlign={["center","left"]}>
                    {body}
                </Text>
            </VStack>
            {children}
        </VStack>
    </Skeleton>
)


export default DetailCard