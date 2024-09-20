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
    const [password, setPassword] = useState("");
    const [reenterPassword, setReenterPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();


    const handleRegisterClick = async () => {
        setErrorMessage("");

        // Check if passwords match
        if (password !== reenterPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        //const hashedPword = await hashPassword(password);
        const requestData = {
            username: username,
            password: password,
            email: username
        };

        try {
            const response = fetch("backend/signup.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            }).then((response) => response.json())
            .then((json) =>{if (json.status === '201') {
                console.log(json)
                //alert("User registered successfully!");
                navigate('/');
            } else {
                setErrorMessage("An error occurred during registration.");
            }
        })}
        catch (error) {
            setErrorMessage("Server error. Please try again later.");
        }

            
    };

    return (
        <>
        <Top_bar />
        <div id="SignUp_Text_Inputs" className='container_text'>
            <input required type="text" className='form_text' placeholder='Username (Email)' 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input required type="password" className='form_text' placeholder='Password' 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input required type="password" className='form_text' placeholder='Re-enter Password' 
                value={reenterPassword}
                onChange={(e) => setReenterPassword(e.target.value)}
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