import React, {useState} from 'react';
import './App.css';
import axios from "axios";
import useAsyncEffect from "use-async-effect";

function App() {

    const [users, setUsers] = useState([]);


    const getUsers = async () => {
        const response = await axios.get(process.env.REACT_APP_API_URL! + '/users', {
            auth: {
                username: 'admin',
                password: 'password'
            }
        })
        setUsers(response.data.results)
    }

    useAsyncEffect(getUsers);

    return (
        <div className="App">
            {users.map(user=>(
                <div>
                    {user['username']}
                </div>
            ))}
        </div>
    );
}

export default App;
