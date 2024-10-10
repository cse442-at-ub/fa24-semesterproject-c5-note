

import { Link } from "react-router-dom";
import './notebooks.css';   
import logo from '../C5.png';
import { Toolbar } from './toolbar'
import './toolbar.css';

import { useQuill } from "react-quilljs";
// or const { useQuill } = require('react-quilljs');

import "quill/dist/quill.snow.css"; // Add css for snow theme
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme

export function ToolTest(){

    const { quill, quillRef } = useQuill({ placeholder: "Typing...." });

    console.log(quill); // undefined > Quill Object
    console.log(quillRef); // { current: undefined } > { current: Quill Editor Reference }


    return(
        <>
            {/* Formatting the Note-Taking App via Flexbox
            * This layout below is the order for mobile viewing.
            * Desktop and midrange layouts are handled via CSS.
            */}
            <div className ="notebooksPageWrapper">

                {/* Header */}
                <div className="nbpHeader">
                    <div className="nbpHeaderLeft">
                        <Link to="/"><img src={logo} className="nbpLogo"/></Link>
                        <span>C5-Note</span>
                    </div>
                    <div className="nbpHeaderRight">
                        <Link to="/note"><button className="nbpButtonHome nbpAlignRight">Profile</button></Link>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="nbpToolbar">
                    <Link to="/"><button className="nbpButtonHome">Download</button></Link>
                    <Link to="/"><button className="nbpButtonHome">Access</button></Link>
                    <Link to="/"><button className="nbpButtonHome">Rename</button></Link>
                    <Link to="/"><button className="nbpButtonHome">Copy URL</button></Link>
                </div>
                <article className="nbpMain">
                    {/* Lorem Ipsum for filler until note pages implemented */}
                    <div style={{ width: 500, height: 300 }}>
                    <div ref={quillRef} />
                    </div>
                </article>
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