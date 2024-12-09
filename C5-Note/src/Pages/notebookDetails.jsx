import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Profile from '../C5.png';
import './notebookDetails.css';
import './home.css';
import { Search } from "./Search";

function Top_bar_simple_notes(){
    const getCookie= (name) =>{
      let cookie = {};
      document.cookie.split(';').forEach(function(el) {
        let split = el.split('=');
        cookie[split[0].trim()] = split.slice(1).join("=");
      })
      return cookie[name];
    }
  
      var name = getCookie('username')
      if (name == '' || typeof(name) == "undefined" ){
        name = 'DevModeOnly'
      }
  
      return(
        <div className='Top_bar'>
          <div className='Top_bar_elms'>
            {name != 'DevModeOnly' &&(
                <Link to="/note"><h1 className='Top_bar_text'>C5-Note</h1></Link>
            )}
            {name == 'DevModeOnly' &&(
                <Link to="/"><h1 className='Top_bar_text'>C5-Note</h1></Link>
            )}
            {/*switch the image to be agnostic to database images*/}
            <div className="profile_div">
              <div className="profile_div_color">
                <Link to={"/profile/" + name} style={{ textAlign: "center", width:"100%" }}>
                  <img id="frame" src={Profile} className="profile_image" alt="logo" />
                  <br />
                  <p style={{ display: "inline-block", maxWidth: "100%", overflow: "hidden" }}>{name}</p>
                </Link>
              </div>
              <Search />
            </div>
          </div>
  
        </div>
      )
  }

