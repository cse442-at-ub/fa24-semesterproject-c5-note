import './profile.css';
import logo from '../C5.png';
import '../App.css';
import './home.css';
import { Link } from "react-router-dom";
import { handleShowUsername } from "./home.jsx";

export function Top_bar(){
  return(
    <div className='Top_bar'>
      <div className='Top_bar_elms'>
        <h1 className='Top_bar_text'>C5-Note</h1>
        <img src={logo} className="logo" alt="logo" /></div>
    </div>
  )
}





export function Profile(){
  var preview = () =>{
    frame.src=URL.createObjectURL(event.target.files[0]);
}
const getCookie= (name) =>{
  let cookie = {};
  document.cookie.split(';').forEach(function(el) {
    let split = el.split('=');
    cookie[split[0].trim()] = split.slice(1).join("=");
  })
  return cookie[name];
}

  var name = getCookie('username')
  if (name == '' || typeof(name) == "undefined" ){
    name = 'DevModeOnly'
  }

    return(
        <>
        <Top_bar/>
        <br></br>
          <div id="Profile_Info" className='container_text'>
          <div className='Colour'>
          <div className='container_text'>
          <article className="profile_info">
          <img id="frame" src={logo} className="circle" alt="logo" />
          <div className="">
          <p className="text"></p>
          
          </div>
          </article>
          </div> 
                <h1>{name}</h1>
                </div>
              <form action='backend/image-upload.php' method='POST' encType='multipart/form-data'>
              <p>Select image to upload:</p>
              <input type="file" name="fileToUpload" id="fileToUpload" accept="image/*" onChange={preview}></input>
              <input type="submit" value="Upload Image" name="Save Image"></input>
              </form>
              
              
              
          
          

          </div>
          
          <div className='container_text Profile_Buttons'>
          <Link to="/note"><button className="take_notes_button">Take Notes</button></Link> 
          <Link to="/"><button className="log_out_button">Log Out</button></Link> 
          </div>    
        </>
    )
}