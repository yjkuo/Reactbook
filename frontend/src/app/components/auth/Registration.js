import React, { useState } from "react";
import "../../../App.css";
import { useNavigate } from "react-router-dom";
import { register, login, getProfile } from '../../API';

export default function Registration({props}) {
    const navigate = useNavigate();
    const [username, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");
    const [zip, setZip] = useState("");
    const [passwordc, setPasswordc] = useState("");
    const [err, setErr] = useState("");
    const [invalid, setInvalid] = useState("");
    

    function handleClear(e) {
        setName("");
        setPassword("");
        setEmail("");
        setPhone("");
        setDob("");
        setZip("");
        setPassword("");
        setPasswordc("");
        setErr("");
        setInvalid("");
    }

    function handleSubmit(e) {
        e.preventDefault();    
        
        let errMessage = "";
        if (!username.match(/^[a-z]+[a-z0-9]*$/i)) {
            errMessage += "Username can only be upper or lower case letters and numbers, but may not start with a number. ";
        }
        if (!email.match(/^\S+@\S+\.\S+$/)) {
            errMessage += "Please enter a valid email address. ";
        }

        if (!phone.match(/^\d\d\d-\d\d\d-\d\d\d\d$/)) {
            errMessage += "Please enter your phone number in the format 123-123-1234. ";
        }

        let today = new Date();
        const arr = dob.split("-");
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let age = today.getFullYear() - parseInt(arr[0]); 
        if (age < 18 || 
            (age === 18 && (month - parseInt(arr[1])) < 0) ||
            (age === 18 && ((month - parseInt(arr[1])) === 0) && (day - parseInt(arr[2]) < 0))) {
                errMessage += "Only individuals 18 years of age or older are allowed to register.";
            }
        
        if (!zip.match(/^\d\d\d\d\d$/)) {
            errMessage += "Please enter your zipcode in the format 12345. ";
        }

        if (passwordc !== password) {
            errMessage += "Password and password confirmation does not match. ";
        }
        
        if (errMessage.length === 0) {
            let date = new Date(dob);
            const regUser = {username: username, email: email, dob: date.getTime(), zipcode: zip, phone: phone, password: password};
            register(regUser)
            .then(res => {
                return login({ username: username, password: password });
            })
            .then(res => {
                return getProfile();
            })
            .then(res => {
                props.updateUser(res);
                navigate("/main");
            })
            .catch(e => {
                setInvalid("Username already exists!");
            });
            
            // if (props.users.filter(x => x.username === username).length === 0) {
            //     props.updateUser({id: username.length + 10, username: username});
            //     navigate("/main");
            // } else {
            //     setInvalid("Username already exists!");
            // }
            
        } else {
            setErr(errMessage);
        }
    }
    
    return (
        <div className="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">           
        <form onSubmit={handleSubmit}>
            <div className="container p-5 my-5 bg-dark text-white">
            <h2>Register</h2>
            {err ?
            <div className="alert alert-danger">
                <strong>Invalid Fields:</strong> {err}
            </div> :
             null
            }
            <div className="mb-3">
                <label htmlFor="facname">Username</label>
                <input type="text" className="form-control" name="acname" id="facname" placeholder="Account Name" required value={username}
                        onChange={ (e) => setName(e.target.value) } />
                <small className="form-text text-danger">{invalid}</small>
            </div>
            <div className="mb-3">
                <label htmlFor="fdname">Display Name (optional)</label>
                <input type="text" className="form-control" name="dname" id="fdname" placeholder="Display Name"/>
            </div>
            <div className="mb-3">
                <label htmlFor="femail">Email Address</label>
                <input type="email" className="form-control" name="email" id="femail" placeholder="Email Adress" required value={email}
                        onChange={ (e) => setEmail(e.target.value) }/>
            </div>
            <div className="mb-3">
                <label htmlFor="fphone">Phone Number</label>
                <input type="tel" className="form-control" name="phone" id="fphone" placeholder="123-123-1234" required value={phone}
                        onChange={ (e) => setPhone(e.target.value) }/>
            </div>
            <div className="mb-3">
                <label htmlFor="fbirth">Date of Birth</label>
                <input type="date" className="form-control" name="birth" id="fbirth" required value={dob}
                        onChange={ (e) => setDob(e.target.value) }/>
            </div>
            <div className="mb-3">
                <label htmlFor="fzip">Zipcode</label>
                <input type="text" className="form-control" name="zip" id="fzip" placeholder="12345" required 
                value={zip}
                onChange={ (e) => setZip(e.target.value) }/>
            </div>
            <div className="mb-3">
                <label htmlFor="fpasswd">Password</label>
                <input type="password" className="form-control" name="passwd" id="fpasswd" placeholder="Password" required 
                value={password}
                onChange={ (e) => setPassword(e.target.value) }/>
            </div>
            <div className="mb-3">
                <label htmlFor="fpasswdcf">Password Confirmation</label>
                <input type="password" className="form-control" name="passwdcf" id="fpasswdcf" placeholder="Confirm Password" required 
                value={passwordc}
                onChange={ (e) => setPasswordc(e.target.value) }/>
            </div>
            <div>
                <input type="submit" className="btn btn-primary" value="Submit"/>
                <input type="button" className="btn btn-secondary" value="Clear" onClick={(e) => handleClear(e)}/>
            </div>
            </div>
        </form>
        </div>
    );
}