"use client";

import { useState } from "react";

export default function Test() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({});

  // Simple formatting function for content within sections
  const formatText = (text: string) => {
    if (!text) return "";
    
    return text
      // Convert **bold** to HTML (global flag to catch all occurrences)
      .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
      // Convert timestamps to blue
      .replace(/(\d{2}:\d{2}\s*-\s*\d{2}:\d{2})/g, '<span style="color: #3b82f6;">$1</span>')
      .replace(/(\[\d{2}:\d{2}\]\s*-\s*\[\d{2}:\d{2}\])/g, '<span style="color: #3b82f6;">$1</span>')
      // Handle remaining single * for bullet points
      .replace(/^(\s*)\* (.+)/gm, '$1• $2')
      // Convert line breaks to <br>
      .replace(/\n/g, '<br>');
  };

  // Parse summary into sections
  const parseSections = (text: string) => {
    if (!text) return [];
    
    console.log("Original text:", text);
    
    // Split by ## headers - try a simpler approach
    const lines = text.split('\n');
    const sections = [];
    let currentSection = null;
    
    for (const line of lines) {
      if (line.trim().startsWith('## ')) {
        // Save previous section if it exists
        if (currentSection) {
          sections.push({
            title: currentSection.title,
            content: currentSection.content.trim()
          });
        }
        
        // Start new section
        currentSection = {
          title: line.replace('## ', '').trim(),
          content: ''
        };
      } else if (currentSection) {
        // Add line to current section content
        currentSection.content += line + '\n';
      }
    }
    
    // Don't forget the last section
    if (currentSection) {
      sections.push({
        title: currentSection.title,
        content: currentSection.content.trim()
      });
    }
    
    console.log("Parsed sections:", sections);
    return sections;
  };

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev => {
      const isCurrentlyOpen = prev[sectionTitle];
      
      // If clicking on an open section, close it
      if (isCurrentlyOpen) {
        return {
          ...prev,
          [sectionTitle]: false
        };
      }
      
      // Otherwise, close all sections and open only this one
      const newState: {[key: string]: boolean} = {};
      Object.keys(prev).forEach(key => {
        newState[key] = false;
      });
      newState[sectionTitle] = true;
      
      return newState;
    });
  };

  const sections = parseSections(summary);

  return (
    <>
    <main className={`pt-20 flex flex-col ${uploaded ? 'items-left ml-8' : 'items-center'}`}>
        <div className="flex flex-col items-center justify-center w-[45%]">
      {!uploaded && (<label
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
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
          </svg>
          <p className="mb-2 text-sm text-background">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-background">MP4</p>
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
                  setUploaded(true);
                });
            }
          } } />
      </label>)}

      {/* Loading indicator */}
      {loading && (
        <p className="mt-4 text-lg text-foreground animate-pulse">
          Analyzing your video...
        </p>
      )}

      {/* Display summary with dropdown sections */}
      {summary && (
        <div className="mt-4 p-4 bg-background border rounded shadow text-sm text-foreground w-full">
          <h3 className="font-bold mb-4 text-xl text-center">Video Analysis:</h3>
          
          {/* Debug info - remove this once working */}
          {/* <div className="mb-4 p-2 bg-yellow-100 text-xs">
            <p>Summary length: {summary.length}</p>
            <p>Sections found: {sections.length}</p>
            <p>Contains ##: {summary.includes('##') ? 'Yes' : 'No'}</p>
          </div> */}
          
          {sections.length > 0 ? (
            <div className="space-y-3">
              {sections.map((section, index) => (
                <div key={index} className="border border-foreground rounded-lg">
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full px-4 py-3 text-left text-lg font-semibold bg-background hover:bg-[#d4d2cb] rounded-lg flex justify-between items-center transition-colors"
                  >
                    <span>{section.title}</span>
                    <svg 
                      className={`w-5 h-5 transform transition-transform ${openSections[section.title] ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {openSections[section.title] && (
                    <div className="px-4 py-3 border-t border-gray-200">
                      <div
                        className="whitespace-pre-wrap leading-relaxed text-lg"
                        dangerouslySetInnerHTML={{
                          __html: formatText(section.content)
                        }}
                        style={{
                          lineHeight: '1.6',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Fallback for summaries without ## headers
            <div>
              <p className="mb-2 text-red-500">No sections found, showing raw summary:</p>
              <div
                className="whitespace-pre-wrap leading-relaxed text-lg"
                dangerouslySetInnerHTML={{
                  __html: formatText(summary)
                }}
                style={{
                  lineHeight: '1.6',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

    </div><div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="rocky_backgroundvid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </main>
    </>
  );
}