import React, { useState } from 'react'
import { updateArticle } from "../../API";
import {NotificationContainer, NotificationManager} from 'react-notifications';

const Comments = ({comments, pid, requestArticles, setShowEditArea}) => {
  const [show, setShow] = useState(new Array(comments.length).fill(false));
  const [cmt, setCmt] = useState("");
  function handleEdit(i) {
    if (show[i]) {
      if (!cmt) return;
      let payload = {text: cmt, commentId: i};
      updateArticle(pid,payload)
      .then(res => {
          requestArticles(res);
      }).catch(()=>{
        NotificationManager.error('Cannot edit other\'s comment', 'Forbidden', 3000);
      })
    } 
    setShow([...show.slice(0,i), !show[i], ...show.slice(i+1)]);
    setCmt("");
  }
  return (
    <div>
        <ul className="list-group list-group-flush comment-list">
          {comments.map((x, i) =>  
            <li key={i} className="list-group-item comment">{show[i]?
            <input type="text" className="form-control" value={cmt} onChange={ (e) => setCmt(e.target.value) }/>: `${x.author}: ${x.text}`}
            <button type="button" className="btn btn-outline-success float-end" onClick={() => handleEdit(i)}>Edit</button></li>
          )}
        </ul>
        <NotificationContainer/>
    </div>
  )
}

export default Comments