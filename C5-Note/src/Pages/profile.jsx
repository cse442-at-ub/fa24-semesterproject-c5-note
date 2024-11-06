import './profile.css';
import logo from '../C5.png';
import '../App.css';
import './home.css';
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ItemGrid from './Grid.jsx';
import { GhostaContainer, ghosta } from 'react-ghosta';

export function Top_bar() {
  return (
    <div className='Top_bar'>
      <div className='Top_bar_elms'>
        <h1 className='Top_bar_text'>C5-Note</h1>
        <img src={logo} className="logo" alt="logo" /></div>
    </div>
  )
}



export function Profile() {

  const navigate = useNavigate();
  const location = useLocation();
  const name = location.pathname.split("/")[2];

  const [items, setItems] = useState([]); // Initialize an empty array
  const [ signedIn, setSignedIn ] = useState(false);

  const addItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]); // Append the new item
  };

  const handleGroupPageClick = (notebook, group, page, readOnly) => {
    navigate(`/notebooks/${group.group_id}/${page.page_number}`, {
        state: { 
            notebook: notebook,  // Pass current notebook info
            group: group,               // Pass the clicked group info
            page: page,                  // Pass the clicked page info
            readOnly: readOnly
        }
    });
};

  const handleNotebookClick = (notebook, readOnly) => {
    // Check if the notebook has groups and pages
    if (notebook.groups && notebook.groups.length > 0) {
        const firstGroup = notebook.groups[0];
        if (firstGroup.first_page) {
            handleGroupPageClick(notebook, firstGroup, firstGroup.first_page, readOnly);
            return;
        }
    }

    // Default: Navigate to notebook overview
    navigate(`/notebooks/${notebook.title}`, { state: { notebook, readOnly } });
  };

  //const [src, setSrc] = useState(logo);

  useEffect(() => {

    fetch("backend/getUsername.php", { method: "GET" }).then( response => {
      response.json().then( data => {
        if(data["username"] == name) {
          setSignedIn(true);
        }
      });
    });

  }, []);


  useEffect(() => {

    var jsonData = { username: name};
    fetch("backend/getProfilePicture.php", { method: "POST" , body: JSON.stringify(jsonData)}).then(response => {

      response.json().then(data => {

        if (data.status != "failed") {
          //setSrc(response.blob);
          frame.src = "backend/" + data.message;
        }
      })

    });
  }, []);


  var preview = () => {
    frame.src = URL.createObjectURL(event.target.files[0]);
  }

  const getCookie = (name) => {
    let cookie = {};
    document.cookie.split(';').forEach(function (el) {
      let split = el.split('=');
      cookie[split[0].trim()] = split.slice(1).join("=");
    })
    return cookie[name];
  }

  const clear_cookies = () => {
    cookieStore.getAll().then(cookies => cookies.forEach(cookie => {
      console.log('Cookie deleted:', cookie);
      cookieStore.delete(cookie);
    }));
    navigate('/')
    location.reload();
  }

  const LoggedOut = () => {
    var usaname = getCookie('username')
    if (usaname != '' || typeof (myVariable) != "undefined") {
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

  const upload = () => {

    const formData = new FormData();
    formData.append("fileToUpload", document.getElementById("fileToUpload").files[0]);
    fetch("backend/image-upload.php", { method: "POST", body: formData }).then(response => {
      response.json().then(data => {
        if (data.status === "failed") {
          ghosta.fire({ headerTitle: 'Error', description: data.message, showCloseButton: true });
        }
      })
    });
  }


  useEffect(() => {

    
    var jsonData = { "username": name };
    fetch("backend/getPublicNotebooks.php", { method: "POST", body: JSON.stringify(jsonData) }).then(
      response => response.json().then(data => {
        data.forEach(notebook => {
          addItem(<button className="notebook_buttons"
            onClick={ () => handleNotebookClick(notebook, true) }>
            <div class="notebook-content">
              <div class="notebook-color-box-pointer" style={{ backgroundColor: notebook.color }}></div>
              <div class="notebook-title">{notebook.title}</div>
            </div>
          </button>);
        })
      }));
  }, []);

  return (
    <>
      <Top_bar />
      <GhostaContainer />
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
        {signedIn && (<><p>Select image to upload:</p>
        <div className="upload">

          <input type="file" name="fileToUpload" id="fileToUpload" accept="image/*" onChange={preview}></input>
          <input type="submit" value="Upload Image" name="Save Image" onClick={upload}></input>
        </div></>)}

      </div>

      {!signedIn && (<div className='Profile_Buttons'>
        <Link to="/note"><button className="take_notes_button">Go Back</button></Link>
      </div>)}

      {signedIn && (<div className='Profile_Buttons'>
        <Link to="/note"><button className="take_notes_button">Take Notes</button></Link>
        <Link to="/"><button className="log_out_button" onClick={LoggedOut}>Log Out</button></Link>
      </div>)}

      <h1 className="container_text">Public Notebooks</h1>
      <ItemGrid items={items} />
    </>
  )
}