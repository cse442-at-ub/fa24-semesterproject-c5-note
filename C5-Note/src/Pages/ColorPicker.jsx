import React, { useState, useRef, useEffect } from 'react';
import './ColorPicker.css';
import transparent from './images/transparent.png'

const ColorPicker = ({ icon = 'A', colors = [], initialColor = '#ffffff', onColorChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(initialColor);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const selectColor = (color) => {
        setSelectedColor(color);
        setIsOpen(false);
        if (onColorChange) onColorChange(color === null ? 'None' : color); // Notify parent of selection
    };
    

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="color-picker" ref={dropdownRef}>
            <div
                className="color-display"
                onClick={toggleDropdown}
                tabIndex={0} // Make it focusable
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        toggleDropdown();
                    }
                }}
            >
                <span className="letter">{icon}</span>
                <div
                    className="color-box"
                    style={{ backgroundColor: selectedColor }}
                />
            </div>
            {isOpen && (
    <div className="dropdown-content">
        
        {colors.filter(color => color !== null).map(color => (
            <div
                key={color}
                className={`color-option ${selectedColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => selectColor(color)}
            />
        ))}

        {colors.filter(color => color === null).map(color => (
                    <div
                    key="none" // Unique key for the None option
                    className={`color-option ${selectedColor === null ? 'active' : ''} longer`}
                    onClick={() => selectColor(null)}
                    style={{ backgroundImage: `url(${transparent})`, backgroundSize: 'cover' }} // Set your image URL here
                >
                    None
                </div>
                ))}


    </div>
)}



        </div>
    );
    
};

export default ColorPicker;
