import { Avatar } from '@material-ui/core'
import React from 'react'
import "./Post.css"
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { db } from './firebase';

function Post({username, caption, imageUrl}) {
    return (
        <div className="post">
            <div className="post__header"> 
            
            <Avatar
              className="post__avatar"
              alt={username}
              src="static/images/avatar/1.jp"/>
               <h3>{username}</h3>
               
               
              </div>
              
            <img className="post__image" src={imageUrl} />
           
          
                <h4 className="post__text">  <strong> {username}</strong> {caption}</h4>
        
        </div>
    )
} 

export default Post
