import { useParams, useLocation, useNavigate } from "react-router-dom"; //to enable state 
import { Link } from "react-router-dom";
import "./Search.css";
import React from 'react';

export function Search() {

    return (
        <>
        <div className = "Search_Div">
            <input type="text" className="search_bar" placeholder="User Search"></input>
            <button className="search_button">Search</button>
        </div>
        </>
    )
}