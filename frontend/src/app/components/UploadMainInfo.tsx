"use client";

import { useState } from "react";

export default function UploadMainInfo() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="flex flex-col items-center justify-center w-1/3">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-background border-dashed rounded-lg cursor-pointer bg-foreground opacity-85 hover:opacity-100"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-background"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-background">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-background">MP4, WEBM</p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const formData = new FormData();
              formData.append("file", file);

              setLoading(true);
              setSummary("");
              setError("");

              console.log("Preparing to send video");

              fetch("http://localhost:8000/analyze", {
                method: "POST",
                body: formData,
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log("Insights:", data);
                  if (data && data.summary) {
                    setSummary(data.summary);
                  } else {
                    setError("Unexpected response format.");
                  }
                })
                .catch((err) => {
                  console.error("Error:", err);
                  setError("Something went wrong while processing the video.");
                })
                .finally(() => {
                  setLoading(false);
                });
            }
          }}
        />
      </label>

      {/* Loading indicator */}
      {loading && (
        <p className="mt-4 text-lg text-foreground animate-pulse">
          Analyzing your video...
        </p>
      )}

      {/* Display summary */}
      {summary && (
        <div className="mt-4 p-4 bg-background border rounded shadow text-sm text-foreground w-full">
          <h3 className="font-bold mb-2">Summary:</h3>
          <p>{summary}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