export function NotebookDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { notebook, readOnly } = location.state; // Access the notebook data from state
    const [groups, setGroups] = useState(null);
    const [groupsEmpty, setGroupsEmpty] = useState(false);
    const [editingGroupId, setEditingGroupId] = useState(null);
    const [newGroupName, setNewGroupName] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);

    const [noPages, setNoPages] = useState(false);

    
    useEffect(() => {
        var jsonData = { username: getCookie("username") };
        fetch("backend/getProfilePicture.php", { method: "POST", body: JSON.stringify(jsonData) }).then(response => {

            response.json().then(data => {

                if (data.status != "failed") {
                    //setSrc(response.blob);
                    frame.src = "backend/" + data.message;
                }
            })

        });
    }, []);



    /* Example of what groups would like life after useEffect()
    [
        {
            group_id: 1,  // The unique ID of the group
            group_name: "Chapter 1",
            pages: [
                {
                    page_number: 1,
                    page_content: "Introduction to Chapter 1"
                },
                {
                    page_number: 2,
                    page_content: "More details on Chapter 1"
                }
            ]
        },
        ... can be more group names and pages here
    ]

    Note: thinking when clicking into a page, we get redirected to the 
    */

    const getCookie= (name) =>{
        let cookie = {};
        document.cookie.split(';').forEach(function(el) {
          let split = el.split('=');
          cookie[split[0].trim()] = split.slice(1).join("=");
        })
        return cookie[name];
    }

    // Fetch groups JSON for the notebook
    useEffect(() => {
        const fetchGroups = async () => {
            var name = getCookie('username');

            const response = await fetch("backend/getNotebookGroups.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: name, // getting username thru cookies
                    id: notebook.id,
                    isInitialFetch : true,
                    guest: readOnly
                }),
            });

            const data = await response.json();
            if (data.success) {
                // handle empty groups
                const groupsData = data.groups || [];

                // Update state
                setGroups(groupsData);

                setGroupsEmpty(groupsData.length === 0);

                // Check if there are no pages in any group
                const hasPages = data.groups.some(group => group.pages && group.pages.length > 0);
                setNoPages(!hasPages);
            }
        };

        fetchGroups();
    }, [notebook]);

    // Function to handle the confirmation of deleting a group
    const handleConfirmDeleteGroup = async () => {
        if (groupToDelete) {
            const response = await fetch("backend/deleteGroup.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    group_id: groupToDelete.group_id,  // Send the group_id to delete
                }),
            });

            const data = await response.json();
            if (data.success) {
                setGroups((prevGroups) => prevGroups.filter((g) => g.group_id !== groupToDelete.group_id));
            } else {
                console.error("Failed to delete group");
            }
            setShowDeleteModal(false); // Close the modal
        }
    };

    // Function to open the delete confirmation modal
    const handleDeleteGroup = (group) => {
        setGroupToDelete(group);
        setShowDeleteModal(true);  // Show the modal
    };

    // Function to edit group name using group_id
    const handleEditGroupName = async (group) => {
        const response = await fetch("backend/editGroupName.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                group_id: group.group_id,  // Send the group_id to the backend
                new_group_name: newGroupName,
            }),
        });

        const data = await response.json();
        if (data.success) {
            // Update the group name in state
            setGroups((prevGroups) => 
                prevGroups.map((g) =>
                    g.group_id === group.group_id ? { ...g, group_name: newGroupName } : g
                )
            );
            setEditingGroupId(null);  // Exit edit mode
        } else {
            console.error("Failed to update group name");
        }
    };

    // Function to add a new group named "Untitled Group"
    const handleAddGroup = async () => {
        var name = getCookie('username');

        const response = await fetch("backend/addGroup.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: name,
                id: notebook.id,
                group_name: "Untitled Group",  // Automatically naming it "Untitled Group"
            }),
        });

        const data = await response.json();
        if (data.success) {
            // After successfully adding the group, reload the groups
            const newGroup = {
                group_id: data.group_id,  // Use the group_id from the response
                group_name: "Untitled Group",
                pages: []
            };
    
            // Update the state with the new group including the group_id
            setGroups((prevGroups) => [...prevGroups, newGroup]);
            setGroupsEmpty(false);
        } else {
            console.error("Failed to add group");
        }
    };

    // Function to add a new page to a group
    const handleAddPages = async (group) => {
        const username = getCookie('username');

        const response = await fetch("backend/addPages.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,  // The logged-in user
                id: notebook.id,  // The notebook id
                group_id: group.group_id,  // The ID of the group where the page will be added
                page_content: ""  // Page content can be an empty string
            }),
        });

        const data = await response.json();
        if (data.success) {
            // After successfully adding the page, reload the groups/pages
            const newPage = {
                page_number: data.page_number,  // New page number based on existing pages || old -> page_number: group.pages.length + 1
                page_content: "Untitled Page",  // Empty content
                page_order: data.page_order
            };
            
            // Update the state with the newly added page
            setGroups((prevGroups) =>
                prevGroups.map((g) => 
                    g.group_id === group.group_id ? 
                    { ...g, pages: [...g.pages, newPage] } : g
                )
            );
        } else {
            console.error("Failed to add page");
        }
    };
    
    const handleGroupPageClick = (group, page) => {
        navigate(`/notebooks/${group.group_id}/${page.page_number}`, { //thinking after the group id there should be the page
            state: { 
                notebook: notebook,  // Pass current notebook info
                group: group,         // Pass the clicked group info (group_id, group_name, and pages)
                page: page,           // Pass the clicked page info (page_number, page_content)
                readOnly: readOnly      //  
            }
        });
    };

    const handleGoBack = () => {
        // If there are no groups or groups exist but have no pages
        if (groups.length === 0 || noPages) {
            navigate('/note');  // Redirect to /note if no groups or no pages
        } else {
            navigate(-1);  // Go back to the previous page if groups and pages exist
        }
    };

    return (
    <>
        <Top_bar_simple_notes/>

        {/* React Bootstrap Modal for Deleting Confirmation */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
            <Modal.Header>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete the group "{groupToDelete?.group_name}"? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={handleConfirmDeleteGroup} style={{ backgroundColor: 'red', borderColor: 'red' }} >Delete</Button>
            </Modal.Footer>
        </Modal>

        <div className="mainBody">
            <div className="notebooks_list spacing" >
                <h1 className="label">{notebook.title}</h1>
                <h3>Description: {notebook.description}</h3> {/* fix css */}
                <div className="note-pages-header">
                    <h2>Note Pages</h2>
                    <div className="notebook-color-indicator" style={{ backgroundColor: notebook.color }}></div>
                </div>

                {/* If no groups exist, and we are NOT in readOnly mode, show "Add Group" button */}
                {groupsEmpty && !readOnly && (
                    <div>
                        <button onClick={handleAddGroup}>Add Group</button>
                    </div>
                )}

                {/* If groups exist, display them */}
                {!groupsEmpty && groups && (
                    <div>
                        <h3>Current Groups:</h3>
                        <ul>
                            {groups.map((group, index) => (
                                <li key={index}>

                                    {/* Check if this group is being edited */}
                                    {editingGroupId === group.group_id ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={newGroupName}
                                                onChange={(e) => setNewGroupName(e.target.value)}
                                                placeholder="New Group Name"
                                            />
                                            <button onClick={() => handleEditGroupName(group)}>Save</button>
                                            <button onClick={() => setEditingGroupId(null)}>Cancel</button>
                                            <button style={{color: "red"}} onClick={() => handleDeleteGroup(group)}>Delete X</button>
                                        </div>
                                    ) : (
                                        <>
                                            <span>{group.group_name}</span>

                                            {/* Render Edit button and Add Page button if NOT readOnly */}
                                            {!readOnly && (
                                                <button onClick={() => setEditingGroupId(group.group_id)}>Edit</button>
                                            )}
                                            {!readOnly && (
                                                <button onClick={() => handleAddPages(group)}>Add Page</button>
                                            )}
                                        </>
                                    )}

                                    <ul>
                                        {group.pages.map((page, pageIndex) => (
                                            <li key={pageIndex}>
                                                <button onClick={() => handleGroupPageClick(group, page)}>
                                                    {page.page_name || "Untitled Page"}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>

                        {/* Create an "Add Group" button if NOT readOnly */}
                        {!readOnly && (
                            <button onClick={handleAddGroup}>Add Group</button>
                        )}

                    </div>
                )}

            </div>
        </div>

        <button onClick={handleGoBack}>Go Back</button> {/* fix css */}

    </>    
    );
}