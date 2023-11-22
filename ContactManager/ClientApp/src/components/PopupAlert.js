import {useState} from "react";
import {Alert, Snackbar} from "@mui/material";

export default function PopupAlert(props){
    const {key, message, severity, deleteHook } = props;
    const [open, setOpen] = useState(true)

    function handleClose(){
        setOpen(false);
        setTimeout(() => deleteHook(key), 1500);
    }
    
    return(
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={() => handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}