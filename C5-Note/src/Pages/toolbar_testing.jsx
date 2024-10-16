import { useParams, useLocation, useNavigate } from "react-router-dom"; //to enable state 
import { Link } from "react-router-dom";
import './notebooks.css';   
import logo from '../C5.png';
import './toolbar.css';


import React, { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


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
                                Page {page.page_number}: {page.page_content || "Untitled Page"}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export function ToolTest(){
    //will be used later
    const { groupID, pageNum } = useParams();  // Access current groupID and current pageNum from the URL
    const location = useLocation();
    const { notebook, group, page } = location.state;  // Access state passed during navigation

    const [notebooks, setNotebooks] = useState([]); // Store other user's notebooks
    const [groups, setGroups] = useState([]); // Store the groups of the current notebook
    const [expanded, setExpanded] = useState(Array(groups.length).fill(false));

    //considering validation with user and current notebook content

    const placeholder = 'Start typing...'
    const editor = useRef(null);
    const navigate = useNavigate();
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
    
    const getCookie= (name) =>{
        let cookie = {};
        document.cookie.split(';').forEach(function(el) {
          let split = el.split('=');
          cookie[split[0].trim()] = split.slice(1).join("=");
        })
        return cookie[name];
    }

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
                body: JSON.stringify({ username, title: notebook.title })
            });
            const data = await response.json();
            if (data.success) {
                setGroups(data.groups);
            } else {
                console.error("Failed to fetch groups and pages");
            }
        };

        fetchGroups();
    }, [notebook.title]);
    
    const handleNotebookClick = async (otherNotebook) => {
        const username = getCookie('username');
    
        // Fetch groups for the clicked notebook
        const response = await fetch("backend/getNotebookGroups.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, title: otherNotebook.title }),
        });
    
        const data = await response.json();
    
        if (data.success && data.groups.length > 0) {
            // If groups exist, navigate to the first page of the first group
            const firstGroup = data.groups[0];
            const firstPage = firstGroup.pages.length > 0 ? firstGroup.pages[0] : null;
    
            if (firstPage) {
                // Navigate to the first page of the first group
                navigate(`/notebooks/${firstGroup.group_id}/${firstPage.page_number}`, {
                    state: { notebook: otherNotebook, group: firstGroup, page: firstPage }
                });
            } else {
                // If the group has no pages, navigate to the group page
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
                    <h1 className="clickableNotebookTitle" onClick={() => navigate(`/notebooks/${notebook.title}`, { state: { notebook } })}> {notebook.title} </h1>
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

        </>
    );





}