import { useParams, useLocation, useNavigate } from "react-router-dom"; //to enable state 
import { Link } from "react-router-dom";
import './notebooks.css';   
import logo from '../C5.png';
import './toolbar.css';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor, { Jodit } from 'jodit-react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Modal, Button } from 'react-bootstrap';


let unsavedChanges = 0;
let testcontent = ""
let yourUsername = ""

let loaded = 0;
let groups = []

function GroupDropdown({ group, notebook, isExpanded, toggleGroup, isSelectedGroup, selectedPage }) {
    return (
        <div className={`group ${isSelectedGroup ? "selected-group" : ""}`}>
            {/* Group name acts as a dropdown button */}
            <h1 className="clickableGroupName" onClick={toggleGroup}>
                {group.group_name}
            </h1>

            {/* Show pages only if the group is expanded */}
            {isExpanded && (
                <ul>
                    {group.pages.map((page, pageIndex) => (
                        <li key={pageIndex}>
                            <Link to={`/notebooks/${group.group_id}/${page.page_number}`} state={{ notebook, group, page }} className={isSelectedGroup && page.page_number === selectedPage ? "selected-page" : ""}>
                                Page {page.page_number}: {page.page_name || "Untitled Page"}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}


function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

function setCaretToPos (input, pos) {
    setSelectionRange(input, pos, pos);
}


export function ToolTest(){
    const { groupID, pageNum } = useParams();  // Access current groupID and current pageNum from the URL
    const location = useLocation();
    const { notebook, group, page } = location.state;  // Access state passed during navigation

    const [notebooks, setNotebooks] = useState([]); // Store other user's notebooks
    const [sharedNotebooks, setSharedNotebooks] = useState([]); // Store shared notebooks

    const [notebookId, setNotebookId] = useState(null); // To store notebook ID
    const [expanded, setExpanded] = useState(Array(groups.length).fill(false));
    
    const [placeholder, setPlace] = useState('Start typing...');
    const editor = useRef(null);
    const navigate = useNavigate();
    const [content, setContent] = useState('');

    //modal
    const [showAccessModal, setShowAccessModal] = useState(false); // State for showing modal
    const [sharedUsers, setSharedUsers] = useState([]); // To store users who already have access
    const [newUsername, setNewUsername] = useState(''); // Input field for new username
    const [errorMessage, setErrorMessage] = useState(''); // Error message for validation
    var test = useRef(null);
    const handleClose = () => {
        setShowAccessModal(false);
        setNewUsername('');
        setErrorMessage('');
    };
    const handleShow = () => {
        fetchSharedUsers(); // fetch shared users when modal opens
        setShowAccessModal(true);
    };

    

    const config = useMemo(() => ({
        cleanHTML: {
            denyTags: {
              script: true,
              button: true,
            }
          },events: 
          { 
           afterInit: (instance) => { test = instance; } 

            },
          
        
            readonly: false, // all options from https://xdsoft.net/jodit/docs/,
            placeholder: placeholder,
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
    
    const getCookie= (name) =>{
        let cookie = {};
        document.cookie.split(';').forEach(function(el) {
          let split = el.split('=');
          cookie[split[0].trim()] = split.slice(1).join("=");
        })
        return cookie[name];
    }


    useEffect(() => {
        const fetchusername = async () => {
            try {
                const response = await fetch("backend/getUsername.php", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                // Check if the response is okay
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log(data)
               yourUsername = data.username;  // Assuming the response contains a 'username' field
                //console.log(data)
            } catch (error) {
                console.error("Error fetching username:", error);
            }
        };

        fetchusername();  // Call the fetch function
    }, []); // Empty dependency array means this runs once after the initial render


    const currentUsername = yourUsername;

    // Handle drag end for reordering
    const handleDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return; // Dropped outside the list

        // Reorder groups array
        const reorderedGroups = Array.from(groups);
        const [movedGroup] = reorderedGroups.splice(source.index, 1);
        reorderedGroups.splice(destination.index, 0, movedGroup);

        // Update state and persist the new order
        groups=reorderedGroups;

        console.log(reorderedGroups);
        console.log(reorderedGroups.map(group => group.group_id));

        // Send new order to backend to persist it
        const username = yourUsername
        await fetch("backend/updateGroupOrder.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                title: notebook.title,
                reorderedGroups: reorderedGroups.map(group => group.group_id)  // Send only group IDs in the new order
            })
        });
    };

    const toggleGroup = (index) => {
        setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
    };

    // Fetch the user's notebooks
    useEffect(() => {
        const fetchNotebooks = async () => {
            const username = yourUsername
            console.log('fetch notebook')
            const response = await fetch("backend/notebookFinder.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ yourUsername })
            });
            const data = await response.json();
            console.log(data)
            if (Array.isArray(data)) {
                setNotebooks(data);  // Assuming the response is an array of notebooks
            } else {
                console.error("Failed to fetch notebooks");
            }
        };

        fetchNotebooks();
    }, []);
    

    const arraysAreEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;
    
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i].group_id !== arr2[i].group_id) {
                return false;
            }
        }
        return true;
    };
    
    const fetchGroups = async () => {
        const username = yourUsername;
        console.log(yourUsername)
        const response = await fetch("backend/getNotebookGroups.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ yourUsername, title: notebook.title })
        });
        const data = await response.json();
        if (data.success) {
            const fetchedGroups = data.groups;
            // Compare fetchedGroups with current groups
            if (!arraysAreEqual(groups, fetchedGroups)) {
                groups = fetchedGroups;
                setNotebookId(data.notebook_id);
    
                // Reset expanded state based on new groups length
                setExpanded(fetchedGroups.reduce((acc, _, index) => ({ ...acc, [index]: false }), {}));
            }
        } else {
            console.error("Failed to fetch groups and pages");
        }
    };
    
    

    // Fetch groups and pages for the current notebook
    useEffect(() => {
        

        fetchGroups();
    }, [notebook.title]);

    const fetchSharedNotebooks = async () => {
        const response = await fetch("backend/getSharedNotebooks.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: currentUsername })
        });
        const data = await response.json();
        if (Array.isArray(data)) {
            setSharedNotebooks(data);
        } else {
            console.error("Failed to fetch shared notebooks");
        }
    };
    
    // Fetch shared notebooks
    useEffect(() => {
        fetchSharedNotebooks();
    }, [currentUsername]);

    const handleNotebookClick = async (otherNotebook) => {
        const response = await fetch("backend/getNotebookGroups.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: currentUsername, title: otherNotebook.title }), // Corrected parameter name
        });
    
        const data = await response.json();
    
        if (data.success && Array.isArray(data.groups) && data.groups.length > 0) {
            // Ensure groups and pages exist as expected
            const firstGroup = data.groups[0];
            const firstPage = firstGroup.pages && firstGroup.pages.length > 0 ? firstGroup.pages[0] : null;
    
            if (firstPage) {
                // Navigate to the first page of the first group
                navigate(`/notebooks/${firstGroup.group_id}/${firstPage.page_number}`, {
                    state: { notebook: otherNotebook, group: firstGroup, page: firstPage }
                });
            } else {
                // Navigate to the group if no pages exist
                navigate(`/notebooks/${firstGroup.group_id}`, {
                    state: { notebook: otherNotebook, group: firstGroup }
                });
            }
        } else {
            // If no groups exist, navigate to the notebook page to create groups
            navigate(`/notebooks/${otherNotebook.id}`, {
                state: { notebook: otherNotebook }
            });
        }
    };

    //This is where code from the testpagewrite.jsx starts

    const [title, setTitle] = useState('Loading. . .');

    
    const saveContentToServer = async () => {
        if (editor.current) {
            const jsonData = {
                "pageid": pageNum,
                "groupid": groupID,
                "updatetext": editor.current.value,
            };
    
            await fetch("backend/saveNotebook.php", {
                method: "POST",
                body: JSON.stringify(jsonData),
            });
            //console.log('content saved!')
        }
    };

    const updateTitle = () => {

        setTitle(document.getElementById("loadPageTitle").value);
        unsavedChanges = 1;
    };

    const updateContents = (content) => {
        setContent(content);
        saveContentToServer()
    };

    const save_on = (content) =>{
        saveContentToServer()
        //console.log('username')
        //console.log(yourUsername)
        //console.log('username')
    }


    


    const fetchPageContent = async () => {
        fetchGroups()
        const jsonDataLoad = {
            "pageid": pageNum,
            "groupid": groupID
        };
    
        const response = await fetch("backend/getPageContent.php", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonDataLoad)
        });
    
        const data = await response.json();
    
        if (data['content']) {
            const elements = document.getElementsByClassName('jodit-wysiwyg');
            if (elements.length > 0) {
                const firstElement = elements[0];
                const selection = window.getSelection();
                let cursorPosition = 0;
                let targetParagraphIndex = 0;
        
                // Save current selection and cursor position
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    cursorPosition = range.startOffset;
        
                    // Find the index of the paragraph containing the cursor
                    const paragraphs = firstElement.getElementsByTagName('p');
                    for (let i = 0; i < paragraphs.length; i++) {
                        const paragraphRange = document.createRange();
                        paragraphRange.selectNodeContents(paragraphs[i]);
                        if (range.compareBoundaryPoints(Range.START_TO_END, paragraphRange) === 1) {
                            targetParagraphIndex = i;
                        }
                    }
                }
        
                // Update content if necessary
                if (yourUsername !== data['last_user'] || loaded === 0) {
                    console.log(yourUsername)
                    console.log(data['last_user'])
                    firstElement.innerHTML = data['content'];
                    firstElement.focus();
        
                    const newParagraphs = firstElement.getElementsByTagName('p');
                    if (newParagraphs.length > 0 && targetParagraphIndex < newParagraphs.length) {
                        const targetParagraph = newParagraphs[targetParagraphIndex];
                        const newRange = document.createRange();
                        let totalOffset = 0;
                        let found = false;
        
                        // Helper function to recursively traverse child nodes
                        const findTextNode = (node) => {
                            if (node.nodeType === Node.TEXT_NODE) {
                                const nodeLength = node.textContent.length;
                                if (totalOffset + nodeLength >= cursorPosition) {
                                    const positionToSet = cursorPosition - totalOffset;
                                    if (positionToSet <= nodeLength) {
                                        newRange.setStart(node, positionToSet);
                                        found = true;
                                        return true; // Stop recursion
                                    }
                                }
                                totalOffset += nodeLength;
                            } else if (node.nodeType === Node.ELEMENT_NODE) {
                                for (const child of node.childNodes) {
                                    if (findTextNode(child)) return true; // Continue searching
                                }
                            }
                            return false; // Not found
                        };
        
                        // Start searching from the target paragraph
                        findTextNode(targetParagraph);
        
                        // If found, collapse the range and set the selection
                        if (found) {
                            newRange.collapse(true); // Collapse to set the cursor position
                            selection.removeAllRanges(); // Clear existing selections
                            selection.addRange(newRange); // Add the new range
                        } else {
                            // Cursor position is out of bounds, set to end of the target paragraph
                            if (targetParagraph) {
                                newRange.selectNodeContents(targetParagraph);
                                newRange.collapse(false); // Move to the end
                                selection.removeAllRanges();
                                selection.addRange(newRange);
                            } else {
                                // Fallback to the end of the last paragraph if the target doesn't exist
                                const lastParagraph = newParagraphs[newParagraphs.length - 1];
                                if (lastParagraph) {
                                    newRange.selectNodeContents(lastParagraph);
                                    newRange.collapse(false); // Move to the end
                                    selection.removeAllRanges();
                                    selection.addRange(newRange);
                                }
                            }
                        }
                    }
        
                    loaded = 1; // Update loaded status
                }
            }
        
        
        } else {
            // Clear content if needed
            if (content !== '') {
                setContent('');
                const elements = document.getElementsByClassName('jodit-wysiwyg');
                if (elements.length > 0) {
                    elements[0].innerHTML = ''; // Clear the editor
                }
            }
        }
        loaded = 1; // Ensure loaded status is set
    };
    
    


    // Fetch page content whenever pageNum or groupID changes
    useEffect(() => {
        fetchPageContent();
    }, [pageNum, groupID]); // Run when pageNum or groupID changes


    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchPageContent();
        }, 250); // Adjust the interval time as needed (e.g., 5000 ms = 5 seconds)

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [pageNum, groupID]); // You might want to include dependencies if needed


    const stripTags = (stuff) => {
        const plainText = stuff.replace(/<[^>]+>/g, ''); // Regular expression to strip tags
        return plainText
    };




    // Fetch existing users who have access to this notebook
    const fetchSharedUsers = async () => {
        try {
            const response = await fetch("backend/getSharedUsers.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notebook_id: notebookId }) // Send the current notebook ID
            });
            const data = await response.json();
            if (data.success) {
                setSharedUsers(data.users); // Assuming users is an array of usernames
            } else {
                console.error("Failed to fetch shared users");
            }
        } catch (error) {
            console.error("Error fetching shared users:", error);
        }
    };

    // Handle Give Access button click
    const handleGiveAccess = async () => {
        setErrorMessage(''); 
        
        
        if (newUsername.trim() === '') { // Check if the input field is empty
            setErrorMessage("You can't leave this field empty.");
            return;
        }
        else if (newUsername === currentUsername) { // check if the user is trying to add themselves
            setErrorMessage("You can't give yourself access.");
            return;
        }

        try {
            const response = await fetch("backend/addSharedUser.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    notebook_id: notebookId,
                    username: newUsername
                })     
            });
            const data = await response.json();
            if (data.success) {
                setSharedUsers([...sharedUsers, newUsername]); // update the list with the new user
                setNewUsername(''); // clear the input field after successful update
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error("Error adding user access:", error);
        }
    };






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
                        <Link to="/note"><img src={logo} className="nbpLogo"/></Link>
                        <span>C5-Note</span>
                    </div>
                    <div className="nbpHeaderRight">
                        <Link to="/note"><button className="nbpButtonHome nbpAlignRight">Profile</button></Link>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="nbpToolbar">
                    <Link to="/"><button className="nbpButtonHome">Download</button></Link>

                    <button className="nbpButtonHome" onClick={handleShow}>Access</button> {/* shows Modal */}

                    <Link to="/"><button className="nbpButtonHome">Rename</button></Link>
                    <Link to="/"><button className="nbpButtonHome">Copy URL</button></Link>
                </div>

                <article className="nbpMain">
                    <div className="Editor_Area">
                    {/* Lorem Ipsum for filler until note pages implemented */}
                    <div className="custom-toolbar-example">
                    <JoditEditor
                    id='editor'
                        ref={editor}
                        value={content}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newContent => updateContents(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={newContent => save_on(newContent)}
                    />
                </div>
                    </div>
                </article>

                <aside className="aside nbpSidebarNotebooks">
                    <h1 className="clickableNotebookTitle currentNotebookTitle" style={{ backgroundColor: notebook.color }} onClick={() => navigate(`/notebooks/${notebook.title}`, { state: { notebook } })}> 
                        {notebook.title} 
                    </h1>
                    <h3>Other Notebooks</h3>
                    <ul>
                        {notebooks
                            .filter((otherNotebook) => otherNotebook.title !== notebook.title) // Exclude current notebook
                            .map((otherNotebook, index) => (
                                <li key={index}>
                                    <button onClick={() => handleNotebookClick(otherNotebook)}>
                                        {otherNotebook.title}
                                    </button>
                                </li>
                            ))}
                    </ul>

                    <h3>Shared Notebooks</h3>
                    <ul>
                        {sharedNotebooks.length === 0 ? (
                            <p>No shared notebooks available.</p>
                        ) : (
                            sharedNotebooks
                                .filter((sharedNotebook) => sharedNotebook.title !== notebook.title)
                                .map((sharedNotebook, index) => (
                                    <li key={index}>
                                        <button onClick={() => handleNotebookClick(sharedNotebook)}>
                                            {sharedNotebook.title}
                                        </button>
                                    </li>
                                ))
                        )}
                    </ul>

                </aside>

                <aside className="aside nbpSidebarPages">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="groups">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {groups.map((group, index) => (
                                        <Draggable key={group.group_id} draggableId={`${group.group_id}`} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <GroupDropdown
                                                        group={group}
                                                        notebook={notebook}
                                                        isExpanded={expanded[index]}
                                                        toggleGroup={() => toggleGroup(index)}
                                                        isSelectedGroup={group.group_id === parseInt(groupID)}
                                                        selectedPage={parseInt(pageNum)}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </aside>

                <footer className="nbpFooter" style={{ backgroundColor: notebook.color }}>Footer</footer>

            </div>

            {/* access buttom modal/popup */}
            <Modal show={showAccessModal} onHide={handleClose} centered>
                <Modal.Header className="modal-header-custom">
                    <Modal.Title className="modal-title-wrapper">
                        <span className="modal-title">{notebook.title}</span>
                        <p className="modal-created-by">Created by: {getCookie('username')}</p>
                    </Modal.Title>
                    <Button 
                        onClick={handleClose} 
                        className="modal-close-button"
                    >
                        &times;
                    </Button>
                </Modal.Header>

                <Modal.Body>
                    <ul>
                        {sharedUsers.map((user, index) => (
                            <li key={index}>{user}</li> // Display each shared user
                        ))}
                    </ul>

                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)} // Update state with input
                        />
                        <Button variant="primary" onClick={handleGiveAccess}>
                            Give Access
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}