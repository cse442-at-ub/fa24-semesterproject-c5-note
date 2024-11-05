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

        var value = document.getElementById("search_bar").value.trim();

        if (value.length > 0) {
            var jsonData = { "search": value }

            fetch('backend/search.php', { method: "POST", body: JSON.stringify(jsonData) }).then((response) => response.json()).then
                ((data) => {
                    if(data["status"] === "success") {
                        setResult([]);
                        var names = JSON.parse(data["names"]);
                        for(const index in names)
                            { addResult(names[index]) };
                        }
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

    if(props.items.length == 0) {
        return (
            <ul className="results">
                <li>No users found.</li>
            </ul>
        )    
    }
    
    return (
        <ul className="results">
            {props.items.map( (item,index) => {return <li key={index}>
                <Link to={'/profile/' + item} >
                {item}
                </Link></li>})}
        </ul>
    )
}