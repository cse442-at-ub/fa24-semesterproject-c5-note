import './profile.css';
import logo from '../C5.png';
import '../App.css';
import './home.css';
import { Link, useNavigate } from "react-router-dom";
import { handleShowUsername } from "./home.jsx";
import ItemGrid from './Grid.jsx';

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

  //const [src, setSrc] = useState(logo);


  fetch("backend/getProfilePicture.php", { method: "GET" }).then(response => {

    response.json().then( data => {

      console.log(data);
      console.log(data.message);
      if (data.status != "failed") {
        //setSrc(response.blob);
        frame.src = "backend/" + data.message;
      }
    })
    
  });

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

    var name = getCookie('username')
    if (name == '' || typeof (name) == "undefined") {
      name = 'DevModeOnly'
    }

    const upload = () => {

      const formData = new FormData();
      formData.append("fileToUpload", document.getElementById("fileToUpload").files[0]);
      fetch("backend/image-upload.php", { method: "POST", body: formData });
    }

    const items = Array.from({ length: 20 }, (_, index) => `Item ${index + 1}`);

    return (
      <>
        <Top_bar />
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
          <p>Select image to upload:</p>
          <div className="upload">
            
            <input type="file" name="fileToUpload" id="fileToUpload" accept="image/*" onChange={preview}></input>
            <input type="submit" value="Upload Image" name="Save Image" onClick={upload}></input>
          </div>

        </div>

        <div className='Profile_Buttons'>
          <Link to="/note"><button className="take_notes_button">Take Notes</button></Link>
          <Link to="/"><button className="log_out_button" onClick={LoggedOut}>Log Out</button></Link>
        </div>

        <h1 className="container_text">Public Notebooks</h1>
        <ItemGrid items={items} />
      </>
    )
  }