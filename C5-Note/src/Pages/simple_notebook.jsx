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
    cookie.get
    return cookie[name];
  }

    const name = getCookie('username')

    return(
      <div className='Top_bar'>
        <div className='Top_bar_elms'>
          <h1 className='Top_bar_text'>C5-Note</h1>
            {/*switch the image to be agnostic to database images*/}
            <div className="profile_div">
                <img src={Profile} className="profile_image" alt="logo" />
                <p>{ name }</p>
                </div>
        </div>
          
      </div>
    )
  }

export function Simple_notebook(){
  const navigate = useNavigate();
  const clear_cookies = ()=>{
    cookieStore.getAll().then(cookies => cookies.forEach(cookie => {
      console.log('Cookie deleted:', cookie);
      cookieStore.delete(cookie);
  }));
  navigate('/')
  location.reload();
  }

    return(
        <>
            <Top_bar_simple_notes/>
            <h1>Notebook Page</h1>
            <Link to="/"><button className="CoolButton">Take Notes</button></Link>
            <Link to="/"><button className="logout_button" onClick={clear_cookies}>Log Out</button></Link>
        </>
    )
}