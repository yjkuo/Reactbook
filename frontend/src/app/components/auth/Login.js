import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getProfile } from '../../API'
export default function Login({props}) {
    const navigate = useNavigate();
    const [username, setName] = useState("");
    const [password, setPassword] = useState("");
    const [invalid, setInvalid] = useState("");

    function handleSubmit(e) {
        e.preventDefault();  
        if (!username) setInvalid("Empty Username");
        else if (!password) setInvalid("Empty Password");
        else {
            login({ username: username, password: password })
            .then(res => res.json()).then(res => {
                if (res.auth) props.thirdParty(true);
                return getProfile();
            })
            .then(res => {
                props.updateUser(res);
                navigate("/main");
            })
            .catch(e => {
                setInvalid("Invalid User");
            });
        }
        
    }
    
    return (
        <div className="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
            <form onSubmit={handleSubmit}>
                <div className="container p-5 my-5 bg-dark text-white">
                <div className="mb-3">
                    <label htmlFor="fUsername" className="form-label">Username</label>
                    <input type="text" 
                        className="form-control" 
                        value={username}
                        onChange={ (e) => setName(e.target.value) }/>
                </div>
                <div className="mb-3">
                    <label htmlFor="fPassword" className="form-label">Password</label>
                    <input type="password" 
                        className="form-control"
                        value={password}
                        onChange={ (e) => setPassword(e.target.value) }/>
                    <small id="invalid" className="form-text text-danger">{invalid}</small>
                    <a href="http://localhost:3001/auth/google">
                    <button className="btn btn-danger mt-3" type="button">Sign in with Google</button>
                    </a>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                </div>
            </form> 
        </div>
    );
}