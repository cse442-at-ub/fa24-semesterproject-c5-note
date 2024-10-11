import React, { useState } from 'react';
import './pageOverflow_test.css';

export function PageOverflowTest() {
    let fullText = "";

    const maxChars = 22;

    const handleUpdatedText = () => {
        fullText = "";

        if(document.getElementById('1').value === "") {
            fullText = document.getElementById('2').value;
        }
        else if(document.getElementById('2').value === "") {
            fullText = document.getElementById('1').value;
        }
        else {
            fullText = document.getElementById('1').value + " " + document.getElementById('2').value;
        }
        
        console.log(fullText);

        let splitText = fullText.split(" ");
        console.log(splitText);

        if(fullText.length < maxChars) {

            document.getElementById('1').value = fullText;
            document.getElementById('2').value = "";
        }
        else {
            let string = "";
            let string2 = "";
            for(const word of splitText) {
                if(string === "") {
                    string = word;
                }
                else if(string.length + 1 + word.length < maxChars) {
                    string = string + " " + word;
                }
                else {
                    if(string2 === "")
                        string2 = word;
                    else
                        string2 = string2 + " " + word;
                }
            }
            document.getElementById('1').value = string;
            document.getElementById('2').value = string2;
        }
    }

    return(
        <div className='textContainer'>
            <textarea id='1' onChange={() => {handleUpdatedText}}/>
            <textarea id='2' onChange={() => {handleUpdatedText}}/>
            <button onClick={handleUpdatedText}>overflow</button>
        </div>
    );
}