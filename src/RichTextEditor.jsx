import React, { useRef } from "react";
import "./index.css";

const RichTextEditor = () => {
  const editorRef = useRef(null);

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="pt-8 sm:pt-12 md:pt-16 lg:pt-20 bg-gray-100 min-h-screen">
      <div className="p-4 border rounded-lg shadow-lg bg-gray-50 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Rich Text Editor
        </h2>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-4">
          {[
            { command: "bold", label: "Bold" },
            { command: "italic", label: "Italic" },
            { command: "underline", label: "Underline" },
            { command: "strikeThrough", label: "Strike Through" },
            { command: "insertUnorderedList", label: "Bullet List" },
            { command: "insertOrderedList", label: "Numbered List" },
            { command: "justifyLeft", label: "Align Left" },
            { command: "justifyCenter", label: "Align Center" },
            { command: "justifyRight", label: "Align Right" },
          ].map(({ command, label }) => (
            <button
              key={command}
              onClick={() => formatText(command)}
              className="flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full h-12"
            >
              {label}
            </button>
          ))}
        </div>

        <div
          ref={editorRef}
          contentEditable={true}
          className="w-full min-h-[200px] p-4 border-2 border-gray-300 rounded-lg bg-white"
          placeholder="Start typing here..."
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
