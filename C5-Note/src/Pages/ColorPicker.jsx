import React, { useState, useRef, useEffect } from 'react';
import './ColorPicker.css';

const ColorPicker = ({ colors = [], initialColor = '#ffffff', onColorChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(initialColor);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const selectColor = (color) => {
        setSelectedColor(color);
        setIsOpen(false);
        if (onColorChange) onColorChange(color); // Notify parent component of color change
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
            <button
                id="color-button"
                style={{ backgroundColor: selectedColor }}
                onClick={toggleDropdown}
            >
                Pick a Color
            </button>
            {isOpen && (
                <div className="dropdown-content">
                    {colors.map(color => (
                        <div
                            key={color}
                            className="color-option"
                            style={{ backgroundColor: color }}
                            onClick={() => selectColor(color)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ColorPicker;
