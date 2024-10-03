import logo from '../C5.png';
import '../App.css';
import './forgot_login.css';
import { Link,useNavigate  } from "react-router-dom";
import { GhostaContainer, ghosta } from 'react-ghosta';
import 'react-ghosta/dist/ghosta.css';


export function Top_bar(){
  return(
    <div className='Top_bar'>
      <div className='Top_bar_elms'>
        <h1 className='Top_bar_text'>C5-Note</h1>
        <img src={logo} className="logo" alt="logo" /></div>
    </div>
  )
}



export function Forgot_login(){
    const navigate = useNavigate();

    const handleShowEmail = () => ghosta.fire({ headerTitle: 'ERROR',description:'Please enter an email', showCloseButton:true });

    const handleShowIncor = () => ghosta.fire({ headerTitle: 'ERROR',description:'There is no account with this email.', showCloseButton:true });


    return(
        <>
        <Top_bar/>
        <GhostaContainer />
          <div id="Login_Text_Inputs" className='container_text'>
          <input required type="text" className='form_text' name='email' placeholder='email' id='email'></input>
          </div>
          <div className='Send_Info_Buttons'>
          <Link to="/home"><button className="send_me_my_username" onClick={ handleShowEmail }>Send me my Username</button></Link> 
          <Link to="/home"><button className="reset_my_password" onClick={ handleShowEmail }>Reset my Password</button></Link> 
          </div>
          <div className='Back_Button'>
          <Link to="/home"><button className="back_button">Back</button></Link> 
          </div>  
        </>
    )
}