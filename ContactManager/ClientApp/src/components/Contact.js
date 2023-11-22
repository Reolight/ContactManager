import {Button, TableCell, TableRow} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import {useState} from "react";

export default function Contact(props){
    const { id, name, birthDate, jobTitle, mobilePhone, editCallback, deleteCallback } = props;
    
    const [state, setState] = useState( {})
}