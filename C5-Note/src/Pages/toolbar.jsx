import bold_button from './images/bold-button.png'
import italic_button from './images/italic-button.png'
import underline_button from './images/underline-text.png'
import { Link } from "react-router-dom";
import './toolbar.css';

export function Toolbar(){
    return(
        <>

            <div className="toolbar_main">
                <div className='toolbar_sub'>

                <span className='seperator'>|</span>
                <select name="cars" id="cars" className="option_drop">
                    <option value="times_new" className="times_new" >Times New Roman</option>
                    <option value="Arial"className="Arial">Arial</option>
                    <option value="Helvetica"className="Helvetica">Helvetica</option>
                    <option value="Calibri" className="Calibri">Calibri</option>
                    <option value="Verdana" className="Verdana">Verdana</option>
                    <option value="Georgia" className="Georgia">Georgia</option>
                    <option value="Courier" className="Courier">Courier New</option>
                    <option value="Roboto" className="Roboto">Roboto</option>
                    <option value="Garamond" className="Garamond">Garamond</option>
                    <option value="Futura" className="Futura">Futura</option>
                </select>

                <span className='seperator'>|</span>
                <select name="cars" id="cars">
                    <option value="volvo">4px</option>
                    <option value="saab">6px</option>
                    <option value="mercedes">8px</option>
                    <option value="audi">10px</option>
                    <option value="volvo">12px</option>
                    <option value="saab">14px</option>
                    <option value="mercedes">16px</option>
                    <option value="audi">18px</option>
                    <option value="audi">22px</option>
                    <option value="audi">26px</option>
                    <option value="volvo">32px</option>
                    <option value="saab">40px</option>
                    <option value="mercedes">48px</option>
                    <option value="audi">56px</option>
                    <option value="audi">64px</option>
                    <option value="audi">72px</option>
                </select>
                <span className='seperator'>|</span>
                <select name="cars" id="cars">
                    <option value="volvo">Black</option>
                    <option value="saab">White</option>
                    <option value="mercedes">Gray</option>
                    <option value="audi">Dark Gray</option>
                    <option value="volvo">Light Gray</option>
                    <option value="saab">Blue</option>
                    <option value="mercedes">Dark Blue</option>
                    <option value="audi">Light Blue</option>
                    <option value="audi">Red</option>
                    <option value="audi">Dark Red</option>
                    <option value="volvo">Green</option>
                    <option value="saab">Dark Green</option>
                    <option value="mercedes">Light Green</option>
                    <option value="audi">Yellow</option>
                    <option value="audi">Brown</option>
                    <option value="audi">Teal</option>
                    <option value="saab">Navy</option>
                </select>

                <span className='seperator'>|</span>
                <select name="cars" id="cars">
                    <option value="volvo">None</option>
                    <option value="saab">Yellow</option>
                    <option value="mercedes">Green</option>
                    <option value="audi">Pink</option>
                    <option value="volvo">Orange</option>
                    <option value="saab">Purple</option>
                    <option value="mercedes">Red</option>
                    <option value="audi">Lime Green</option>
                    <option value="audi">Light Gray</option>
                    <option value="audi">Turquoise</option>
                </select>
                <span className='seperator'>|</span>
                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" hidden></input>
                <label for="vehicle1">{<img src={bold_button} className="button_icons" />}</label>
                <span className='seperator'>|</span>
                <input type="checkbox" id="vehicle2" name="vehicle2" value="Bike" hidden></input>
                <label for="vehicle2">{<img src={italic_button} className="button_icons" />}</label>
                <span className='seperator'>|</span>
                <input type="checkbox" id="vehicle3" name="vehicle3" value="Bike" hidden></input>
                <label for="vehicle3">{<img src={underline_button} className="button_icons"  />}</label>
                <span className='seperator'>|</span>

                </div>
            

            </div>

        </>
      )
}