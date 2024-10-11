import React, { useState } from 'react';
import './pageOverflow_test.css';

export function PageOverflowTest() {
    const [content1, setContent1] = useState("");
    const [content2, setContent2] = useState("");

    const handleUpdatedText = () => {
        let fullText = content1 + " " + content2;
        console.log(fullText);

    }

    return(
        <div className='textContainer'>
            <textarea id='1' value={content1} onChange={(e) => {setContent1(e.target.value); handleUpdatedText()}}/>
            <textarea id='2' value={content2} onChange={(e) => {setContent2(e.target.value); handleUpdatedText()}}/>
        </div>
    );
}