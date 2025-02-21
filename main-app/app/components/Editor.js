'use client';
import { Editor as MonacoEditor } from '@monaco-editor/react';

export default function Editor({ 
  language, 
  value, 
  onChange,
  height = "60vh"
}) {
  const handleEditorChange = (value) => {
    onChange({
      target: {
        name: 'code',
        value: value
      }
    });
  };

  return (
    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
      <MonacoEditor
        height={height}
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          lineNumbers: 'on',
          roundedSelection: true,
          selectOnLineNumbers: true,
          wordWrap: 'on',
          folding: true,
          glyphMargin: false,
          renderLineHighlight: 'all',
          contextmenu: true,
          cursorStyle: 'line',
          renderWhitespace: 'selection',
          rulers: [],
          colorDecorators: true,
          cursorBlinking: 'blink',
          renderControlCharacters: false,
          fontLigatures: true,
          fontFamily: 'monospace',
          smoothScrolling: true,
          bracketPairColorization: {
            enabled: true
          }
        }}
      />
    </div>
  );
}
