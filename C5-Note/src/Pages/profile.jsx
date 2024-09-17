import { Link } from "react-router-dom";
import Profile from '../C5.png';
import { Top_bar } from './home.jsx';

export function Profile(){
    return(
        <>
            <Top_bar/>
            <h1>Notebook Page</h1>
            <div id='User'>
                <img src={Profile} className="" alt="logo" />
                <h2>Username:</h2>
            </div>
            <Link to="/"><button className="CoolButton">Take Notes</button></Link>
            <Link to="/"><button className="CoolButton">Log Out</button></Link>
        </>
    )
}