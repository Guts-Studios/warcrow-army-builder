
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter text...",
  className,
  disabled = false
}) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link'
  ];

  return (
    <div className={cn("rich-text-editor", className)}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        style={{
          backgroundColor: 'black',
          border: '1px solid rgb(212, 175, 55, 0.3)',
          borderRadius: '6px',
        }}
      />
      <style>
        {`
          .ql-toolbar {
            border-top: 1px solid rgb(212, 175, 55, 0.3) !important;
            border-left: 1px solid rgb(212, 175, 55, 0.3) !important;
            border-right: 1px solid rgb(212, 175, 55, 0.3) !important;
            border-bottom: none !important;
            background-color: rgb(17, 24, 39) !important;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
          }
          
          .ql-container {
            border-bottom: 1px solid rgb(212, 175, 55, 0.3) !important;
            border-left: 1px solid rgb(212, 175, 55, 0.3) !important;
            border-right: 1px solid rgb(212, 175, 55, 0.3) !important;
            border-top: none !important;
            background-color: black !important;
            color: rgb(248, 250, 252) !important;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
          }
          
          .ql-editor {
            color: rgb(248, 250, 252) !important;
            min-height: 150px;
          }
          
          .ql-editor::before {
            color: rgb(248, 250, 252, 0.5) !important;
          }
          
          .ql-toolbar .ql-stroke {
            stroke: rgb(212, 175, 55) !important;
          }
          
          .ql-toolbar .ql-fill {
            fill: rgb(212, 175, 55) !important;
          }
          
          .ql-toolbar button:hover {
            background-color: rgb(212, 175, 55, 0.1) !important;
          }
          
          .ql-toolbar button.ql-active {
            background-color: rgb(212, 175, 55, 0.2) !important;
          }
          
          .ql-toolbar .ql-picker-label {
            color: rgb(212, 175, 55) !important;
          }
          
          .ql-toolbar .ql-picker-options {
            background-color: rgb(17, 24, 39) !important;
            border: 1px solid rgb(212, 175, 55, 0.3) !important;
          }
          
          .ql-toolbar .ql-picker-item {
            color: rgb(248, 250, 252) !important;
          }
          
          .ql-toolbar .ql-picker-item:hover {
            background-color: rgb(212, 175, 55, 0.1) !important;
          }

          /* Color picker specific styling */
          .ql-color .ql-picker-options {
            padding: 3px 5px !important;
            width: 152px !important;
          }
          
          .ql-background .ql-picker-options {
            padding: 3px 5px !important;
            width: 152px !important;
          }
          
          .ql-color .ql-picker-item,
          .ql-background .ql-picker-item {
            border: 1px solid transparent !important;
            float: left !important;
            height: 16px !important;
            margin: 2px !important;
            padding: 0 !important;
            width: 16px !important;
          }
        `}
      </style>
    </div>
  );
};
