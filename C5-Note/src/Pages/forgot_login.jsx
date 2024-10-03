import logo from '../C5.png';
import '../App.css';
import './forgot_login.css';
import { Link,useNavigate  } from "react-router-dom";
import { GhostaContainer, ghosta } from 'react-ghosta';
import 'react-ghosta/dist/ghosta.css';


async function sendUsernameEmailFetch() {

  var jsonData = { "email": document.getElementById("email").value };

  const response = await fetch("backend/requestUsername.php", {method: "POST", body:JSON.stringify(jsonData)});
  const data = await response.json();
  return data;
  
}

async function sendPasswordEmailFetch() {

  var jsonData = { "email": document.getElementById("email").value };

  const response = await fetch("backend/resetPassword.php", {method: "POST", body:JSON.stringify(jsonData)});
  const data = await response.json();
  return data;
  
}

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

    const sendUsernameEmail = () => {

      if(document.getElementById("email").value == ''){
        handleShowEmail();
      }else{

        var data = sendUsernameEmailFetch();

        if (data.response == 200) {

          ghosta.fire({ headerTitle: "Email Sent", description:"Check your inbox at " + document.getElementById("email").value + " for an email with your username.", showCloseButton: "false",
            "buttons": [{title:"Go to login page", onClick:() => {navigate("/");}}]
          });
        
        }
        else if (data.response == 400){
          ghosta.fire({ headerTitle: "Error", description:"There is no account associatd with " + document.getElementById("email").value + "."});
        }
        else{
          ghosta.fire({ headerTitle: "Error", description:"There was an error with the server."});
        }
      }
    }

    const sendResetPasswordEmail = () => {

      if(document.getElementById("email").value == ''){
        handleShowEmail();
      }else{

        var data = sendPasswordEmailFetch();

        if (data.response == 200) {

          ghosta.fire({ headerTitle: "Email Sent", description:"Check your inbox at " + document.getElementById("email").value + " for an email with your verification code.",
            showCloseButton: "false",
            "buttons": [{title:"Go to reset password page", onClick:() => {navigate("/reset_password");}}]
          });
        
        }
        else if (data.response == 400){
          ghosta.fire({ headerTitle: "Error", description:"There is no account associatd with " + document.getElementById("email").value + "."});
        }
        else{
          ghosta.fire({ headerTitle: "Error", description:"There was an error with the server."});
        }
      }
        
    }

    return(
        <>
        <Top_bar/>
        <GhostaContainer />
          <div id="Login_Text_Inputs" className='container_text'>
          <input required type="text" className='form_text' name='email' placeholder='email' id='email'></input>
          </div>
          <div className='Send_Info_Buttons'>
          <button className="send_me_my_username" onClick={ sendUsernameEmail }>Send me my Username</button>
          <button className="reset_my_password" onClick={ sendResetPasswordEmail }>Reset my Password</button>
          </div>
          <div className='Back_Button'>
          <Link to="/"><button className="back_button">Back</button></Link> 
          </div>  
        </>
    )
}