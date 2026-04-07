// src/components/RichTextEditor.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface IRichTextInputProps {
  value: string;
  onChange: (content: string) => void;
  onSubmit?: () => void;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
}

interface IFilePickerMeta {
  title?: string;
  filetype?: string;
  [key: string]: unknown;
}

const RichTextInput: React.FC<IRichTextInputProps> = ({
  value = "",
  onChange,
  onSubmit,
  minLength = 10,
  maxLength = 5000,
  required = false,
  placeholder = "Write your content here...",
}) => {
  const [error, setError] = useState<string>("");
  const [editorValue, setEditorValue] = useState<string>(value);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  // Clean HTML content
  const cleanContent = (content: string) => {
    let stripped = content.replace(/(<([^>]+)>)/gi, "").trim();
    stripped = stripped.replace(/&nbsp;/g, "").trim();
    return stripped;
  };

  // Validate content length
  const validateContent = useCallback(
    (content: string) => {
      const strippedContent = cleanContent(content);
      if (required && strippedContent.length === 0) {
        setError("Content cannot be empty.");
        return false;
      }
      if (strippedContent.length < minLength) {
        setError(`Content must be at least ${minLength} characters long.`);
        return false;
      }
      if (strippedContent.length > maxLength) {
        setError(`Content cannot exceed ${maxLength} characters.`);
        return false;
      }
      setError("");
      return true;
    },
    [minLength, maxLength, required]
  );

  const handleChange = (content: string) => {
    setEditorValue(content);
    if (cleanContent(content).length > 0 || !required) {
      onChange(content);
    }
    if (error) validateContent(content);
  };

  const handleSubmit = useCallback(() => {
    if (validateContent(editorValue) && onSubmit) {
      onSubmit();
    }
  }, [validateContent, editorValue, onSubmit]);

  const filePickerCallback = useCallback(
    (
      cb: (value: string, meta?: IFilePickerMeta) => void
      // value: string,
      // meta: FilePickerMeta
    ) => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");

      input.onchange = function () {
        const inputEl = this as HTMLInputElement;
        const file = inputEl.files?.[0];

        if (!file) {
          return;
        }

        const reader = new FileReader();
        reader.onload = function () {
          cb(reader.result as string, { title: file.name });
        };
        reader.readAsDataURL(file);
      };

      input.click();
    },
    []
  );

  return (
    <div className="w-full">
      <div
        className={`outline-none bg-transparent border ${
          error ? "border-destructive" : "border-input"
        } shadow-lg w-full transition-all`}
      >
        <Editor
          apiKey="7i60o5bvpwnqon07sudolfddvjfb8h5gtktplb99bq0arohl"
          value={editorValue}
          onEditorChange={handleChange}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
              "imagetools",
            ],
            toolbar:
              "undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | image media link | removeformat | help",
            placeholder,
            // Image settings with advanced options for positioning
            image_advtab: true,
            image_caption: true,
            image_title: true,
            file_picker_types: "image",
            /* This is where the magic happens for image positioning */
            image_class_list: [
              { title: "None", value: "" },
              { title: "Float Left", value: "float-left mr-4" },
              { title: "Float Right", value: "float-right ml-4" },
              { title: "Centered", value: "mx-auto block" },
              { title: "Full Width", value: "w-full" },
            ],
            // Add custom styling for the editor using CSS variables
            content_style: `
              body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                font-size: 16px; 
                color: hsl(var(--foreground));
                background-color: hsl(var(--background));
              }
              .float-left { float: left; margin-right: 1rem; margin-bottom: 0.5rem; }
              .float-right { float: right; margin-left: 1rem; margin-bottom: 0.5rem; }
              .mx-auto { margin-left: auto; margin-right: auto; }
              .block { display: block; }
              .w-full { width: 100%; }
            `,
            // This callback is for handling file uploads
            file_picker_callback: filePickerCallback,
          }}
        />
      </div>
      {error && (
        <p
          id="rich-text-error"
          className="text-destructive text-sm mt-2 transition-opacity duration-300"
        >
          {error}
        </p>
      )}
      {onSubmit && (
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          disabled={!!error}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default RichTextInput;
