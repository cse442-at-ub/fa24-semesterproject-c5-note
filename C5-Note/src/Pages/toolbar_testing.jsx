import { Link } from "react-router-dom";
import { Toolbar } from './toolbar'
import './toolbar.css';

export function ToolTest(){
    return(
        <>
            <Toolbar />
            <div className="test_box">
                <textarea></textarea>
            </div>
        </>
    )
}