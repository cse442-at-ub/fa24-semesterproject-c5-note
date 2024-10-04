import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import logo from '../C5.png';
import './verify_email.css';
import { GhostaContainer, ghosta } from 'react-ghosta';
import 'react-ghosta/dist/ghosta.css';
import React, { useState, useEffect } from 'react';

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
  const handleCheckEmail = () => ghosta.fire({ headerTitle: 'Notice',description:'Please check your email for a verification code', showCloseButton:true });


  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const navigate = useNavigate();


  const handleRegisterClick = async () => {


      //const hashedPword = await hashPassword(password);
      const requestData = {
          password: password,
          email: email,
          code: code,
      };
      if(email == ""){
        const handleEmailEmpty = () => ghosta.fire({ headerTitle: 'ERROR',description:'Please enter an email', showCloseButton:true });
        handleEmailEmpty();
      }else if (password == ""){
        const handlePassEmpty = () => ghosta.fire({ headerTitle: 'ERROR',description:'Please enter a password', showCloseButton:true });
        handlePassEmpty();
      }else if(rePassword == ""){
        const handleRePassEmpty = () => ghosta.fire({ headerTitle: 'ERROR',description:'Please reenter the password', showCloseButton:true });
        handleRePassEmpty();
      }else if(code == ""){
        const handleVeriEmpty = () => ghosta.fire({ headerTitle: 'ERROR',description:'Please enter the verification code', showCloseButton:true });
        handleVeriEmpty();
      }else if(rePassword != password){
        const handleMatch = () => ghosta.fire({ headerTitle: 'ERROR',description:'Passwords must match!', showCloseButton:true });
        handleMatch();
      }
      else{
      try {
          const response = fetch("backend/email_verification.php", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData),
          }).then((response) => response.json())
          .then((json) =>{if (json.status === '200') {
              console.log(json)
              navigate('/')
              //alert("User registered successfully!");
          } else {
            const handleRsp = () => ghosta.fire({ headerTitle: 'ERROR',description:json.message, showCloseButton:true });
            handleRsp();
          }
      })}
      catch (error) {
        const handleServerError = () => ghosta.fire({ headerTitle: 'ERROR',description:'Server Error! Try Again Later', showCloseButton:true });
        handleServerError();
      }

  } 
  };

    return(
        <>
            <Top_bar/>
            <GhostaContainer />
            <div className="container_text">
                <br></br>
            <input required type="text" className='form_text' placeholder='Email' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input required type="text" className='form_text' placeholder='CODE' 
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <input required type="text" className='form_text' placeholder='Password' 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input required type="text" className='form_text' placeholder='Re-Password' 
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
            />
            <button type="button" className='login_button' onClick={handleRegisterClick}>
                Create Account
            </button>
            </div>
        </>
    )
}