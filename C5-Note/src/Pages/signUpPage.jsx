import React, { useState } from 'react';
import logo from '../C5.png';
import '../App.css';
import './signUpPage.css';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export function Top_bar(){
  return (
    <div className='Top_bar'>
      <div className='Top_bar_elms'>
        <h1 className='Top_bar_text'>C5-Note</h1>
        <img src={logo} className="logo" alt="logo" />
      </div>
    </div>
  );
}

/* looks like password gets hashed in signup.php
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
    */

export function SignUpPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    

    const handleRegisterClick = async () => {
        setErrorMessage("");


        //const hashedPword = await hashPassword(password);
        const requestData = {
            username: username,
            email: email
        };
        if(username == "" || email == ""){
            setErrorMessage("Username or email can not be blank");
        }else{
        try {
            const response = fetch("backend/emailSignup.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            }).then((response) => response.json())
            .then((json) =>{if (json.status === '200') {
                console.log(json)
                navigate('/verify')
                //alert("User registered successfully!");
            } else {
                setErrorMessage(json.message);
            }
        })}
        catch (error) {
            setErrorMessage("Server error. Please try again later.");
        }

    } 
    };

    return (
        <>
        <Top_bar />
        <div id="SignUp_Text_Inputs" className='container_text'>
            <input required type="text" className='form_text' placeholder='Username' 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input required type="text" className='form_text' placeholder='Email' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        
        <div className='SignUp_Buttons'>
            <Link to="/"><button type="button" className='go_back_button'>Go Back to Homepage</button></Link>
            
            <button type="button" className='register_button' onClick={handleRegisterClick}>
                Register
            </button>

        </div>
        </>
    );
}