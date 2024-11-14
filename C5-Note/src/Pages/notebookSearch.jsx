import { useState, useEffect, useRef } from "react"; //to enable state 
import { Link, useNavigate } from "react-router-dom";
import "./notebookSearch.css";
import React from 'react';


export function NotebookSearch() {
    const [visibleResult, setVisibleResult] = useState(false);
    const [result, setResult] = useState([]);
    const searchRef = useRef(null);

    

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
            <input type="text" className="notebook_search_bar" id="notebook_search_bar" placeholder="Search all Public Notebooks"></input>
            <button className="notebook_search_button" onClick={ () => { getResults();} }>Search</button>
            {visibleResult && (<Results items={result}/>)}
        </div>
        </>
    )
}

function Results(props) {

    
    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const handleGroupPageClick = (notebook, group, page, readOnly) => {
        navigate(`/notebooks/${group.group_id}/${page.page_number}`, {
            state: { 
                notebook: notebook,  // Pass current notebook info
                group: group,               // Pass the clicked group info
                page: page,                  // Pass the clicked page info
                readOnly: readOnly
            }
        });
    };

    const handleNotebookClick = (notebook, readOnly) => {
        // Check if the notebook has groups and pages
        if (notebook.groups && notebook.groups.length > 0) {
            const firstGroup = notebook.groups[0];
            if (firstGroup.first_page) {
                handleGroupPageClick(notebook, firstGroup, firstGroup.first_page, readOnly);
                return;
            }
        }
    
        // Default: Navigate to notebook overview
        navigate(`/notebooks/${notebook.title}`, { state: { notebook, readOnly } });
      };

    useEffect(() => {

        fetch("backend/getUsername.php", { method: "GET" }).then( response => {
          response.json().then( data => {
            if(data["error"] == null) {
    
                setUsername(data["username"]);

            }
            else {

                setUsername("Guest");

            }

            });
        });
    
      }, []);

    if(props.items.length == 0) {
        return (
            <ul className="notebook_no_results">
                <li>No notebooks found.</li>
            </ul>
        )    
    }
    
    return (
        
        <ul className="notebook_results">
            {props.items.map( (item,index) => { const access = item.access.includes(username);
            
                if(access) {
                    return (<div onClick={() => handleNotebookClick(item, false)}><li key={index}><div className="search-notebook-title">{item.title}</div></li>
                        <div >
                            
                            <div className="search-notebook-content">
                                    
                                    <div className="search-notebook-description">{item.description}</div>
                                    <div className="search-notebook-description">Created: {item.time_created}</div>
                                    <div className="search-notebook-description">Modified: {item.last_modified}</div>
                            </div>
                            </div></div>)}
                else {
                    return (<div onClick={() => handleNotebookClick(item, true)}><li key={index}><div className="search-notebook-title">{item.title}</div></li>
                        <div >
                            
                            <div className="search-notebook-content">
                                    
                                    <div className="search-notebook-description">{item.description}</div>
                                    <div className="search-notebook-description">Created: {item.time_created}</div>
                                    <div className="search-notebook-description">Modified: {item.last_modified}</div>
                            </div>
                            </div></div>)
                }
            })}
        </ul>
    )
}