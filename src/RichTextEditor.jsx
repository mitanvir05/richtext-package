import React, { useRef, useState, useEffect } from "react";
import "./index.css";

const DEFAULT_CONTENT = `
  <h1>Welcome to the Rich Text Editor</h1>
  <p>This is some <strong>default text</strong> to get you started.</p>
  <p>You can use the buttons above to <em>format</em> this content.</p>
`;

const RichTextEditor = () => {
  const editorRef = useRef(null);
  const [activeCommands, setActiveCommands] = useState([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    updateActiveCommands();
    updateUndoRedoState();
    editorRef.current.focus();
  };

  const addLink = () => {
    let url = prompt("Enter the URL:");

    if (url) {
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }

      document.execCommand("createLink", false, url);

      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let link = range.startContainer.parentElement;

        if (link.tagName !== "A" && link.closest("a")) {
          link = link.closest("a");
        }

        if (link) {
          link.setAttribute("data-url", url);
        }
      }
    }
  };

  const removeLink = () => {
    formatText("unlink");
  };

  const undo = () => {
    formatText("undo");
  };

  const redo = () => {
    formatText("redo");
  };

  const clearFormat = () => {
    editorRef.current.innerHTML = DEFAULT_CONTENT; // Reset to default content
    updateActiveCommands();
    updateUndoRedoState();
  };

  const updateUndoRedoState = () => {
    setCanUndo(document.queryCommandEnabled("undo"));
    setCanRedo(document.queryCommandEnabled("redo"));
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
      "createLink",
    ];

    const active = commands.filter((cmd) => document.queryCommandState(cmd));

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const parentElement = range.startContainer.parentElement;
      if (parentElement.closest("blockquote")) {
        active.push("blockquote");
      }
    }

    const headingTag = document.queryCommandValue("formatBlock");
    if (headingTag) active.push(headingTag.toLowerCase());

    setActiveCommands(active);
  };

  useEffect(() => {
    editorRef.current.innerHTML = DEFAULT_CONTENT;
    updateUndoRedoState();
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
            { command: "formatBlock", value: "blockquote", label: "Block Quote" },
          ].map(({ command, label, value }) => (
            <button
              key={command + (value || "")}
              onClick={() => formatText(command, value)}
              className={`flex justify-center items-center px-4 py-2 rounded-lg w-full h-12 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                activeCommands.includes(command) || activeCommands.includes(value)
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
              }`}
            >
              {label}
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

          <button
            onClick={undo}
            disabled={!canUndo}
            className={`flex justify-center items-center px-4 py-2 rounded-lg w-full h-12 ${
              canUndo
                ? "bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 focus:ring-2 focus:ring-yellow-400"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Undo
          </button>

          <button
            onClick={redo}
            disabled={!canRedo}
            className={`flex justify-center items-center px-4 py-2 rounded-lg w-full h-12 ${
              canRedo
                ? "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 focus:ring-2 focus:ring-green-400"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Redo
          </button>

          <button
            onClick={clearFormat}
            className="flex justify-center items-center px-4 py-2 rounded-lg w-full h-12 bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Clear Format
          </button>
        </div>

        <div
          ref={editorRef}
          contentEditable={true}
          className="w-full min-h-[200px] p-4 border-2 border-gray-300 rounded-lg bg-white rich-text-editor"
          placeholder="Start typing here..."
          onClick={updateActiveCommands}
          onKeyUp={updateActiveCommands}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
