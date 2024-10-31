import React from 'react';
import './Grid.css'; // Assuming you will create a CSS file for styling

const ItemGrid = ({ items }) => {
  return (
    <div className="grid-container">
      {items.map((item, index) => (
        <div className="grid-item" key={index}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default ItemGrid;
