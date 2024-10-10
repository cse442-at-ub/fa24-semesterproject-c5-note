// App.jsx
import React from 'react';
import { Editor } from './Editor'; // Adjust the path if necessary

export const Etest = () => (
  <div className="custom-toolbar-example">
    <h3>Custom Toolbar with React Quill (Fully working)</h3>
    <Editor placeholder={"Write something or insert a heart ♥"} />
  </div>
);

