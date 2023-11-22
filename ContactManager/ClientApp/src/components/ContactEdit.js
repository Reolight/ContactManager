import {useEffect, useState} from "react";
import { PostContact, UpdateContact } from "../helpers/backfetch";
import dayjs from "dayjs";
import {produce} from "immer";
import {maxLengthRule, minLengthRule} from "../helpers/rules";
import {Button, DialogActions, DialogTitle, Stack, TextField} from "@mui/material";
import DialogContext from "@mui/material/Dialog/DialogContext";
import {IMaskInput} from "react-imask";
import {DateField} from "@mui/x-date-pickers";

const contactRules = {
    name: {
        rules: [...maxLengthRule(32, "name"), ...minLengthRule(2, "name")],
    },
    mobilePhone: {
        rules: [...maxLengthRule(12), ...minLengthRule(12),
            {
                check: (str) => /(?<=375)(17|29|33|44)/.test(str),
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
            inputRef={ref}
            onAccept={value => onChange({target: {name: props.name, value }}) }
            overwrite
        />
    );
});

export default function ContactEdit(props){
    const { savedHook } = props;
    const [state, setState] = useState({
        isLoading: true, 
        isNew: props === undefined,
        isPosting: false,
        contact: undefined,
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
            if (rule.check(convertedValue))
                errs.push(rule.fail);
            return errs;
        }, []).join(", ");
        
        setState(produce(draftState => {
            // changing value
            draftState.contact[attributeName] = convertedValue;
            // dealing with errors
            if (error)
                draftState.errors = {...error}
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
        setState(produce(draftState => {
            draftState.isLoading = false;
            draftState.contact = props.contact === undefined ? 
            {
                name: "",
                mobilePhone: "",
                jobTitle: "",
                birthDate: dayjs()
            } : props.contact;
            
            return draftState;
        }));
    }, [props])
    
    function Save(){
        setState({...state, isPosting: true})
        if (state.isNew) {
            PostContact(state.contact)
                .then(() => {
                    savedHook(`Contact "${state.contact.name}" saved`);
                    setState({...state, isPosting: false});
                })
        }
        else {
            UpdateContact(state.contact.id, state.contact)
                .then(() => {
                    savedHook(`Contact "${state.contact.name}" updated`);
                    setState({...state, isPosting: false});
                });
        }
    }
    
    return(<>
            <DialogTitle>{state.isNew? "Create": "Edit"} contact</DialogTitle>
            <DialogContext>
                <Stack direction="column" space={2}>
                    <TextField required
                               value={state.content.name}
                               onChange={(e) => input("name", e.target.value)}
                               {...getErrors("name")}
                    />
                    <TextField required
                               value={state.content.jobTitle}
                               onChange={(e) => input("jobTitle", e.target.value)}
                               {...getErrors("jobTitle")}
                    />
                    <TextField required
                               value={state.content.mobilePhone}
                               onChange={(e) => input("mobilePhone", e.target.value)}
                               InputProps={{ inputComponent: MobilePhoneMask }}
                               {...getErrors("mobilePhone")}
                    />
                    <DateField required label={"Birth date"}
                               defaultDate={dayjs()}
                               value={state.contact.birthDate}
                               onChange={(val) => input("birthDate", val)}
                               {...getErrors("birthDate")}
                    />           
                </Stack>
            </DialogContext>
            <DialogActions>
                <Button disabled={state.isPosting} onClick={Save}>
                    {state.isNew? "Create" : "Update"}
                </Button>
                <Button onClick={props.backHook}>
                    Cancel
                </Button>
            </DialogActions>
        </>)
}