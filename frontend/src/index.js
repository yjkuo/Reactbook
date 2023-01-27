import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-notifications/lib/notifications.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Auth from './app/components/auth/Auth';
import OauthLogin from './app/components/auth/OauthLogin';
import Main from './app/components/main/Main';
import Profile from './app/components/profile/Profile';
import reportWebVitals from './reportWebVitals';
import {Provider, useSelector} from "react-redux";
import { Navigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit'
import { socialApp } from "./app/reducers/reducers";

const App = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
          <Route index element={ <Auth/> }></Route> 
          <Route 
            exact path="/profile"
            element={
              // <Profile/>
              (isAuthenticated ? <Profile/> : <Navigate to="/"/>)
            }
          />          
          <Route 
            exact path="/main"
            element={
              // <Main/>
              (isAuthenticated ? <Main/> : <Navigate to="/"/>)
            }
          />
          <Route exact path="/login" element={ <OauthLogin/>}/>  
      </Routes>
    </Router>
  );
  
}

const store = configureStore({reducer: socialApp});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={ store }>
          <App/>
      </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
