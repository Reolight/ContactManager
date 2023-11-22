export async function GetContact(id){
    const response = await fetch(id? `Contact/${id}` : "Contact");
    if (response.ok) {
        return await response.json();
    }
    
    return await response.error();
}

export async function PostContact(data){
    const response = await fetch("Contact", 
        {
            method: "post", 
            headers: { 
                "Content-Type": "application-json"
            },
            redirect: "follow",
            body: JSON.stringify(data)
        });
    return response.json();
}

export async function UpdateContact(id, data){
    const response = await fetch(`Contact/${id}`,
        {
            method: "put",
            headers: {
                "Content-Type": "application/json"
            },
            
            body: JSON.stringify(data)
        });
    return response.json()
}

export async function DeleteContact(id){
    const response = await fetch(`Contact/${id}`, { method: "delete"});
    return response.ok;
}
