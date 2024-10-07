import { Link } from "react-router-dom";

import './testpagewrite.css';                        // Import CSS tied to this page
import logo from '../../C5.png';
import { useState, useEffect } from "react";

/***************************************
 * testpagewrite.jsx
 * 
 * Created 10/1/24 by - Lia
 * 
 * 
 */

// Get the default page from PHP
async function defaultPageFetch() {

    // Fetch the page
    const response = await fetch("backend/test/tpwloadpagejson.php", {
        method: "POST",
        headers: {
            Accept: 'application.json',
            "Content-Type": "application/json"
        },
        body: "page='1'"
    })

    // Convert to JavaScript object
    const fetchedPage = await response.json();

    // Return the page
    // PHP file returns an array with a single element - grab it
    return fetchedPage[0];
}




export function TestPageWrite(){

    const [title, setTitle] = useState('Loading. . .');
    const [contents, setContents]=useState('Loading. . . .');

    useEffect(() => {
        fetch("backend/test/tpwloadpagejson.php", {
            method: "POST",
            headers: {
                Accept: 'application.json',
                "Content-Type": "application/json"
            },
            body: "page='1'"
        })
          .then((response) => response.json())
          .then((data) => {
            setTitle(data[0].pagename);
            setContents(data[0].pagetext);
            console.log(contents);
        })
        .catch((error) => console.log(error));
    }, []);


    /*defaultPageFetch().then((data) =>{
        //console.log(data.pagename);
        //console.log(data.pagetext);
        setTitle(data.pagename);
        setContents(data.pagetext);
        console.log(contents);
        // Update page title and page content
        //document.getElementById('loadPageTitle').value = data.pagename;
    })*/


    return(
        <>
            {/* Formatting the Note-Taking App via Flexbox
            * This layout below is the order for mobile viewing.
            * Desktop and midrange layouts are handled via CSS.
            */}
            <div className ="tpwWrapper">

                {/* Header */}
                <div className="nbpHeader">
                    <div className="nbpHeaderLeft">
                        <Link to="/"><img src={logo} className="nbpLogo"/></Link>
                        <span>C5-Note Test Page:  Write to Page</span>
                    </div>
                    <div className="nbpHeaderRight">
                        <Link to="/note"><button className="nbpButtonHome nbpAlignRight">Profile</button></Link>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="nbpToolbar">
                    <button className="tpwButton">Save</button>
                </div>

                <form className="nbpMain">
                    {/* Lorem Ipsum for filler until note pages implemented */}
                    <h1 className = "tpwPageTitle" id = "loadPageTitle">{title}</h1>
                    <textarea className = "tpwInputArea" id ="loadPageText">{contents}</textarea>
                </form>


                <aside className="aside nbpSidebarNotebooks">
                    <h1>Notebooks</h1>
                    <p>My Notebook</p>
                    <p>CSE 442</p>
                </aside>
                <aside className="aside nbpSidebarPages">
                    <h1>Note Pages</h1>
                    <p>Lecture 2</p>
                    <p>Lecture 1</p>
                    <p>Syllabus</p>
                </aside>
                <footer className="nbpFooter">Footer</footer>


            </div>
            

        </>
    )

}