

import { Link } from "react-router-dom";
import './notebooks.css';   
import logo from '../C5.png';
import './toolbar.css';


import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';


export function ToolTest(){

        const placeholder = 'Start typing...'
        const editor = useRef(null);
        const [content, setContent] = useState('');
    
        const config = useMemo(() => ({
                readonly: false, // all options from https://xdsoft.net/jodit/docs/,
                placeholder: placeholder || 'Start typings...',
                theme: 'light',
                controls: {
                    font: {
                        list: {
                            'Roboto' : 'Roboto',
                            "Calibri" : 'Calibri',
                            'Garamond' : 'Garamond',
                            'Futura' : 'Futura',
                            'Comic Sans MS' : 'Comic-Sans'
                        }
                    },
                    fontsize: {
                        list: [4,6,8,10,12,14,16,18,22,26,32,40,48,56,64]
                    }
                },
                width: '100%',
                height: 1000,
            }),
            [placeholder]
        );


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
                    <div className="Editor_Area">
                    {/* Lorem Ipsum for filler until note pages implemented */}
                    <div className="custom-toolbar-example">
                    <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={newContent => {}}
                    />
                </div>
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