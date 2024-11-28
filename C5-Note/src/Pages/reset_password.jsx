import logo from '../C5.png';
import '../App.css';
import './reset_password.css';
import { Link,useNavigate  } from "react-router-dom";
import { GhostaContainer, ghosta } from 'react-ghosta';
import 'react-ghosta/dist/ghosta.css';

async function resetPasswordFetch() {

    var jsonData = { "email": document.getElementById("email").value,
        "code":document.getElementById("code").value,
        "password":document.getElementById("password").value };

    const response = await fetch("backend/updatePassword.php", {method: "POST", body:JSON.stringify(jsonData)});
    const data = await response.json();

    console.log(data.status);
    return data;
}


export function Top_bar(){
  return(
    <div className='Top_bar'>
      <div className='Top_bar_elms'>
      <Link to="/"><h1 className='Top_bar_text'>C5-Note</h1></Link>
        <img src={logo} className="logo" alt="logo" /></div>
    </div>
  )
}



export function Reset_Password(){

    const validPassword = new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()\\-_+={}\\[\\]|;:"<>,./?]).{8,}$');


    const navigate = useNavigate();

    const handleShowEmail = () => ghosta.fire({ headerTitle: 'ERROR',description:'Please enter an email address.', showCloseButton:true });

    const handleShowCode = () => ghosta.fire({ headerTitle: 'ERROR',description:'Please enter a verification code', showCloseButton:true});

    const handleShowPassword = () => ghosta.fire({ headerTitle: 'ERROR',description:'Please enter a password', showCloseButton:true});

    const handleShowRetype = () => ghosta.fire({ headerTitle: 'ERROR',description:'Please retype your password', showCloseButton:true});
    
    const handleDifferentPassword = () => ghosta.fire({ headerTitle: 'ERROR',description:'Password and Retype password do not match.', showCloseButton:true});
    
    const handleInvalidPassword = () => ghosta.fire({ headerTitle: 'Invalid Password',
        description:'Your password must be at least 8 characters long, and contain a number, lowercase letter, uppercase letter, and a special character.',
        showCloseButton:true});

    const resetPassword = () => {

        if(document.getElementById("email").value == ''){
            handleShowEmail();
        }
        else if(document.getElementById("code").value == ''){
            handleShowCode();
        }
        else if(document.getElementById("password").value == ''){
            handleShowPassword();
        }
        else if(document.getElementById("retype").value == ''){
            handleShowRetype();
        }
        else if(document.getElementById("password").value != document.getElementById("retype").value) {
            handleDifferentPassword();
        }
        else if(!validPassword.test(document.getElementById("password").value)) {
            handleInvalidPassword();
        }
        else{
    
            var status = "";
            var message = "";
    
            resetPasswordFetch().then( (data) => { status = data.status; message = data.message;
                console.log(status);
                console.log(message);
        
                if (data.status === "success") {
        
                ghosta.fire({ headerTitle: "Password Reset Successfully", description:"", showCloseButton: "false",
                    "buttons": [{title:"Go to login page", onClick:() => {navigate("/");}}]
                });
                
                }
                else if (data.status === "failed"){
                ghosta.fire({ headerTitle: "Error", description:"Invalid verification code or email"});
                }
                else{
                ghosta.fire({ headerTitle: "Error", description:"There was an error with the server."});
                }
            });
        }


    }



    return(
        <>
        <Top_bar/>
        <GhostaContainer />
          <div id="Reset_Password_Inputs" className='container_text'>

          <input required type="email" className='form_text' name='email' placeholder='email' id='email'></input>
          <input required type="code" className='form_text' name='code' placeholder='Verification Code' id='code'></input>
          <input required type="password" className='form_text' name='password' placeholder='Password' id='password'></input>
          <input required type="password" className='form_text' name='retype' placeholder='Retype Password' id='retype'></input>
          </div>
          <div className="Reset_Button">
          <button className="reset_my_password" onClick={ resetPassword }>Reset my Password</button>
          </div>    
        </>
    )
}