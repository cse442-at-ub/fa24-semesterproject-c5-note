import { Link } from "react-router-dom";
import Profile from '../C5.png';
import './simple_note.css';
import './home.css';



function Top_bar_simple_notes(){
    return(
      <div className='Top_bar'>
        <div className='Top_bar_elms'>
          <h1 className='Top_bar_text'>C5-Note</h1>
            {/*switch the image to be agnostic to database images*/}
            <div className="profile_div">
                <img src={Profile} className="profile_image" alt="logo" />
                <p>Username</p>
                </div>
        </div>
          
      </div>
    )
  }

export function Simple_notebook(){
    return(
        <>
            <Top_bar_simple_notes/>
            <h1>Notebook Page</h1>
            <Link to="/"><button className="CoolButton">Take Notes</button></Link>
            <Link to="/"><button className="logout_button">Log Out</button></Link>
        </>
    )
}