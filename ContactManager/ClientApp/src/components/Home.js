import React, {useEffect, useState} from 'react';
import {
    Button,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useMediaQuery
} from "@mui/material";
import {DeleteContact, GetContact} from "../helpers/backfetch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContactEdit from "./ContactEdit";
import PopupAlert from "./PopupAlert";
import {produce} from "immer";

export function Home(props){
    const [state, setState] = useState({ contacts: [], dialogOpened: false });
    const [popups, setPopups] = useState({ notes: [] });
    
    const fullScreen = useMediaQuery('(min-width:600px)');
        
    // fetch data is called when page opens or data changes; 
    // when data changes, called with close === true to close the dialog;
    // N.B.: All code with setState + produce looks like state mutation but it isn't: state changed without mutations by Immer
    //      [Immer is one of dependencies of Redux, btw]
    function fetchData(close = false) {
        GetContact().then(data =>
            setState(produce(draft => {
                draft.contacts = [...data];
                if (!close)
                    return draft
                draft.dialogOpened = false;
                if ('edit' in draft)
                    delete draft.edit;
                return draft;
            } ))
        );
    }
    
    useEffect(fetchData, [props]);
    
    function deleteAction(id){
        DeleteContact(id).then(
            isOk => {
                if (isOk) addPopup(`Contact ${state.contacts.find(c => c.id === id).name} was deleted`, 'error');
                else addPopup(`Contact WASN'T deleted`, 'error');
                fetchData();
            });
    }
    
    return (
      <div>
          <Stack direction={"row"} space={2} justifyContent={"center"} marginY={5}>
              <Button variant={"contained"} color={"primary"}
                      onClick={() => setState({...state, dialogOpened: true})}
              >
                  Create
              </Button>
          </Stack>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Job title</TableCell>
                        <TableCell>Birth date</TableCell>
                        <TableCell>Mobile phone</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {state.contacts.map(contact =>{
                      return (<TableRow key={contact.id}>
                          <TableCell component="th" scope="row">{contact.name}</TableCell>
                          <TableCell component="th" scope="row">{contact.jobTitle}</TableCell>
                          <TableCell component="th" scope="row">{contact.birthDate}</TableCell>
                          <TableCell component="th" scope="row">
                              {`+375(${contact.mobilePhone.slice(0,2)}) ${contact.mobilePhone.slice(2, 5)}-${contact.mobilePhone.slice(5, 7)}-${contact.mobilePhone.slice(7,9)}`}
                          </TableCell>
                          <TableCell component="th" scope="row">
                              <Stack direction={"row"} space={1.5} >
                                  <Button onClick={() => setState({...state, dialogOpened: true, edit: contact })}>
                                      <EditIcon/>
                                  </Button>
                                  <Button onClick={() => deleteAction(contact.id)}>
                                      <DeleteIcon/>
                                  </Button>
                              </Stack>
                          </TableCell>
                      </TableRow>);
                    }) }
                </TableBody>
            </Table>
        </TableContainer>
          
        {state.dialogOpened && <ContactEdit
            open={state.dialogOpened}
            fullScreen={fullScreen}    
            contact={'edit' in state? state.edit : undefined}
            backHook={() => closeDialog()}
            
            savedHook={(message, severity) => {
                addPopup(message, !!severity ? severity : 'success');
                // close dialog, if crated/updated successfully
                if (!severity) {
                    fetchData(true);
                }
            }}
        />}
        
          {popups.notes.map(popup => <PopupAlert 
              key={popup.key}
              keyProp={popup.key}
              
              message={popup.message}
              severity={popup.severity}
              deleteHook={deletePopup}
          />)}
      </div>
    );
    
    function deletePopup(key) {
        setPopups({ notes: popups.notes.filter(pp => pp.key !== key)})
    }
    
    function addPopup(message, severity) {
        setPopups(produce(draftState => {
            draftState.notes.push({ key: Date.now(), message: message, severity: severity });
            return draftState;
        }))
    }
    
    function closeDialog(){
        setState(produce(draft =>
        {
            draft.dialogOpened = false;
            if ('edit' in draft)
                delete draft.edit;
            return draft;
        }))
    }
}