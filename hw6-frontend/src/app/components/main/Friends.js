import React from "react";
import { deleteFollowing, getArticles } from "../../API";

export default function Friends ({ props }) {
    function handleClick(user, e) {
        deleteFollowing(user).then(res => {
            props.updateFollowing(res);
            return res;
        })
        .then(() => getArticles())
        .then(res => {
            props.requestArticles(res);
        });
    }

    return (        
        props.following.map( (user, i) => 
        <div key={i} className="card follower-card m-auto">
            <img src={user.picture} alt=""/>
            <div className="card-body">
                <h5 className="card-title">{user.username}</h5>
                <p className="card-text">{user.headline}</p>
            </div>
            <button type="button" className="btn btn-outline-success my-2 my-sm-0" onClick={(e) => handleClick(user.username, e)}>Unfollow</button>
        </div>   
        )
        
    );
}