import bold_button from './images/bold-button.png'
import italic_button from './images/italic-button.png'
import underline_button from './images/underline-text.png'
import { Link } from "react-router-dom";
import ColorPicker from './ColorPicker';
import './toolbar.css';

export function Toolbar(){

    const colors = [
        '#000000', '#FFFFFF', '#808080', '#333333', '#D3D3D3',
        '#0000FF', '#003366', '#ADD8E6', '#FF0000', '#8B0000',
        '#008000', '#006400', '#90EE90', '#FFFF00', '#FFA500',
        '#800080', '#FFC0CB', '#A52A2A', '#008080', '#000080'
    ];

    const colorList = [
        null,        // None
        "#FFFF00",   // Yellow
        "#00FF00",   // Green
        "#FFC0CB",   // Pink
        "#ADD8E6",   // Blue
        "#FFA500",   // Orange
        "#800080",   // Purple
        "#FF0000",   // Red
        "#32CD32",   // Lime Green
        "#D3D3D3",   // Light Gray
        "#40E0D0"    // Turquoise
    ];
    

    const handleColorChange = (color) => {
        console.log('Selected Color:', color);
    };

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
                <ColorPicker 
                colors={colors} 
                initialColor="#000000" 
                onColorChange={handleColorChange} 
            />

                <span className='seperator'>|</span>
                <ColorPicker 
                icon={'H'}
                colors={colorList} 
                initialColor={null} 
                onColorChange={handleColorChange} 
            />
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