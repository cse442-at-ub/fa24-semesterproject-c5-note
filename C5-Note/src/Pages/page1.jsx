import sax from '../Saxophone.png'
import { Link } from "react-router-dom";

export function Page1(){
    return(
        <>
            <h1>This is the new page</h1>
            <img src={sax} className="App-logo" alt="logo" />
            <br />
            <br />
            <Link to="/"><button className="CoolButton">Go Home</button></Link>
        </>
    )
}