

import { Link } from "react-router-dom";
import './notebooks.css';   
import logo from '../C5.png';
import { Toolbar } from './toolbar'
import './toolbar.css';
import Quill from 'quill';


import { useQuill } from "react-quilljs";
// or const { useQuill } = require('react-quilljs');

import "quill/dist/quill.snow.css"; // Add css for snow theme
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme


export function ToolTest(){
    const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
  "Times New Roman"
];
Quill.register(Font, true);


    const theme = 'snow';
  // const theme = 'bubble';

  const fonts = [
    { value: 'sans-serif', label: 'Sans Serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'monospace', label: 'Monospace' },
    { value: 'arial', label: 'arial' },
    { value: 'comic-sans', label: 'comic-sans' },
    { value: 'Times New Roman', label: 'times-new-roman' }
];


const fontOptions = fonts.map(font => font.value);


const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'font': fontOptions }], // Add the font options here
        [{ align: [] }],
        [{ list: 'ordered'}, { list: 'bullet' }, { 'list': 'check' }],
        [{ indent: '-1'}, { indent: '+1' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['link', 'image', 'video'],
        [{ color: [] }, { background: [] }],
        ['clean'],
    ],
    clipboard: {
        matchVisual: false,
    },
};

  const placeholder = 'type here....';

  const formats = [
    'bold', 'italic', 'underline', 'strike','font',
    'align', 'list', 'indent',
    'size', 'header',
    'link', 'image', 'video',
    'color', 'background',
    'clean'
  ];

  const { quill, quillRef } = useQuill({ theme, modules, formats, placeholder });


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
                    <div style={{ width: 1200, height: 1000 }}>
                    <div ref={quillRef} />
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