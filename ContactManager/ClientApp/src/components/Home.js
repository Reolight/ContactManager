import React, {Component, useEffect, useState} from 'react';
import {
    Button,
    Dialog, Stack,
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
import dayjs from "dayjs";
import ContactEdit from "./ContactEdit";
import PopupAlert from "./PopupAlert";
import {produce} from "immer";
import {Add} from "@mui/icons-material";

export function Home(props){
    const [state, setState] = useState({ contacts: [], dialogOpened: false });
    const fullScreen = useMediaQuery(theme.breakpoint.down('md'));
    
    const [popups, setPopups] = useState({ notes: [] }); 
        
    function fetchData() {
        GetContact().then(data =>
            setState({ ...state, contacts: [...data] } ));
    }
    
    useEffect(fetchData, [props]);
    
    function deleteAction(id){
        DeleteContact.then(
            isOk => {
                if (isOk) addPopup(`Contact ${state.contacts.find(c => c.id === id).name} was deleted`, 'error');
                else addPopup(`Contact WASN'T deleted`);
            });
        fetchData();
    }
    
    return (
      <div>  
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
                          <TableCell component="th" scope="row">{dayjs(contact.birthDate).format("DDD.MM.YYYY")}</TableCell>
                          <TableCell component="th" scope="row">
                              {`+${contact.mobilePhone.slice(0, 2)}(${contact.mobilePhone.slice(3,4)}) ${contact.mobilePhone.slice(5, 7)}-${contact.mobilePhone.slice(8, 9)}-${contact.mobilePhone.slice(10,11)}`}
                          </TableCell>
                          <TableCell component="th" scope="row">
                              <Stack direction={"row"} space={1.5} >
                                  <Button onClick={() => setState({...state, dialogOpened: true, edit: contact })} 
                                          disabled={state.dialogOpened}
                                  >
                                      <EditIcon/>
                                  </Button>
                                  <Button onClick={() => deleteAction(id)} disabled={state.dialogOpened}>
                                      <DeleteIcon/>
                                  </Button>
                              </Stack>
                          </TableCell>
                      </TableRow>);
                    }) }
                </TableBody>
            </Table>
        </TableContainer>
          <Stack direction={"row"} space={2} justifyContent={"center"}>
              <Button variant={"contained"} disabled={state.dialogOpened} color={"primary"}
                      onClick={() => setState({...state, dialogOpened: true})}
              >
                  Create
              </Button>
          </Stack>
        <Dialog 
            open={state.dialogOpened}
            fullScreen={fullScreen}
        >
            <ContactEdit 
                contact={edit in state? state.edit : undefined}
                backHook={() => setState({...state, dialogOpened: false })}
                savedHook={(message) => addPopup(message, 'success')}
            />
        </Dialog>

          {popups.map(popup => <PopupAlert 
              key={popup.key}
              message={popup.message}
              severuity={popup.severity}
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
}