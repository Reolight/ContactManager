import * as React from 'react';
import {useEffect, useState} from 'react'
import { PostContact, UpdateContact } from "../helpers/backfetch";
import dayjs from "dayjs";
import {produce} from "immer";
import {maxLengthRule, minLengthRule} from "../helpers/rules";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import {IMaskInput} from "react-imask";
import {DateField, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

const contactRules = {
    name: {
        rules: [...maxLengthRule(32, "name"), ...minLengthRule(2, "name")],
    },
    mobilePhone: {
        rules: [...maxLengthRule(9), ...minLengthRule(9),
            {
                check: (str) => /^(17|29|33|44)/.test(str),
                fail: "Unknown operator code (only 17, 29, 33 and 44 are available)"
            }],
    },
    jobTitle: {
        rules: [...maxLengthRule(32, "job title"), ...minLengthRule(2, "job title")],
    },
    birthDate: {
        rules: [{
            check: (date) => dayjs().diff(date, "years") >= 16,
            fail: "Must be older 16"
        }],
        convert: (str) => dayjs(str, "DD.MM.YYYY")
    }
}

const MobilePhoneMask = React.forwardRef(function MobilePhoneMask(props, ref)
{
    const {onChange, ...other} = props;
    return (
        <IMaskInput 
            {...other} 
            mask="+375(00) 000-00-00"
            unmask={true}
            inputRef={ref}
            onAccept={value => onChange({target: {name: props.name, value }}) }
            overwrite
        />
    );
});

export default function ContactEdit(props){
    
    const [state, setState] = useState({
        isNew: !props.contact,
        isPosting: false,
        contact: !props.contact ?
            {
                name: "",
                mobilePhone: "",
                jobTitle: "",
                birthDate: dayjs().subtract(16, "years")
            } : {...props.contact, birthDate: dayjs(props.contact.birthDate, "DD.MM.YYYY") },
        errors: {}
    });
    
    // onChange func
    function input(attributeName, value){
        // if field has converter, value must be converted
        const convertedValue = 'convert' in contactRules[attributeName]
            ? contactRules[attributeName].convert(value)
            : value;
        // validation
        const error = contactRules[attributeName].rules.reduce((errs, rule) => {
            if (!rule.check(convertedValue))
                errs.push(rule.fail);
            return errs;
        }, []).join(", ");
        
        setState(produce(draftState => {
            // changing value
            draftState.contact[attributeName] = convertedValue;
            // dealing with errors
            if (error)
                draftState.errors = { [attributeName]: error}
            else if ([attributeName] in draftState.errors)
                delete draftState.errors[attributeName];
        }));
    }
    
    function getErrors(attributeName){
        return [attributeName] in state.errors
            ? { error: true, helperText: state.errors[attributeName] }
            : { }
    }
    
    useEffect(() => {
        console.log("state.isPosting effect");
        if (!state.isPosting)
            return;
        
        const promise = state.isNew ? PostContact(state.contact) : UpdateContact(state.contact.id, state.contact)
        promise.then(resp => {
            if (resp.ok)
                props.savedHook(`Contact "${state.contact.name}" ${state.isNew? "created" : "updated"}`);
            else
                props.savedHook(`Save failed. Code: ${resp.status}`, 'error');
        });
     
        setState(produce(draft => { draft.isPosting = false; return draft; }));
    }, [state.isPosting])
    
    function Save(){
        setState({...state, isPosting: true})        
    }
    
    return(<React.Fragment>
        <Dialog open={!!(props.open && state.contact)}
                fullscreen={props.fullScreen}
                aria-labelledby={"dialog-title"}
        >
            <DialogTitle id={"dialog-title"}>
                {state.isNew? "Create": "Edit"} contact
            </DialogTitle>
            <DialogContent>
                <Stack direction={"column"} spacing={2} margin={2} >
                    <TextField required
                               label={"Name"}
                               value={state.contact.name}
                               onChange={(e) => input("name", e.target.value)}
                               {...getErrors("name")}
                    />
                    <TextField required
                               label={"Job title"}
                               value={state.contact.jobTitle}
                               onChange={(e) => input("jobTitle", e.target.value)}
                               {...getErrors("jobTitle")}
                    />
                    <TextField required
                               label={"Mobile phone"}
                               value={state.contact.mobilePhone}
                               onChange={(e) => input("mobilePhone", e.target.value)}
                               InputProps={{ inputComponent: MobilePhoneMask }}
                               {...getErrors("mobilePhone")}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en"} >
                        <DateField required label={"Birth date"}
                                   value={state.contact.birthDate}
                                   onChange={(val) => input("birthDate", val)}
                                   {...getErrors("birthDate")}
                        />
                    </LocalizationProvider>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button disabled={Object.keys(state.errors).length > 0 // true, if there are errors 
                    || !Object.keys(state.contact).every(key => state.contact[key]) // true, if any of the field is empty
                    || state.isPosting} 
                        onClick={() => Save()}
                >
                    {state.isNew? "Create" : "Update"}
                </Button>
                <Button onClick={props.backHook}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>)
}