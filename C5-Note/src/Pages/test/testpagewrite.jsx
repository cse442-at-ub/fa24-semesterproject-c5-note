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

    const savePage = () => {

        // What to send in the PHP query
        //  > Test page is hardcoded to load page with page_id = 1
        var jsonData = {
            "sourcepageid":     1,
            "updatetitle":      document.getElementById("loadPageTitle").value,
            "updatetext":       document.getElementById("loadPageText").value
        };
        fetch("backend/test/tpwwritepage.php", {method: "POST", body:JSON.stringify(jsonData)});
    };

    const updateTitle = () => {

        setTitle(document.getElementById("loadPageTitle").value);
    };

    const updateContents = () => {

        setContents(document.getElementById("loadPageText").value);
    };

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
            console.log(data[0]);
            setTitle(data[0].pagename);
            setContents(data[0].pagetext);
            console.log(contents);
        })
        .catch((error) => console.log(error));
    }, []);


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
                    <button className="tpwButton" onClick={ savePage }>Save</button>
                </div>

                <form className="nbpMain">
                    {/* Lorem Ipsum for filler until note pages implemented */}
                    <textarea className = "tpwPageTitle" id ="loadPageTitle" value={title}   onChange={updateTitle}/>
                    <textarea className = "tpwInputArea" id ="loadPageText" value={contents} onChange={updateContents}/>
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