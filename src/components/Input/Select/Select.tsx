import React from "react"
import {
    FormControl,
    Select,
    FormLabel,
    FormErrorMessage,
  } from "@chakra-ui/react";
  import {Field,FieldProps} from "formik"


interface IProps {
    placeholder:string;
    className?:any;
    name:string;
    label?:string;
    func?:any;
    val?:any;
    [key:string]:any;
}

const InputComponent:React.FC<IProps> = ({placeholder,className,label,val = 0,name,func,children,...props}) => {
    React.useEffect(() => {
      if(func){
        func(val)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[val])
    return (
      <Field name={name}>
        {({ field, form }:FieldProps) => {
          return(
            <FormControl my={["2"]} className={className}
            isInvalid={Boolean(form.touched[name]) && Boolean(form.errors[name])} {...props} >
              { label  && <FormLabel htmlFor={name} fontWeight="500" color="primary">{label}</FormLabel>}
              
              <Select size="md" alignSelf="center" id={name} mx="auto" {...field}
                width={["85%","auto"]} placeholder={placeholder}>
                  {children}
              </Select>
              {
                form.touched[name]  && 
              form.errors[name] &&
                <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
               }
            </FormControl>
          )
        }}
      </Field>
    );
  }


  export default InputComponent