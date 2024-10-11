import React, { useState } from 'react';
import './pageOverflow_test.css';

export function PageOverflowTest() {
    const [content1, setContent1] = useState("");
    const [content2, setContent2] = useState("");
    let fullText = "";

    const maxChars = 20;

    const handleUpdatedText = () => {
        if(content1 === "") {
            fullText = content2;
        }
        else if(content2 === "") {
            fullText = content1;
        }
        else {
            fullText = content1 + " " + content2;
        }
        
        console.log(fullText);

        let splitText = fullText.split(" ");
        console.log(splitText);

        if(fullText.length < maxChars) {

            setContent1(fullText);
            setContent2("");
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
            setContent1(string);
            setContent2(string2);
        }
    }

    return(
        <div className='textContainer'>
            <textarea id='1' value={content1} onChange={(e) => {setContent1(e.target.value); }}/>
            <textarea id='2' value={content2} onChange={(e) => {setContent2(e.target.value); }}/>
            <button onClick={handleUpdatedText}>overflow</button>
        </div>
    );
}