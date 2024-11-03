import { useState, useEffect, useRef } from "react"; //to enable state 
import { Link, useNavigate } from "react-router-dom";
import "./Search.css";
import React from 'react';

export function Search() {
    const [visibleResult, setVisibleResult] = useState(false);
    const [result, setResult] = useState([]);
    const searchRef = useRef(null);

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setVisibleResult(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    

    

    return (
        <>
        <div className = "Search_Div" ref={searchRef}>
            <input type="text" className="search_bar" placeholder="User Search"></input>
            <button className="search_button" onClick={ () => {setVisibleResult(true)} }>Search</button>
            {visibleResult && (
                <ul className="results">
                    <li>A</li>
                    <li>B</li>
                    <li>C</li>
                </ul>)}
        </div>
        </>
    )
}

function Results(props) {
    
    return (
        <ul className="results">
            {props.items.map((item) => {<li><Link to={"/profile/" + item}>{item}</Link></li>})}
        </ul>
    )
}