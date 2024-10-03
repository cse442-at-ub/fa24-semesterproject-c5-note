import React, { useState, useEffect } from 'react';
import { Link,useNavigate  } from "react-router-dom";
import Profile from '../C5.png';
import './simple_note.css';
import './home.css';



function Top_bar_simple_notes(){
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
      <div className='Top_bar'>
        <div className='Top_bar_elms'>
          <h1 className='Top_bar_text'>C5-Note</h1>
            {/*switch the image to be agnostic to database images*/}
            <div className="profile_div">
              <div className="profile_div_color">
                <img src={Profile} className="profile_image" alt="logo" />
                <p>{ name }</p>
                </div>
            </div>
        </div>
          
      </div>
    )
}

export function Simple_notebook(){
  const navigate = useNavigate();
  const [notebooks, setNotebooks] = useState([]);

  const clear_cookies = ()=>{
    cookieStore.getAll().then(cookies => cookies.forEach(cookie => {
      console.log('Cookie deleted:', cookie);
      cookieStore.delete(cookie);
  }));
  navigate('/')
  location.reload();
  }

  const getCookie= (name) =>{
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let split = el.split('=');
      cookie[split[0].trim()] = split.slice(1).join("=");
    })
    return cookie[name];
  }

  const LoggedOut = ()=>{
    var usaname = getCookie('username')
    if (usaname != '' || typeof(myVariable) != "undefined" ){
      clear_cookies()
    fetch("backend/logout.php", {
      method: "POST",
      body: JSON.stringify({
        username: usaname,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
      }
      );
    }
    clear_cookies()
  }

  //useEffect will run when page first loads and in this case will fetch all notebooks for specific user
  useEffect(() => {
    const username = getCookie('username');
    fetch('backend/notebookCreation.php', { //should be 'backend/notebookCreation.php'
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        username: username
      })
    })
      .then(response => response.json())
      .then(data => setNotebooks(data)) //data = response.json(), also sets what this users availble notebooks are
      .catch(error => console.error('Error fetching notebooks:', error));
  }, []);

  return(
      <>
          <Top_bar_simple_notes/>
          <div className="mainBody">
            <div>
            <div className="notebooks_list spacing" >
              <ul>
                <li className="label">Notebooks</li>

                {console.log(notebooks)}

                {notebooks.map( (notebook, index) => (
                  <li key = {index} className="spacing">
                    <button className="notebook_buttons">
                      <div className="notebook-color-box" style={{ backgroundColor: notebook.color || "#CCCCCC" }}></div>
    
                      <div className="notebook-content">
                        <div className="notebook-title">{notebook.title}</div>
                        <div className="notebook-description">{notebook.description}</div>
                      </div>
                    </button>
                  </li>
                ))}

              </ul>
            </div>

            <br></br>

            </div>
            <div className="spacing">
              <div className="control_buttons">
                <ul>
                <li className="label options">Options</li>
                <li className="spacing"><Link to="/notebooks"><button className="control_button_single">Open Notebook</button></Link></li>
                <li className="spacing"><Link to="/notebooks"><button className="green control_button_single">Create Notebook</button></Link></li>
                <li className="spacing"><Link to="/notebooks"><button className="logout_button control_button_single">Delete Notebook</button></Link></li>
                <li className="spacing"><Link to="/"><button className="control_button_single logout_button" onClick={LoggedOut}>Log Out</button></Link></li>
                </ul>
                </div>
            </div>
          </div>
      </>
  )
}