import React, { useState, useEffect } from 'react';
import { Link,useNavigate  } from "react-router-dom";
import Profile from '../C5.png';
import './simple_note.css';
import './home.css';
import { GhostaContainer, ghosta } from 'react-ghosta';



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

  const [color, setColor] = useState('#000000');

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
    fetch('backend/notebookFinder.php', { //should be 'backend/notebookCreation.php'
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

  //---
  const createNotebookForm = () => {
    console.log("createNotebookForm");

    let notebookData = {  //bug here, for some reason no matter the checked box its always true for first click
      title: '',
      description: '',
      isPrivate: true,
      color: '#E6E6FA',
    };

    const colors = ['#E6E6FA', '#6f2da8', '#fc8eac', '#fbec5d', '#F28500', '#096C6C', '#41424C', '#4f86f7', '#82c87e', '#FF6347'];


    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;

      notebookData = {
        ...notebookData,
        [name]: type === 'checkbox' ? checked : value,
      };
      console.log('Updated notebookData:', notebookData);
    };

    const handleColorClick = (colorValue) => {
      notebookData = {
        ...notebookData,
        color: colorValue,
      };
      console.log('Color selected:', colorValue);
  
      // Update the border of selected color box
      const colorBoxes = document.querySelectorAll('.notebook-color-box');
      colorBoxes.forEach((box) => {
        if (box.getAttribute('data-color') === colorValue) {
          box.style.border = '2px solid black';
        } else {
          box.style.border = '1px solid gray';
        }
      });
    };

    const submitNotebook = (event) => {
      event.preventDefault();

      const username = getCookie("username");

      console.log("submitNotebook");

      if(notebookData.title.length <= 1000 && notebookData.title.length > 0){ 
        if(notebookData.description.length <= 1000 && notebookData.description.length > 0){ 
          fetch("backend/notebookCreation.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username,
              title: notebookData.title,
              description: notebookData.description,
              isPrivate: notebookData.isPrivate,
              color: notebookData.color
            })
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                ghosta.fire({ headerTitle: 'Success', description: 'Notebook created successfully!', showCloseButton: false });

                setTimeout(() => {
                  window.location.reload();
                }, 1000); // 1000 milliseconds = 1 second

              } else {
                ghosta.fire({ headerTitle: 'Error', description: 'Failed to create notebook..', showCloseButton: true }); //shouldnt ever reach here
              }
            })
            .catch((error) => {
              ghosta.fire({ headerTitle: 'Error', description: 'Server error', showCloseButton: true });
            });
        }else{
          if(notebookData.description.length > 1000){
            const id = ghosta.fire({ headerTitle: 'Error', description: 'Description exceeds character limit', showCloseButton: true });

            setTimeout(() => {
              ghosta.close(id);
              createNotebookForm();
            }, 1500);
          }else{
            const id = ghosta.fire({ headerTitle: 'Error', description: "Description can't be empty", showCloseButton: true });

            setTimeout(() => {
              ghosta.close(id);
              createNotebookForm();
            }, 1500);
          }
        }
      }else{
        if(notebookData.title.length > 1000){
          const id = ghosta.fire({ headerTitle: 'Error', description: 'Title exceeds character limit', showCloseButton: true });

          setTimeout(() => {
            ghosta.close(id);
            createNotebookForm();
          }, 1500);

        }else{
          const id = ghosta.fire({ headerTitle: 'Error', description: "Title can't be empty", showCloseButton: true });

          setTimeout(() => {
            ghosta.close(id);
            createNotebookForm();
          }, 1500);
        }
      }

    };

    // Ensure the event is only attached once
    const bindCreateButton = () => {
      const createButton = document.querySelector('.ghosta__button'); // Assuming this is the primary button class used in ghosta for the "Create" button
      if (createButton) {

        // Remove any existing event listeners first
        createButton.removeEventListener('click', submitNotebook);
        
        // Attach the click event
        createButton.addEventListener('click', submitNotebook);
      }else {
        console.log("Create button not found");
      }
    };

    ghosta.fire({
      title: "Create New Notebook",
      content: (
        <div>
          <label>
            Title:
            <input type="text" name="title" onChange={handleInputChange} autoFocus/>
          </label>
          <br />
          <label>
            Description:
            <input type="text" name="description" onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Public:
            <input type="checkbox" name="isPrivate" onChange={handleInputChange} />
          </label>
          <br />

          <div>
            <label htmlFor="color">Color:</label>
            <div className="color-selector">
              {colors.map((hexColor) => (
                <div
                  key={hexColor}
                  data-color={hexColor}
                  onClick={() => handleColorClick(hexColor)}
                  className="notebook-color-box"
                  style={{
                    backgroundColor: hexColor,
                    border:
                      notebookData.color === hexColor
                        ? '2px solid black'
                        : '1px solid gray',
                  }}
                ></div>
              ))}
            </div>
          </div>

        </div>
      ),
      buttons: [
        {
          title: "Create",
          variant: "primary",
          onClick: () => {},
        }
      ],
      showCloseButton: true,
    });

    // Bind the event listener after ghosta finishes rendering
    setTimeout(() => {
      bindCreateButton();
    }, 100);  // Small delay to ensure the button is rendered
  };

  const handleNotebookClick = (notebook) => {
    navigate(`/notebooks/${notebook.title}`, { state: { notebook } });
  };

  return(
      <>
          <Top_bar_simple_notes/>
          <GhostaContainer />
          <div className="mainBody">
            <div>
            <div className="notebooks_list spacing" >
              <ul>
                <li className="label">Notebooks</li>

                {notebooks.map( (notebook, index) => (
                  <li key = {index} className="spacing">
                    <button className="notebook_buttons" onClick={() => handleNotebookClick(notebook)}>
                      <div className="notebook-color-box-pointer" style={{ backgroundColor: notebook.color || "#CCCCCC" }}></div>
    
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

                <li className="spacing"><button className="green control_button_single" onClick={createNotebookForm}>Create Notebook</button></li>

                <li className="spacing"><Link to="/notebooks"><button className="logout_button control_button_single">Delete Notebook</button></Link></li>
                <li className="spacing"><Link to="/"><button className="control_button_single logout_button" onClick={LoggedOut}>Log Out</button></Link></li>
                </ul>
                </div>
            </div>
          </div>
      </>
  )
}