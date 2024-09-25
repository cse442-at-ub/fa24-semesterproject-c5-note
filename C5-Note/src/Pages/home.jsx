import logo from '../C5.png';
import '../App.css';
import './home.css';
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



export function Home(){
    const navigate = useNavigate();

    const handleShowUsername = () => ghosta.fire({ headerTitle: 'ERROR',description:'Please enter a username', showCloseButton:true });

    const handleShowPassword = () => ghosta.fire({ headerTitle: 'ERROR',description:'Please enter a password', showCloseButton:true});

    const handleShowIncor = () => ghosta.fire({ headerTitle: 'ERROR',description:'Username or password incorrect', showCloseButton:true });

    const login = ()=>{
      if(document.getElementById("username").value == ''){
        handleShowUsername();
      }else if(document.getElementById("password").value == ''){
        handleShowPassword();
      }else{
      fetch("backend/login.php", {
        method: "POST",
        body: JSON.stringify({
          username: document.getElementById("username").value,
          password: document.getElementById("password").value,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => response.json())
        .then((json) => {
          if(json.status =='failed'){
            handleShowIncor();
          }else{
            navigate('/note')
          }
        }
        );
    }
    }

    return(
        <>
        <Top_bar/>
        <GhostaContainer />
          <div id="Login_Text_Inputs" className='container_text'>
          <input required type="text" className='form_text' name='username' placeholder='username' id='username'></input>
          <input required type="password" className='form_text' name='password' placeholder='password' id='password'></input>
          </div>
          <div className='Login_Buttons'>
          <input required type="submit" className='login_button' onClick={login}></input>
          <Link to="/signUpPage"><button className="sign_up_button">Sign Up</button></Link> 
          </div>    
        </>
    )
}