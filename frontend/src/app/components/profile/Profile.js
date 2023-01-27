import {Link} from "react-router-dom";
import React, {useState, useRef} from "react";
import {connect} from "react-redux";
import logo from "../../../assets/logo.svg"
import {thirdParty, updateInfo} from "../../reducers/actions"
import {updateAvatar, updateEmail, updateZipcode, updatePassword, updatePhone, unlinkAccount} from '../../API'

function Profile ({user, third, updateInfo, auth, thirdParty}) {
    const [username, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [zip, setZip] = useState("");
    const [err, setErr] = useState([]);
    const [img, setImg] = useState("");
    const inputRef = useRef(null);

    function handleSubmit(e) {
        e.preventDefault(); 
        if (!username && !email && !phone && !zip && !password) return;   
        let newInfo = {...user};

        let errMessages = [];
        if (username.length) {
            if (!username.match(/^[a-z]+[a-z0-9]*$/i)) {
                errMessages.push("Username can only be upper or lower case letters and numbers, but may not start with a number.");
            } else {
                newInfo["username"] = username;
                setName("");
            }
        }
        
        if (email.length) {
            if (!email.match(/^\S+@\S+\.\S+$/)) {
                errMessages.push("Please enter a valid email address.");
            } else {
                newInfo["email"] = email;
                (async () => {
                    await updateEmail(email);
                })();
                setEmail("");
            }
        }

        if (phone.length) {
            if (!phone.match(/^\d\d\d-\d\d\d-\d\d\d\d$/)) {
                errMessages.push("Please enter your phone number in the format 123-123-1234.");
            } else {
                newInfo["phone"] = phone;
                (async () => {
                    await updatePhone(phone);
                })();
                setPhone("");
            }
        }

        if (zip.length) { 
            if (!zip.match(/^\d\d\d\d\d$/)) {
                errMessages.push("Please enter your zipcode in the format 12345.");
            } else {
                newInfo["zipcode"] = zip;
                (async () => {
                    await updateZipcode(zip);
                })();
                setZip("");
            }
        }
        if(password.length) {
            // newInfo["password"] = password;
            (async () => {
                await updatePassword(password);
            })();
            setPassword("");
        }
        setErr(errMessages);
        updateInfo(newInfo);
        
        
    }
    
    function handleImageChange(e) {
        setImg(e.target.files[0]);
    }

    function handleUnlinkClick() {
        unlinkAccount().then(res => {
            thirdParty(false);
        });
    }

    function handleUpload(e) {
        e.preventDefault();
        if (img === "") return;
        const fd = new FormData();
        fd.append('image', img);
        updateAvatar(fd).then(res => {
            let newUser = {...user, avatar: res.avatar};
            updateInfo(newUser);
        });
        inputRef.current.value = null;
    }
    return ( 
    <div className="backgd">
        <nav className="navbar navbar-light bg-dark">
            <a className="navbar-brand color-white" href="/#">
                <img src={logo} width="30" height="30" className="d-inline-block align-top" alt=""/>
                Reactbook
            </a>
            <Link to={"/main"}><button className="btn btn-outline-success my-2 my-sm-0" type="submit">Main Page</button></Link>
        </nav>  
        <div className="container-fluid">
            
        <div className="row">
            <div className="col-lg-6">
                    <div className="card card-info my-auto mx-auto">
                        <div className="card-body">
                            <div className="header text-center">
                                <h2>Current Info</h2>
                            </div>
                            <div className="body">
                            <div className="container">
                                <img src={user.avatar} alt=""/>
                                <form onSubmit={handleUpload}>
                                    <input ref={inputRef} type="file" className="btn btn-outline-success my-2 my-sm-0"
                                    accept="image/*" onChange={(e) => handleImageChange(e)}/> 
                                    <button type="submit" className="btn btn-primary">Upload</button>
                                    {!auth?!third&&<a href="http://localhost:3001/auth/google">
                                        <button className="btn btn-danger mx-2" type="button">Link Acount</button>
                                    </a>:
                                    <button className="btn btn-danger mx-2" type="button" onClick={handleUnlinkClick}>Unlink Acount</button>}
                                </form>                      
                                <p>Name: {user.username}</p>
                                <p>Email: {user.email}</p>
                                <p>Phone: {user.phone}</p>
                                <p>Zipcode: {user.zipcode}</p>
                                <p>Password: {'*'.repeat(5)}</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <div className="col-lg-6 d-flex align-items-stretch">
                    <div className="card card-info my-auto mx-auto">
                        <div className="card-body"> 
                            <div className="header text-center">
                                <h2>Update Info</h2>
                            </div>
                            <div className="body">
                                <form onSubmit={handleSubmit}>
                                    <div className="container">
                                    { err.length ?
                                    <div className="alert alert-danger">
                                        <strong>Invalid Fields:</strong>
                                        <ol>
                                            {err.map((msg) => <li>{msg}</li>)}
                                        </ol>
                                    </div> 
                                    : null
                                    }
                                    <div className="mb-3">
                                        <label htmlFor="facname">Username</label>
                                        <input type="text" className="form-control" name="acname" id="facname" placeholder="Account Name" value={username}
                                                onChange={ (e) => setName(e.target.value) } />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="femail">Email Address</label>
                                        <input type="email" className="form-control" name="email" id="femail" placeholder="Email Adress" value={email}
                                                onChange={ (e) => setEmail(e.target.value) }/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="fphone">Phone Number</label>
                                        <input type="tel" className="form-control" name="phone" id="fphone" placeholder="123-123-1234" value={phone}
                                                onChange={ (e) => setPhone(e.target.value) }/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="fzip">Zipcode</label>
                                        <input type="text" className="form-control" name="zip" id="fzip" placeholder="12345"  
                                        value={zip}
                                        onChange={ (e) => setZip(e.target.value) }/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="fpasswd">Password</label>
                                        <input type="password" className="form-control" name="passwd" id="fpasswd" placeholder="Password"  
                                        value={password}
                                        onChange={ (e) => setPassword(e.target.value) }/>
                                    </div>
                                    <input type="submit" className="btn btn-primary" value="Submit"/>
                                    </div>
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    </div>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        third: state.loginError,
        auth: state.auth
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateInfo: (url) => dispatch(updateInfo(url)), 
        thirdParty: (auth) => dispatch(thirdParty(auth))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
