import React from  "react"
import DatePickerComponent from "react-date-picker"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"

const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
    },
    dateContainer: {
        borderColor: "2px solid black",
        color: "grey",
        "& > *": {
            padding: ".7rem 1.7rem !important",
            paddingLeft: ".4rem !important",
            borderRadius: "3px",
            "& select": {
                appearance: "none"
            }
        }
    }
}))


interface IProps {
    name:string;
    value:Date;
    onChange(arg:Date|Date[]):void;
    minDate?:Date;
}

const DatePicker:React.FC<IProps> = ({name,value,minDate,onChange}) => {
    const classes = useStyles()
    const currentDate = new Date()

    return(
            <DatePickerComponent name={name} format="MMM dd,y" calendarIcon={null} clearIcon={null}
            onChange={onChange} value={value}
            className={classes.dateContainer}
        />                                    
    )
}

export default DatePicker