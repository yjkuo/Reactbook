import React, { useEffect } from 'react';
import { getProfile, thirdPartyLogin, linkAccount } from "../../API";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { updateUser, login, thirdParty } from "../../reducers/actions";


function OauthLogin({updateUser, isLoggedIn, login, thirdParty}) { 
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      linkAccount().then(res => {
        thirdParty(true);
        navigate('/main');
      })
    } else {
      thirdPartyLogin()
      .then(res => getProfile())
      .then(res => {
          updateUser(res);
          thirdParty(res.auth);
          if (!res.auth) login();
          navigate('/main');
      }).catch(()=>{})
    }
    
  }, []);

  return (
        <></>
    );
  
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    isLoggedIn: state.isAuthenticated
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
      updateUser: (payload) => dispatch(updateUser(payload)),
      login: () => dispatch(login()),
      thirdParty: (auth) => dispatch(thirdParty(auth))
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(OauthLogin);