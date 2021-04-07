import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { auth, db, storage } from './firebase';
import ImageUpload from './ImageUpload';
import Post from './Post';
import './App.css';
import PublishIcon from '@material-ui/icons/Publish';
import "./ImageUpload.css"
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

function App() {
  const classes = useStyles();
  const[modalStyle] = useState(getModalStyle);

   const[openSignIn,setOpenSignIn]= useState('')
   const [posts,SetPosts]= useState([])
   const[open,SetOpen]= useState(false)
   const[username,setUsername]= useState('')
   const[password,setPassword]= useState('')
   const[email,setEmail]= useState('')
   const[info,setInfo]= useState([])
   const[user,setUser]=useState(null)

   useEffect(() => {
      const unsubscribe=auth.onAuthStateChanged((authUser) => {
        if (authUser){
          //user has logged in...
          setUser(authUser)
           
        } else {
          //user has logged out...
          setUser(null);
        }
      })
      return () => {
        //perform some cleanup actions
        unsubscribe();
      }
   }, [user, username]);

useEffect(() => {
    
    db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot=>
      {SetPosts(snapshot.docs.map(doc =>({id: doc.id, post: doc.data()}) ))})
  },[])

  const signUp = (e) =>{
    e.preventDefault();
        auth.createUserWithEmailAndPassword(email,password)
        .then((authUser)=> {
          return authUser.user.updateProfile({
            displayName: username
          })
        })
        .catch((error)=>setInfo(error.message))
         
        if  (user) {
          setInfo('') 
          SetOpen(false)
      }          
          

  }

  const signIn =(e)=>{
    e.preventDefault()
    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=> setInfo(error.message))
           
       if  (auth.error) {
        setOpenSignIn(true)
       } 
       if (user) {
      setInfo('') 
      setOpenSignIn(false)
  }    }
       
  

  return (
    <div className="App">
           {user?.displayName ? (
            <ImageUpload username={user.displayName} />
           ) : (  <div className="uploadheader"> 
           <PublishIcon className="uploadIcon" > </PublishIcon>
            </div>)}
           

      <Modal 
        open={open}
        onClose={() => SetOpen(false)}
        
      >
        <div style={modalStyle} className={classes.paper}> 
           <form className="app__signup"> 
           <center>
           <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
           </center>
             <div style={{color:'red'}}> {info}   </div>
           <Input 
                type="text"
                placeholder="username"
                value={username}
                onChange={(e)=> setUsername(e.target.value)}
              />
               <Input 
                type="email"
                placeholder="email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
              />
               <Input 
                type="password"
                placeholder='password'
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
              />

              <Button type="submit" style={{backgroundColor: '#f2f2f2', marginTop:20}}
               variant="outlined" onClick={signUp} >Sign Up</Button>
          
           </form>
        </div>
      </Modal>

      <Modal 
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        
      >
        <div style={modalStyle} className={classes.paper}> 
           <form className="app__signup"> 
           <center>
           <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
           </center>
             <div style={{color:'red'}}> {info}   </div>
           
               <Input 
                type="email"
                placeholder="email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
              />
               <Input 
                type="password"
                placeholder='password'
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
              />

              <Button type="submit" style={{backgroundColor: '#f2f2f2', marginTop:20}}
               variant="outlined" onClick={signIn} >Sign In</Button>
          
           </form>
        </div>
      </Modal>
      
      
      <div className="app__header">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
              

            {user ? ( 
              <Button className="app__buttonOut" onClick={() => auth.signOut()}
              variant="contained" color="secondary">LogOut</Button>
            ): (
              <div className="app__loginContainer"> 
               <Button className="app__buttonIn" onClick={() => setOpenSignIn(true)}
               variant="contained" color="secondary">Sign In</Button> 
               <Button className="app__buttonUp" onClick={() => SetOpen(true)}
               variant="contained" color="secondary">Sign Up</Button>
              </div>
               
            )}  
              

      </div>
           {
           posts.map(({id, post})=>(
             <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
           ))
           }

   
     

    </div>
  );
}

export default App;
