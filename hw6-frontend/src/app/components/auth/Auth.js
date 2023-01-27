import React from "react";
import logo from "../../../assets/logo.svg"
import { connect } from "react-redux";
import { updateUser, thirdParty } from "../../reducers/actions";
import Registration from "./Registration";
import Login from "./Login";


class Auth extends React.Component {

    componentDidMount() {
        
    }
    
    render() {
        return ( 
            <>
            <nav className="navbar navbar-light bg-dark">
                    <a className="navbar-brand color-white" href="/#">
                        <img src={logo} width="30" height="30" className="d-inline-block align-top" alt=""/>
                        Reactbook
                    </a>
                </nav>
            <div className="App-header">
                <div className="container col-sm-5">            
                        <div className="nav nav-tabs justify-content-center">
                            <button className="nav-link active" id="nav-signup-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Login</button>
                            <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Register</button>
                        </div> 
                        <div className="tab-content"> 
                            <Login props={this.props}/>
                            <Registration props={this.props}/>                    
                        </div>
                    
                </div>
            </div>  
            </>      
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (payload) => dispatch(updateUser(payload)),
        thirdParty: (auth) => dispatch(thirdParty(auth))
    }
};
// export default Main;
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
