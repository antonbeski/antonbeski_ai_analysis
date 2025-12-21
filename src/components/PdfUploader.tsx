"use client";

import { useState } from "react";
import pdfParse from "pdf-parser-client-side";

export default function PdfUploader() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = await pdfParse(arrayBuffer);
      setText(data.text);
      setError("");
    } catch (err) {
      console.error("Error parsing PDF:", err);
      if (err instanceof Error) {
        setError(`Error parsing PDF: ${err.message}`);
      } else {
        setError("An unknown error occurred while parsing the PDF.");
      }
      setText("");
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <textarea
        value={text}
        readOnly
        rows={20}
        cols={80}
        placeholder="Extracted PDF text will appear here..."
      />
    </div>
  );
}
