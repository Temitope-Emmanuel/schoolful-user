import React from "react"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"
import {VStack,HStack,StackDivider,Text,Select} from "@chakra-ui/react"
import {IBibleBook,IBibleChapter,IBibleVerses} from "core/models/Bible"
import {GetBibleBookChapters,GetBibleVerses,GetBibleByVersion} from "core/services/prayer.service"
import axios from "axios"
import useToast from "utils/Toast"
import {MessageType} from "core/enums/MessageType"
import {tertiary} from "theme/chakraTheme/palette"

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
            fontSize:"1.3rem",
            color:tertiary
        },
        "& > select:first-child":{
            marginRight:theme.spacing(8)
        },
        "& > div:first-child":{
            width:"100%",
            "& > div:first-child":{
                width:"100%",
                justifyContent:"space-around"
            }
        }
    },
    chapterContainer:{
        "& p":{
            fontSize:"1rem",
            letterSpacing:"0px"
        }
    }
}))


const Bible = () => {
    const bibleVersionList = [
        "KJV","AKJV","ASV","YLT","WEB"
    ]
    const defaultBook:IBibleBook = {
        abbreviation:"",
        direction:"",
        encoding:"",
        lang:"",
        language:"",
        name:"",
        number:1,
        sha:"",
        url:""
    }
    const defaultBibleVerses:IBibleVerses = {
        abbreviation:"",
        book_name:"",
        book_nr:1,
        chapter:0,
        direction:"",
        encoding:"",
        lang:"",
        language:"",
        name:"",
        translation:"",
        verses:[]
    }
    const classes = useStyles()
    const toast = useToast()
    // the version of the selected bible
    const [bibleVersion,setBibleVersion] = React.useState(bibleVersionList[0])
    // The current bible book
    const [currentBibleBook,setCurrentBookBible] = React.useState(defaultBook)
    // The current bible full book
    const [currentBook,setCurrentBook] = React.useState<IBibleVerses>(defaultBibleVerses)
    // the list of the bible books
    const [bible,setBible] = React.useState<IBibleBook[]>([])
    const [bibleChapter,setBibleChapter] = React.useState<IBibleChapter[]>([])
    const [currentChapter,setCurrentChapter] = React.useState(1)
    const cancelToken = axios.CancelToken.source()
    const handleCurrentBookBible = (e:React.SyntheticEvent<HTMLSelectElement>) => {
        setCurrentBookBible(bible.find(item => item.number === Number(e.currentTarget.value)) as IBibleBook)
    }
    const handleBibleVersion = (e:React.SyntheticEvent<HTMLSelectElement>) => {
        setBibleVersion(e.currentTarget.value)
    }
    const handleCurrentChapter = (e:React.SyntheticEvent<HTMLSelectElement>) => {
        setCurrentChapter(Number(e.currentTarget.value))
    }
    React.useEffect(() => {
        return () => {
            cancelToken.cancel()
        }
    },[])


    React.useEffect(() => {
        const GetBibleBookChapterApi = () => {
            GetBibleBookChapters(currentBook.book_nr,bibleVersion.toLowerCase(),cancelToken).then(payload => {
                setBibleChapter(payload.data)
            }).catch(err => {
                if(!axios.isCancel(err)){
                    toast({
                        title:"Unable to Load bible",
                        subtitle:`Error:${err}`,
                        messageType:MessageType.ERROR
                    })
                }
            })
        }
        GetBibleBookChapterApi()
    },[currentBook])

    React.useEffect(() => {
        const getChurchBook = () => {
            GetBibleByVersion(bibleVersion.toLowerCase(),cancelToken).then(payload => {
                const newBibleBook = payload.data.map(item => ({
                    abbreviation:item.abbreviation,
                    number:item.number,
                    name:item.name,
                    url:item.url
                }))
                setBible(newBibleBook)
            }).catch(err => {
                if(!axios.isCancel(err)){
                    toast({
                        title:"Unable to Load bible",
                        subtitle:`Error:${err}`,
                        messageType:MessageType.ERROR
                    })
                }
            })
        }
        getChurchBook()
    },[bibleVersion])

    React.useEffect(() => {
        const getBibleBookChapter = () => {
            GetBibleVerses(currentBibleBook.number,currentChapter,bibleVersion.toLowerCase(),cancelToken).then(payload => {
                setCurrentBook(payload.data)
            }).catch(err => {
                if(!axios.isCancel(err)){
                    toast({
                        title:"Unable to Load bible",
                        subtitle:`Error:${err}`,
                        messageType:MessageType.ERROR
                    })
                }
            })
        }
        getBibleBookChapter()
    },[currentChapter,currentBibleBook,bibleVersion])


    return(
        <VStack className={classes.root}>
            <VStack width={"95%"} alignSelf="flex-end"
                align="center"
                divider={<StackDivider my={10} borderColor="gray.200" />}>
                <HStack>
                    <HStack width="57%">
                        <Select onClick={handleCurrentBookBible} color="tertiary" >
                            {bible.map((item,idx) => (
                                <option value={item.number} key={item.number || idx} >
                                    {item.name}
                                </option>
                            ))}
                        </Select>
                        <Select w="45%" onClick={handleBibleVersion} color="tertiary">
                            {bibleVersionList.map((item,idx) => (
                                <option value={item} key={idx} >
                                    {item}
                                </option>
                            ))}
                        </Select>
                    </HStack>
                    <Select width="15%" onClick={handleCurrentChapter}>
                        {bibleChapter.map((item,idx) => (
                            <option value={item.chapter} key={item.chapter || idx} >
                                {item.chapter}
                            </option>
                        ))}
                    </Select>
                </HStack>
            <VStack maxW="xl" align="flex-start" className={classes.chapterContainer} >
                {currentBook.verses.map((item,idx) => (
                    <Text key={idx} dangerouslySetInnerHTML={{__html:`${item.verse}. ${item.text}`}} />
                ))}
            </VStack>
            </VStack>
        </VStack>
    )
}

export default Bible