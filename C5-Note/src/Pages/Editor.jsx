// Editor.jsx
import React from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const CustomHeart = () => <span>♥</span>;

function insertHeart() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "♥");
  this.quill.setSelection(cursorPosition + 1);
}

const CustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-font">
      <option value="arial" selected>Arial</option>
      <option value="comic-sans">Comic Sans</option>
      <option value="courier-new">Courier New</option>
      <option value="georgia">Georgia</option>
      <option value="helvetica">Helvetica</option>
      <option value="lucida">Lucida</option>
    </select>
    <select className="ql-size">
        <option value="4px">4px</option>
        <option value="6px">6px</option>
        <option value="8px">8px</option>
        <option value="10px">10px</option>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="22px">22px</option>
        <option value="26px">26px</option>
        <option value="32px">32px</option>
        <option value="40px">40px</option>
        <option value="48px">48px</option>
        <option value="56px">56px</option>
        <option value="64px">64px</option>
        <option value="72px">72px</option>
    </select>

    <button className="ql-clean" />
    <button className="ql-insertHeart">
      <CustomHeart />
    </button>
  </div>
);

const sizes = [
    '4px', '6px', '8px', '10px', '12px', 
    '14px', '16px', '18px', '22px', '26px', 
    '32px', '40px', '48px', '56px', '64px', '72px'
  ];
  

// Register font and size formats
const Size = Quill.import("attributors/style/size");
Size.whitelist = sizes;
Quill.register(Size, true);

const Font = Quill.import("attributors/style/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida"
];
Quill.register(Font, true);

class Editor extends React.Component {
  state = { editorHtml: "" };

  handleChange = (html) => {
    this.setState({ editorHtml: html });
  };

  static modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        insertHeart: insertHeart
      }
    }
  };

  static formats = [
    "header", "font", "size", "bold", "italic", "underline",
    "strike", "blockquote", "list", "bullet", "indent",
    "link", "image", "color"
  ];

  render() {
    return (
      <div className="text-editor">
        <CustomToolbar />
        <ReactQuill
          value={this.state.editorHtml}
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
          modules={Editor.modules}
          formats={Editor.formats}
        />
      </div>
    );
  }
}

export { Editor }; // Ensure the Editor is exported
