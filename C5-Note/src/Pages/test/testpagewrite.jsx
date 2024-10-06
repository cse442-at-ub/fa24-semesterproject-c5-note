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

// Store the default page as a var
var mypage;


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

    // Convert
    mypage = await response.json();

    // Test
    console.log("Loaded page:");
    console.log(mypage);

}

// Call the function that was just declared
defaultPageFetch();


// export function DefaultPageLoad(){
//     fetch("../../backend/test/tpwloadpagejson.php", {
//         method: "POST",
//         headers: {
//             Accept: 'application.json',
//             "Content-Type": "application/json"
//             },
//         body: "page='1'"
//     })
//     .then((response) => {
//         return response.json();
//     })
//     .then((data) =>{
//         const text1 = data[0].pagename;
//     })
//     .catch(error => {
//         console.error(error);
//     });
// }

// Create a test page as a JSON object
const testpage = {
    pagename:   'My Test Page',
    pagetext:   'Text in a text page that was not fetched from any database.',
};



export function TestPageWrite(){

    const [data,setData] = useState([]);

    // Runs on page load
    useEffect(() => {

        fetch("backend/test/tpwloadpagejson.php", {
            method: "POST",
            headers: {
                Accept: 'application.json',
                "Content-Type": "application/json"
                },
            body: "page='1'"
        })
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then(data => setData(data))
        .catch(error => {
            console.error(error);
        });

    },[]);





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
                    <h1 className = "tpwPageTitle">{testpage.pagename}</h1>
                    <textarea className = "tpwInputArea">{testpage.pagetext}</textarea>
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