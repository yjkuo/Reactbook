import React, { useState } from "react";
import { updateArticle } from "../../API";
import Comments from "./Comments";
import ReactPaginate from "react-paginate";
import {NotificationContainer, NotificationManager} from 'react-notifications';


export default function Article ({posts, requestArticles}) {
    const [show, setShow] = useState(new Array(100).fill(false));
    const [showEditArea, setShowEditArea] = useState(new Array(100).fill(false));
    const [text, setText] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    
    function handleComment(i) {
        if (!show[i]) setShow([...show.slice(0,i), true, ...show.slice(i+1)]);
        setShowEditArea([...showEditArea.slice(0,i), !showEditArea[i], ...showEditArea.slice(i+1)]);
    }
    function handleEdit(i) {
        if (show[i]) setShow([...show.slice(0,i), false, ...show.slice(i+1)]);
        setShowEditArea([...showEditArea.slice(0,i), !showEditArea[i], ...showEditArea.slice(i+1)]);
    }
    function handleSubmit(i) {
        setShowEditArea([...showEditArea.slice(0,i), !showEditArea[i], ...showEditArea.slice(i+1)]);
        if (show[i]) {
            let payload = {text: text, commentId: -1};
            updateArticle(posts[i].pid,payload)
            .then(res => {
                requestArticles(res);
            })
        } else {
            let payload = {text: text };
            updateArticle(posts[i].pid,payload)
            .then(res => {
                requestArticles(res);
            }).catch(()=>{
                NotificationManager.error('Cannot edit other\'s article', 'Forbidden', 3000);
            })
        }
        setText("");
        
    }
    function handleCloseClick(i) {
        setShow([...show.slice(0,i), false, ...show.slice(i+1)]);
        if (showEditArea[i]) setShowEditArea([...showEditArea.slice(0,i), false, ...showEditArea.slice(i+1)]);
    }
    function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage);
    }
    const PER_PAGE = 10;
    const offset = currentPage * PER_PAGE;

    const pageCount = Math.ceil(posts.length / PER_PAGE);
    // setShow(new Array(posts.length).fill(0));
    return (
        <div>
            <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            previousLinkClassName={"btn btn-outline-success"}
            nextLinkClassName={"btn btn-outline-success"}
            />
        {posts.slice(offset, offset + PER_PAGE).map((x, i) => 
        <div key={i} className="stream-post" >
            <div className="sp-author">
                
                {/* <a href="/#" className="sp-author-avatar"><img src="https://bootdey.com/img/Content/avatar/avatar6.png" alt=""/></a> */}
                <h3 className="sp-author-name">{x.author}</h3></div>
            <div className="sp-content">
                <div className="sp-info">{x.date}</div>
                { x.image? <img src={x.image} alt=""/> : null}
                <p className="sp-paragraph mb-0">{x.text}</p>
                {!showEditArea[offset+i]?
                <div><button type="button" className="btn btn-outline-success my-2 my-sm-0" onClick={() => handleComment(offset+i)}>Comment</button>
                <button type="button" className="btn btn-outline-success my-2 my-sm-0" onClick={() => handleEdit(offset+i)}>Edit</button></div>:null}
                {showEditArea[offset+i]? <div><textarea name="edit-field" className="form-control form-rounded" value={text} onChange={(e) => setText(e.target.value)}></textarea>
                <button type="button" className="btn btn-outline-success my-2 my-sm-0" disabled={!text}onClick={() => handleSubmit(offset+i)}>Enter</button></div> : null}
                {show[offset+i] ? <><Comments comments={x.comments} pid={posts[offset+i].pid} requestArticles={requestArticles}/><button type="button" className="btn btn-outline-success" onClick={() => handleCloseClick(offset+i)}>Close</button></> : null}
            </div>           
        </div>
        )}
        <NotificationContainer/>
        </div>
    );
}