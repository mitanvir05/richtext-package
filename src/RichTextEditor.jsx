import React, { useRef, useState, useEffect } from "react";
import "./index.css"; // Ensure styles for lists are applied here

const RichTextEditor = () => {
  const editorRef = useRef(null);
  const [activeCommands, setActiveCommands] = useState([]);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    updateActiveCommands(); // Update active commands after formatting
    editorRef.current.focus(); // Keep the editor focused
  };

  const addLink = () => {
    let url = prompt("Enter the URL:");
  
    if (url) {
      // If the URL doesn't start with http:// or https://, prepend https://
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
  
      document.execCommand("createLink", false, url);
  
      // Add data-url attribute to the newly created link
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let link = range.startContainer.parentElement;
  
        // Ensure the correct <a> element is selected even if nested
        if (link.tagName !== "A" && link.closest("a")) {
          link = link.closest("a");
        }
  
        if (link) {
          link.setAttribute("data-url", url); // Store URL in data-url
        }
      }
    }
  };
  
  

  const removeLink = () => {
    formatText("unlink");
  };

  const updateActiveCommands = () => {
    const commands = [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "justifyLeft",
      "justifyCenter",
      "justifyRight",
      "indent",
      "outdent",
      "insertOrderedList",
      "insertUnorderedList",
      "superscript",
      "subscript",
      "createLink", // Added link detection
    ];

    const active = commands.filter((cmd) => document.queryCommandState(cmd));
    const headingTag = document.queryCommandValue("formatBlock"); // Check current heading
    if (headingTag) active.push(headingTag.toLowerCase()); // Add the heading to active commands

    setActiveCommands(active);
  };

  useEffect(() => {
    // Set default content when the component mounts
    editorRef.current.innerHTML = `
      <h1>Welcome to the Rich Text Editor</h1>
      <p>This is some <strong>default text</strong> to get you started.</p>
      <p>You can use the buttons above to <em>format</em> this content.</p>
    `;
  }, []);

  return (
    <div className="pt-8 sm:pt-12 md:pt-16 lg:pt-20 bg-gray-100 min-h-screen">
      <div className="p-4 border rounded-lg shadow-lg bg-gray-50 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Rich Text Editor</h2>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-4">
          {[
            { command: "bold", label: "Bold" },
            { command: "italic", label: "Italic" },
            { command: "underline", label: "Underline" },
            { command: "strikeThrough", label: "Strike Through" },
            { command: "justifyLeft", label: "Align Left" },
            { command: "justifyCenter", label: "Align Center" },
            { command: "justifyRight", label: "Align Right" },
            { command: "indent", label: "Indent" },
            { command: "outdent", label: "Outdent" },
            { command: "insertOrderedList", label: "Ordered List" },
            { command: "insertUnorderedList", label: "Unordered List" },
            { command: "superscript", label: "Superscript" },
            { command: "subscript", label: "Subscript" },
          ].map(({ command, label }) => (
            <button
              key={command}
              onClick={() => formatText(command)}
              className={`flex justify-center items-center px-4 py-2 rounded-lg w-full h-12 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                activeCommands.includes(command)
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
              }`}
            >
              {label}
            </button>
          ))}

          {Array.from({ length: 6 }, (_, i) => i + 1).map((h) => (
            <button
              key={`h${h}`}
              onClick={() => formatText("formatBlock", `<h${h}>`)}
              className={`flex justify-center items-center px-4 py-2 rounded-lg w-full h-12 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                activeCommands.includes(`h${h}`)
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
              }`}
            >
              {`H${h}`}
            </button>
          ))}

          <button
            onClick={addLink}
            className="flex justify-center items-center px-4 py-2 rounded-lg w-full h-12 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Add Link
          </button>

          <button
            onClick={removeLink}
            className="flex justify-center items-center px-4 py-2 rounded-lg w-full h-12 bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Remove Link
          </button>
        </div>

        <div
          ref={editorRef}
          contentEditable={true}
          className="w-full min-h-[200px] p-4 border-2 border-gray-300 rounded-lg bg-white rich-text-editor"
          placeholder="Start typing here..."
          onClick={updateActiveCommands} // Update active commands on click
          onKeyUp={updateActiveCommands} // Update active commands on keyup
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
