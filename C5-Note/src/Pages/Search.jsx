import { useState, useEffect, useRef } from "react"; //to enable state 
import { Link, useNavigate } from "react-router-dom";
import "./Search.css";
import React from 'react';

export function Search() {
    const [visibleResult, setVisibleResult] = useState(false);
    const [result, setResult] = useState(["mdrum2"]);
    const searchRef = useRef(null);

    const addResult = (newItem) => {
        setResult((prevItems) => [...prevItems, newItem]); // Append the new item
      };

    const getResults = () => {

        var data = document.getElementById("search_bar").value.trim();

        if (data.length > 0) {
            var jsonData = { "search": data }

            fetch('backend/search.php', { method: "POST", body: JSON.stringify(jsonData) }).then((response) => response.json()).then
                ((data) => {
                    setResult([]);
                    data["usernames"].foreach(name => { addResult(name) });
                });
        }
        else {
            setResult([]);
        }
        
    }

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
            <input type="text" className="search_bar" id="search_bar" placeholder="User Search"></input>
            <button className="search_button" onClick={ () => {getResults(); setVisibleResult(true)} }>Search</button>
            {visibleResult && (<Results items={result}/>)}
        </div>
        </>
    )
}

function Results(props) {
    
    return (
        <ul className="results">
            {props.items.map( (item,index) => {return <li key={index}>
                <Link to={'/profile/' + item} >
                {item}
                </Link></li>})}
        </ul>
    )
}