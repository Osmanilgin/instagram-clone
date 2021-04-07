import { Button, makeStyles, Modal } from '@material-ui/core'
import React, { useState } from 'react'
import {db, storage} from "./firebase"
import firebase from "firebase"
import "./ImageUpload.css"
import PublishIcon from '@material-ui/icons/Publish';

function getModalStyle() {
    const top = 50 ;
    const left = 50 ;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      width: 'fit-content',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: 50,
      paddingLeft: 70,
      paddingRight:70,
      textAlign:'center'
    },
  }));
 

function ImageUpload({username}) {
    const classes = useStyles();
  const[modalStyle] = useState(getModalStyle);
  const[open,SetOpen]= useState(false)

    const [caption, setCaption]= useState('');
    const [progress,setProgress]=useState(0)
    const [image, setImage]= useState(null)

    const handleChange = (e) => {
        if (e.target.files[0]){
            setImage(e.target.files[0])
        }
    }
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                const progress = Math.round(
                     (snapshot.bytesTransferred / snapshot.totalBytes) *100);
                setProgress(progress);         
            },
            (error) => {
                //error function... 
                    alert(error.message)
            },
            () => {
                // complete function... 
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then (url => {
                    
                    db.collection("posts").add({
                        caption: caption,
                        imageUrl:url,
                        username: username,  
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    })
                        setProgress(0);
                        setImage(null)
                        setCaption("")
                
                })
            }
        )
    }
   

    return (
        <div  >
              <Modal 
        open={open}
        onClose={() => SetOpen(false)}
        
      >    
        <div className="modal" style={modalStyle} className={classes.paper}> 
        <center>
        
            <input className="modal" type="text" placeholder="Enter a caption..."
            onChange={e => setCaption(e.target.value)} value={caption} />
            <input className="modal" type="file" onChange={handleChange} />
            <progress value={progress} max="100" />
            <Button variant="contained" className="modal1" onClick={handleUpload}> Upload </Button>  
            </center>
        </div>
      </Modal>
       
        <div className="uploadheader"> 
        <PublishIcon className="uploadIcon" onClick={() =>  SetOpen(true)}> Upload </PublishIcon>
         </div>
             
           
            
      
          
            
        </div>
    )
}

export default ImageUpload
