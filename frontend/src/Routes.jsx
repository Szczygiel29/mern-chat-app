import Register from "./components/Register/Register";
import { UserContext } from "./UserContext";
import { useContext } from "react";
import Chat from './components/Chat/Chat'

export default function Routes() {
    const {username, id} = useContext(UserContext)

    if(username) {
        return <Chat/>;
    }
    
    return(
        <Register/>
    )
}