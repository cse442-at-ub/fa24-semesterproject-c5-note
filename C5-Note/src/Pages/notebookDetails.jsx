import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from '../C5.png';
import './notebookDetails.css';
import './home.css';

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
            <h1 className='Top_bar_text'>C5-Note</h1>
              {/*switch the image to be agnostic to database images*/}
              <div className="profile_div">
                <div className="profile_div_color">
                  <img src={Profile} className="profile_image" alt="logo" />
                  <p>{ name }</p>
                  </div>
              </div>
          </div>
            
        </div>
      )
  }

//might need some security checks that current logged in user has access to current notebook
export function NotebookDetail() {

    const location = useLocation();
    const navigate = useNavigate();
    const { notebook } = location.state; // Access the notebook data from state


    const [groups, setGroups] = useState(null); // Store the groups JSON
    const [groupsEmpty, setGroupsEmpty] = useState(false);

    /* Example of what groups would like life after useEffect()
    [
        {
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
                    title: notebook.title,
                }),
            });

            const data = await response.json();
            if (data.success) {
                // handle empty groups
                const groupsData = data.groups || [];

                // Update state
                setGroups(groupsData);

                setGroupsEmpty(groupsData.length === 0);
            }
        };

        fetchGroups();
    }, [notebook]);

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
                title: notebook.title,
                group_name: "Untitled Group",  // Automatically naming it "Untitled Group"
            }),
        });

        const data = await response.json();
        if (data.success) {
            // After successfully adding the group, reload the groups
            setGroups((prevGroups) => [...prevGroups, { group_name: "Untitled Group", pages: [] }]);
            setGroupsEmpty(false);
        } else {
            console.error("Failed to add group");
        }
    };

    return (
    <>
        <Top_bar_simple_notes/>

        <div className="mainBody">
            <div className="notebooks_list spacing" >
                <h1 className="label">{notebook.title}</h1>
                <h3>{notebook.description}</h3> {/* fix css */}
                <div className="note-pages-header">
                    <h2>Note Pages</h2>
                    <div className="notebook-color-indicator" style={{ backgroundColor: notebook.color }}></div>
                </div>

                {/* If no groups exist, show "Add Group" button */}
                {groupsEmpty && (
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
                                        {group.group_name}
                                        <ul>
                                            {group.pages.map((page, pageIndex) => (
                                                <li key={pageIndex}>Page {page.page_number}: {page.page_content}</li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                    </div>
                )}

            </div>
        </div>

        <button onClick={() => navigate(-1)}>Go Back</button> {/* fix css */}

    </>    
    );
}