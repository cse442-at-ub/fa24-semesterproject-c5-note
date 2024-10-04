import { Link } from "react-router-dom";
import logo from '../C5.png';
import './verify_email.css';

export function Top_bar(){
    return(
      <div className='Top_bar'>
        <div className='Top_bar_elms'>
          <h1 className='Top_bar_text'>C5-Note</h1>
          <img src={logo} className="logo" alt="logo" /></div>
      </div>
    )
  }

export function VerifyEmail(){
    return(
        <>
            <Top_bar/>
            <div className="container_text">
                <br></br>
            <input type="text" placeholder="EMAIL" className="form_text"></input>
            <input type="text" placeholder="Code" className="form_text"></input>
            <input type="text" placeholder="Password" className="form_text"></input>
            <input type="text" placeholder="Re-Password" className="form_text"></input>
            <Link to="/"><button className="login_button">Verify Account</button></Link>
            </div>
        </>
    )
}