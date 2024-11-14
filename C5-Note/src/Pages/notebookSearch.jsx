import { useState, useEffect, useRef } from "react"; //to enable state 
import { Link, useNavigate } from "react-router-dom";
import "./notebookSearch.css";
import React from 'react';

export function NotebookSearch() {
    const [visibleResult, setVisibleResult] = useState(false);
    const [result, setResult] = useState([]);
    const searchRef = useRef(null);
    const [username, setUsername] = useState("");

    useEffect(() => {

        fetch("backend/getUsername.php", { method: "GET" }).then( response => {
          response.json().then( data => {
            if(data["error"] == null) {
    
                setUsername(data["username"]);

                console.log(data["username"]);

            }
            else {
                
                setUsername("Guest");

                console.log("Guest");

            }

            });
        });
    
      }, []);

    const addResult = (newItem) => {
        setResult((prevItems) => [...prevItems, newItem]); // Append the new item
      };

    const getResults = () => {

        var value = document.getElementById("notebook_search_bar").value.trim();

        if (value.length > 0) {
            var jsonData = { "search": value }

            fetch('backend/notebookSearch.php', { method: "POST", body: JSON.stringify(jsonData) }).then((response) => response.json()).then
                ((data) => {
                    if(data["status"] === "success") {
                        setResult([]);
                        var books = JSON.parse(data["notebooks"]);
                        for(const index in books)
                            { addResult(books[index]) };
                        }
                    });
            setVisibleResult(true);
        }
        else {
            setResult([]);
            setVisibleResult(false);
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
            <input type="text" className="search_bar" id="notebook_search_bar" placeholder="Notebook Search"></input>
            <button className="search_button" onClick={ () => { getResults();} }>Search</button>
            {visibleResult && (<Results items={result}/>)}
        </div>
        </>
    )
}

function Results(props) {

    if(props.items.length == 0) {
        return (
            <ul className="no_results">
                <li>No notebooks found.</li>
            </ul>
        )    
    }
    
    return (
        //Needs to be changed to reflect notebook info
        <ul className="results">
            {props.items.map( (item,index) => {return <li key={index}>
                <Link to={'/profile/' + item} >
                {item}
                </Link></li>})}
        </ul>
    )
}