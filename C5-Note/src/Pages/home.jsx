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

export function Home(){
    return(
        <>
        <Top_bar/>
        <form action='/route' method='post'>
          <div id="Login_Text_Inputs" className='container_text'>
          <input required type="text" className='form_text' name='username' placeholder='username' id='username'></input>
          <input required type="password" className='form_text' name='password' placeholder='password' id='password'></input>
          </div>
          <div className='Login_Buttons'>
          <input required type="submit" className='login_button'></input>
          <Link to="/note"><button className="sign_up_button">Sign Up</button></Link> 
          </div>    
        </form>
        </>
    )
}