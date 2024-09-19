import logo from '../C5.png';
import '../App.css';
import { Link } from "react-router-dom";

export function Home(){
    return(
        <>
            <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br />
        <p>
          C5 Note
        </p>
        <Link to="/next"><button className="CoolButton">Go To Next Page</button></Link>
      </header>
    </div>
        </>
    )
}