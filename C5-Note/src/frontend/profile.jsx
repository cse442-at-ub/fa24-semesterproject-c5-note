import './profile.css';
import logo from '../C5.png';
import '../App.css';
import './home.css';
import { Link } from "react-router-dom";

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
    return(
        <>
        <Top_bar/>
        <form action='/route' method='post'>
          <div id="Profile_Info" className='container_text'>
        

          
          </div>
          <div className='Profile_Buttons'>
          <Link to="/notes"><button className="take_notes_button">Take Notes</button></Link> 
          <Link to="/home"><button className="log_out_button">Log Out</button></Link> 
          </div>    
        </form>
        </>
    )
}