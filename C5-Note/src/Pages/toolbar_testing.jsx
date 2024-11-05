import { useParams, useLocation, useNavigate } from "react-router-dom"; //to enable state 
import { Link } from "react-router-dom";
import './notebooks.css';   
import logo from '../C5.png';
import './toolbar.css';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Modal, Button } from 'react-bootstrap';


let unsavedChanges = 0;
let testcontent = ""

function GroupDropdown({ group, notebook, isExpanded, toggleGroup, isSelectedGroup, selectedPage, readOnly, handlePageDragEnd }) {
    return (
        <div className={`group ${isSelectedGroup ? "selected-group" : ""}`}>
            <h1 className="clickableGroupName" onClick={toggleGroup}>
                {group.group_name}
            </h1>

            {isExpanded && (
                <DragDropContext onDragEnd={handlePageDragEnd}> {/* Drag context for pages */}
                    <Droppable droppableId={`group-${group.group_id}`} type="page">
                        {(provided) => (
                            <ul ref={provided.innerRef} {...provided.droppableProps}>
                                {group.pages.map((page, index) => (
                                    <Draggable key={page.page_number} draggableId={`page-${page.page_number}`} index={index}>
                                        {(provided) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <Link to={`/notebooks/${group.group_id}/${page.page_number}`} 
                                                      state={{ notebook, group, page, readOnly }}
                                                      className={isSelectedGroup && page.page_number === selectedPage ? "selected-page" : ""}
                                                >
                                                    Page {page.page_number}: {page.page_name || "Untitled Page"}
                                                </Link>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
        </div>
    );
}

export function ToolTest(){
    const { groupID, pageNum } = useParams();  // Access current groupID and current pageNum from the URL
    const location = useLocation();
    const { notebook, readOnly } = location.state;  // Access state passed during navigation

    const [notebooks, setNotebooks] = useState([]); // Store other user's notebooks
    const [sharedNotebooks, setSharedNotebooks] = useState([]); // Store shared notebooks

    const [groups, setGroups] = useState([]); // Store the groups of the current notebook
    const [notebookId, setNotebookId] = useState(null); // To store notebook ID
    const [expanded, setExpanded] = useState(Array(groups.length).fill(false));
    
    const [placeholder, setPlace] = useState('Start typing...');
    const editor = useRef(null);
    const navigate = useNavigate();
    const [content, setContent] = useState('');

    //sharing modal
    const [showAccessModal, setShowAccessModal] = useState(false); // State for showing modal
    const [sharedUsers, setSharedUsers] = useState([]); // To store users who already have access
    const [newUsername, setNewUsername] = useState(''); // Input field for new username
    const [errorMessage, setErrorMessage] = useState(''); // Error message for validation



    const handleClose = () => {
        setShowAccessModal(false);
        setNewUsername('');
        setErrorMessage('');
    };
    const handleShow = () => {
        fetchSharedUsers(); // fetch shared users when modal opens
        setShowAccessModal(true);
    };

    //downloading modal
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState(".pdf");

    const handleDownloadClose = () => {
        setShowDownloadModal(false);
        setSelectedFormat(".pdf");
    };
    const handleDownloadShow = () => {
        setShowDownloadModal(true);
    };
    const handleFormatChange = (e) => {
        setSelectedFormat(e.target.value);
    };
    const handleDownload = () => {
        fetchContentForDownload().then((content) => {
            const filename = notebook.title; // Use the notebook title as the base filename
    
            if (selectedFormat === ".txt") {
                // Handle .txt download directly on the client side
                const blob = new Blob([content], { type: "text/plain" });
                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = `${filename}.txt`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } else {
                // Handle PDF and DOCX download by sending a request to the backend
                const url = selectedFormat === ".pdf" ? "backend/generatePDF.php" : "backend/generateDOCX.php";
    
                // Send HTML content to backend PHP script for PDF or DOCX generation
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        htmlContent: content,
                        filename: filename,
                    }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to generate the file");
                        }
                        return response.blob();
                    })
                    .then((blob) => {
                        // Trigger file download
                        const downloadLink = document.createElement("a");
                        downloadLink.href = URL.createObjectURL(blob);
                        downloadLink.download = `${filename}${selectedFormat}`;
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                    })
                    .catch((error) => {
                        console.error("Error downloading file:", error);
                    });
            }
        });
        handleDownloadClose();
    };
    const fetchContentForDownload = async () => {
        const response = await fetch("backend/getPageContent.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pageid: pageNum, groupid: groupID })
        });
        const data = await response.json();
        return data.content || ""; // Return the fetched content or empty if not found
    };

    const config = useMemo(() => ({
        cleanHTML: {
            denyTags: {
              script: true,
              button: true,
            }
          },
        
            readonly: readOnly, // all options from https://xdsoft.net/jodit/docs/,
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

    const currentUsername = getCookie('username');

    // Handle drag end for reordering
    const handleDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return; // Dropped outside the list

        // Reorder groups array
        const reorderedGroups = Array.from(groups);
        const [movedGroup] = reorderedGroups.splice(source.index, 1);
        reorderedGroups.splice(destination.index, 0, movedGroup);

        // Update state and persist the new order
        setGroups(reorderedGroups);

        console.log(reorderedGroups);
        console.log(reorderedGroups.map(group => group.group_id));

        // Send new order to backend to persist it
        const username = getCookie('username');
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

    const handlePageDragEnd = async (result) => {
        const { source, destination } = result;

        // Check if the item was dropped outside any droppable area
        if (!destination) return;

        // Parse group IDs from the source and destination droppable IDs
        const sourceGroupId = parseInt(source.droppableId.split('-')[1]);
        const destinationGroupId = parseInt(destination.droppableId.split('-')[1]);

        // Only proceed if the item was dropped within the same group
        if (sourceGroupId !== destinationGroupId) return;

        // Find the index of the group in the current state
        const groupIndex = groups.findIndex(group => group.group_id === sourceGroupId);
        const reorderedPages = Array.from(groups[groupIndex].pages);

        // Reorder pages within the group
        const [movedPage] = reorderedPages.splice(source.index, 1);
        reorderedPages.splice(destination.index, 0, movedPage);

        // Update the state with the reordered pages in the specific group
        const updatedGroups = [...groups];
        updatedGroups[groupIndex] = {
            ...groups[groupIndex],
            pages: reorderedPages
        };
        setGroups(updatedGroups);

        // Update page order in the backend
        try {
            const response = await fetch("backend/updatePageOrder.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    group_id: sourceGroupId,
                    reorderedPages: reorderedPages.map((page, index) => ({
                        page_number: page.page_number,
                        page_order: index + 1
                    }))
                })
            });

            // Optional: Check for successful response
            const data = await response.json();
            if (!data.success) {
                console.error("Failed to update page order on the backend:", data.message);
            }
        } catch (error) {
            console.error("Error updating page order:", error);
        }
    };

    const toggleGroup = (groupIndex) => {
        setExpanded((prevExpanded) => {
            const newExpanded = [...prevExpanded];
            newExpanded[groupIndex] = !newExpanded[groupIndex]; // Toggle visibility for the specific group
            return newExpanded;
        });
    };

    // Fetch the user's notebooks
    useEffect(() => {
        const fetchNotebooks = async () => {
            const username = getCookie('username');
            const response = await fetch("backend/notebookFinder.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setNotebooks(data);  // Assuming the response is an array of notebooks
            } else {
                console.error("Failed to fetch notebooks");
            }
        };

        fetchNotebooks();
    }, []);
    
    // Fetch groups and pages for the current notebook
    useEffect(() => {
        const fetchGroups = async () => {
            const username = getCookie('username');
            const response = await fetch("backend/getNotebookGroups.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, title: notebook.title, readOnly: readOnly })
            });
            const data = await response.json();
            if (data.success) {
                setGroups(data.groups);
                setNotebookId(data.notebook_id);
            } else {
                console.error("Failed to fetch groups and pages");
            }
        };

        fetchGroups();
    }, [notebook.title]);
    
    // Fetch shared notebooks
    useEffect(() => {
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
                    state: { notebook: otherNotebook, group: firstGroup, page: firstPage , readOnly: readOnly}
                });
            } else {
                // Navigate to the group if no pages exist
                navigate(`/notebooks/${firstGroup.group_id}`, {
                    state: { notebook: otherNotebook, group: firstGroup , readOnly: readOnly}
                });
            }
        } else {
            // If no groups exist, navigate to the notebook page to create groups
            navigate(`/notebooks/${otherNotebook.id}`, {
                state: { notebook: otherNotebook, readOnly: readOnly}
            });
        }
    };

    //This is where code from the testpagewrite.jsx starts

    const [title, setTitle] = useState('Loading. . .');

    const savePage = () => {
        console.log(editor.current.value)

        // What to send in the PHP query
        //  > Test page is hardcoded to load page with page_id = 1
        var jsonData = {
            "pageid":  pageNum,
            "groupid": groupID,
            "updatetext" : editor.current.value,
        };
        fetch("backend/saveNotebook.php", {method: "POST", body:JSON.stringify(jsonData)});

        testcontent = editor.current.value; 
        unsavedChanges = 0;
        
    };

    const updateTitle = () => {

        setTitle(document.getElementById("loadPageTitle").value);
        unsavedChanges = 1;
    };

    const updateContents = (content) => {
        console.log(content)
        setContent(content);
        unsavedChanges = 1;
    };


    const fetchPageContent = async () => {
        var jsonDataLoad = {
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
        console.log(data)
        if (data['content']) {
            setContent(data['content']);
            testcontent = data['content'];
        } else {
            setContent('');
            testcontent = '';
        }
    };

    // Fetch page content whenever pageNum or groupID changes
    useEffect(() => {
        fetchPageContent();
    }, [pageNum, groupID]); // Run when pageNum or groupID changes

    const stripTags = (stuff) => {
        const plainText = stuff.replace(/<[^>]+>/g, ''); // Regular expression to strip tags
        return plainText
    };

    // Generic "are you sure" dialog prompt
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            // Perform actions before the component unloads
            console.log(testcontent)
            console.log(editor.current.value)
            if((unsavedChanges == 1 && stripTags(testcontent) != stripTags(editor.current.value)) || (stripTags(testcontent) != stripTags(editor.current.value))){
                event.preventDefault();
            }
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    
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
                     <button className="nbpButtonHome" onClick={handleDownloadShow}>Download</button>

                    <button className="nbpButtonHome" onClick={handleShow}>Access</button> {/* shows Modal */}

                    {!readOnly && (
                        <Link to="/"><button className="nbpButtonHome">Rename</button></Link>
                    )}
                    <Link to="/"><button className="nbpButtonHome">Copy URL</button></Link>
                    {!readOnly && (
                        <button className="tpwButton" onClick={ savePage }>Save</button>
                    )}
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
                        onBlur={newContent => updateContents(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={newContent => {}}
                    />
                </div>
                    </div>
                </article>

                <aside className="aside nbpSidebarNotebooks">
                    {!readOnly && (<h1 className="clickableNotebookTitle currentNotebookTitle" style={{ backgroundColor: notebook.color }} onClick={() => navigate(`/notebooks/${notebook.title}`, { state: { notebook, readOnly } })}> 
                        {notebook.title} 
                    </h1>)}
                    {readOnly && (<h1 className="currentNotebookTitle" style={{ backgroundColor: notebook.color }}> 
                        {notebook.title} 
                    </h1>)}
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
                    <DragDropContext onDragEnd={handleDragEnd}> {/* Drag context for groups */}
                        <Droppable droppableId="groups" type="group">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {groups.map((group, index) => (
                                        <Draggable 
                                            key={group.group_id} 
                                            draggableId={`group-${group.group_id}`} 
                                            index={index} 
                                            isDragDisabled={expanded[index]} // Disable dragging if the group is expanded
                                        >
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <GroupDropdown
                                                        group={group}
                                                        notebook={notebook}
                                                        isExpanded={expanded[index]}
                                                        toggleGroup={() => toggleGroup(index)}
                                                        isSelectedGroup={group.group_id === parseInt(groupID)}
                                                        selectedPage={parseInt(pageNum)}
                                                        readOnly={readOnly}
                                                        handlePageDragEnd={handlePageDragEnd} // Pass handlePageDragEnd as a prop
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

            {/* Download Modal */}
            <Modal show={showDownloadModal} onHide={handleDownloadClose} centered>
                <Modal.Header>
                    <Modal.Title>Download Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <h5>Select File Format:</h5>
                        <div>
                            <input
                                type="radio"
                                id="pdf"
                                name="format"
                                value=".pdf"
                                checked={selectedFormat === ".pdf"}
                                onChange={handleFormatChange}
                            />
                            <label htmlFor="pdf">PDF (.pdf)</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="docx"
                                name="format"
                                value=".docx"
                                onChange={handleFormatChange}
                            />
                            <label htmlFor="docx">Word Document (.docx)</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="txt"
                                name="format"
                                value=".txt"
                                onChange={handleFormatChange}
                            />
                            <label htmlFor="txt">Text File (.txt)</label>
                        </div>
                    </div>

                    <div style={{ fontSize: '0.85em', color: 'grey', marginTop: '10px' }}>
                        For a customized download location, enable "Ask where to save each file before downloading" in your browser’s settings.
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDownloadClose}>Cancel</Button>
                    <Button variant="success" onClick={handleDownload}>Download</Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}