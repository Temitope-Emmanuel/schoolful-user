import React from "react"
import {
    FormControl,Icon,FormLabel,
    FormErrorMessage,Input,
    InputGroup,InputRightElement, HStack
  } from "@chakra-ui/react";
import {Field,FieldProps} from "formik"
import {makeStyles,createStyles} from "@material-ui/core/styles"
import { MdModeEdit } from "react-icons/md";


const useStyles = makeStyles(theme =>(
  createStyles({
    inputContainer:{
        width:"100%",
        alignItems:"flex-start !important",
        "& > svg":{
            marginRight:"1rem"
        },
        "& label":{
            marginBottom:"0 !important",
            opacity:.85
        },
        "& input":{
            minWidth:"15rem"
        }
    }
  })
))



interface IProps {
    placeholder?:string;
    name:string;
    label?:string;
    showErrors?:boolean;
    primaryIcon?:any;
    secondaryIcon?:any;
}

const IconInput:React.FC<IProps> = ({placeholder,primaryIcon,secondaryIcon,showErrors = true,label,name}) => {  
    const classes = useStyles()
    
    return (
      <Field name={name}>
        {({ field, form }:FieldProps) => (
            <HStack className={classes.inputContainer}>
              {
                primaryIcon &&
                <Icon as={primaryIcon} boxSize={"2rem"} />
              }
                <FormControl id={name}
                  isInvalid={Boolean(form.touched[name]) && Boolean(form.errors[name])}
                >
                    <FormLabel>{label}</FormLabel>
                    <InputGroup>
                        <Input variant="flushed" 
                        {...field}
                        placeholder={placeholder} />
                        <InputRightElement children={<Icon boxSize="1.5rem" opacity={.8} as={secondaryIcon || MdModeEdit} />} />
                    </InputGroup>
                    {showErrors && form.touched[name]  && 
                      form.errors[name] &&
                        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                    }
                </FormControl>
            </HStack>
        )}
      </Field>
    );
  }


  export default React.memo(IconInput)