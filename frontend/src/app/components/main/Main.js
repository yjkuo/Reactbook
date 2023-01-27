import {Link} from "react-router-dom";
import logo from "../../../assets/logo.svg"
import React, { useState, useRef } from "react";
import {connect} from "react-redux";
import { searchPosts, updatePosts, updateFollowing, updateStatus, updateUser, login, logoutUser, requestArticles } from "../../reducers/actions";
import Article from "./Article"
import Friends from "./Friends";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {getArticles, getFollowing, updateHeadline, addArticle, postArticle, addFollowing, logout} from '../../API';

function UpdateField({ updateFunc, button, handleFunc, currentUser, requestArticles }) {
    const [info, setInfo] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (button === "Update"){
            handleFunc(info);
            updateFunc(info);
        } else {
            if (info !== currentUser) {
                addFollowing(info).then(res => {
                    if (res.status === 403) NotificationManager.error('User does not exist!', 'Forbidden', 3000);
                    return getFollowing();
                }).then(res => {
                    updateFunc(res);
                    return res;
                })
                .then(() => getArticles())
                .then(res => {
                    requestArticles(res);
                })
            } else NotificationManager.info('Cannot add yourself!', '', 3000);
        }
        setInfo("");
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <input type="text" 
            name="updateStatus"
            value={info}
            className="form-control form-rounded"
            onChange={ (e) => setInfo(e.target.value) }
            placeholder="Type Here ..."/>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit" disabled={!info}>{button}</button>
        </form>
        <NotificationContainer/>
        </>
    );
}


function PostField({requestArticles}) {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const inputRef = useRef(null);

    function handleCancel() {
        setText("");
        inputRef.current.value = null;
        setImg(null);
    }

    function handleImageChange(e) {
        setImg(e.target.files[0]);
    }

    function handlePost() {
        setText("");
        if (img) {
            const fd = new FormData();
            fd.append('text', text);
            fd.append('image', img);
            postArticle(fd).then(res => {
                requestArticles(res);
            })
        } else {
            addArticle({text: text}).then(res => {
                requestArticles(res);
            })
        }
        setImg(null);
    }

    return (
        <div className="post-editor">
            <textarea name="post-field" 
                id="post-field" 
                className="post-field" 
                placeholder="Write Something Cool!" 
                value={text} 
                onChange={(e) => setText(e.target.value)}></textarea>
            <div className="d-flex">
                <button className="btn btn-outline-success my-2 my-sm-0" onClick={handlePost} disabled={!text}>Post</button>
                <button className="btn btn-outline-success my-2 my-sm-0" onClick={handleCancel}>Cancel</button>
                <input ref={inputRef} type="file" className="btn btn-outline-success my-2 my-sm-0"
                accept="image/*" onChange={(e) => handleImageChange(e)}/>
            </div>
        </div>
    );

}

class Main extends React.Component {
    state = {
        request: "",
    };
    
    componentDidMount() {
        getArticles()
        .then(res => {
            this.props.requestArticles(res);
            return getFollowing();
        })
        .then(res => {
            this.props.updateFollowing(res);
        })
        .catch(()=>{});
        localStorage.setItem('APP_STATE', JSON.stringify(this.props.state));
    }

    handleSearch = (e) => {
        this.setState({ request: e.target.value });
        this.props.searchPosts(e.target.value);
    }

    handleLogout = () => {
        logout().then(res => {
            this.props.logoutUser();
        })
        
    }

    handleUpdateHeadline = (headline) => {
        return updateHeadline({ 'headline': headline}).then(res => true);
    }
    render() {
        return (
            <div className="backgd">
                <nav className="navbar navbar-light bg-dark">
                    <a className="navbar-brand color-white" href="/#">
                        <img src={logo} width="30" height="30" className="d-inline-block align-top" alt=""/>
                        Reactbook
                    </a>
                    <Link to={"/"}><button className="btn btn-outline-success my-2 my-sm-0" type="button" onClick={this.handleLogout}>Logout</button></Link>
                </nav>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-4">
                            <div className="card backgd">
                                <div className="card-body">
                                    <img src={this.props.user.avatar} alt=""/>
                                    <div className="text-center">                  
                                        <Link to={"/profile"}><button type="button" className="btn btn-outline-success my-2 my-sm-0">Profile</button></Link>                                  
                                        <h5 className="mb-4">{this.props.user.username}</h5>
                                        <strong><p className="text-muted fz-base">{this.props.user.headline}</p></strong>
                                        <UpdateField updateFunc={this.props.updateStatus} button="Update" handleFunc={this.handleUpdateHeadline}/>
                                    </div>
                                    <div className="d-none d-lg-block px-4 text-center">                      
                                        <div className="stream-followers scrollable">
                                            <Friends props={this.props}/>
                                        </div>
                                        <UpdateField 
                                        updateFunc={this.props.updateFollowing} 
                                        button="Add" 
                                        currentUser={this.props.user.username} 
                                        requestArticles={this.props.requestArticles}/> 
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="profile-section-main">     
                                <div className="tab-content profile-tabs-content">
                                    <div className="tab-pane active" id="profile-overview" role="tabpanel">
                                        <PostField requestArticles={this.props.requestArticles}/>
                                        <div className="post-editor">
                                            <input type="text" 
                                                name="search"
                                                value={this.state.request}
                                                className="form-control form-rounded"
                                                onChange={ this.handleSearch }
                                                placeholder="Search Posts ..."/>
                                        </div>
                                        <div className="stream-posts">      
                                            <Article posts={ this.props.posts } requestArticles = {this.props.requestArticles}/> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.posts,
        user: state.user,
        allPosts: state.allPosts,
        following: state.following.map(x => ({username: x.username, picture: x.picture, headline: x.headline})),
        isAuthenticated: state.isAuthenticated,
        state: state
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestArticles: (posts) => dispatch(requestArticles(posts)),
        searchPosts: (req) => dispatch(searchPosts(req)),
        updateUser: (id) => dispatch(updateUser(id)), 
        updatePosts: (text) => dispatch(updatePosts(text)),
        updateFollowing: (name) => dispatch(updateFollowing(name)),
        updateStatus: (status) => dispatch(updateStatus(status)),
        login: () => dispatch(login()),
        logoutUser: () => dispatch(logoutUser())
    }
};
// export default Main;
export default connect(mapStateToProps, mapDispatchToProps)(Main);
