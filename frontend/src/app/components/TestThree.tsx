"use client";

import { useState, useEffect, useCallback } from "react";

// Define types for better type safety
interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'punching-bag' | 'barbell';
}

// Rocky Runner Game Component
function RockyRunnerGame() {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'gameOver'>('waiting');
  const [rockyY, setRockyY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(4);

  const groundY = 0;
  const jumpHeight = 100;
  const rockyX = 100;

  // Jump mechanics
  const jump = useCallback(() => {
    if (!isJumping && gameState === 'playing') {
      setIsJumping(true);
      let jumpVelocity = 20;
      
      const jumpInterval = setInterval(() => {
        setRockyY(prev => {
          const newY = prev + jumpVelocity;
          jumpVelocity -= 0.8; // gravity
          
          if (newY <= groundY) {
            setIsJumping(false);
            clearInterval(jumpInterval);
            return groundY;
          }
          return newY;
        });
      }, 16);
    }
  }, [isJumping, gameState]);

  // Game controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'waiting' || gameState === 'gameOver') {
          startGame();
        } else {
          jump();
        }
      }
    };

    const handleClick = () => {
      if (gameState === 'waiting' || gameState === 'gameOver') {
        startGame();
      } else {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [gameState, jump]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setObstacles([]);
    setRockyY(0);
    setGameSpeed(7);
  };

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Move obstacles
      setObstacles(prev => {
        const newObstacles = prev
          .map(obstacle => ({ ...obstacle, x: obstacle.x - gameSpeed }))
          .filter(obstacle => obstacle.x > -50);
        
        // Add new obstacles
        if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < 500) {
          if (Math.random() < 0.01) {
            newObstacles.push({
              x: 800,
              y: 0,
              width: 20,
              height: Math.random() < 0.5 ? 40 : 60,
              type: Math.random() < 0.5 ? 'punching-bag' : 'barbell'
            });
          }
        }
        
        return newObstacles;
      });

      // Increase score and speed
      setScore(prev => prev + 1);
      setGameSpeed(prev => prev + 0.001);
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, gameSpeed]);

  // Collision detection
  useEffect(() => {
    if (gameState !== 'playing') return;

    obstacles.forEach(obstacle => {
      const rockyRight = rockyX + 30;
      const rockyTop = 40 + rockyY + 30; // Rocky's full height
      const rockyBottom = 40 + rockyY;
      const obstacleRight = obstacle.x + obstacle.width;
      const obstacleTop = 40 + obstacle.height; // Obstacle sits on ground at y=40
      const obstacleBottom = 40;

      // Check if Rocky overlaps with obstacle
      if (
        rockyX < obstacleRight &&
        rockyRight > obstacle.x &&
        rockyBottom < obstacleTop &&
        rockyTop > obstacleBottom
      ) {
        setGameState('gameOver');
      }
    });
  }, [obstacles, rockyY, gameState]);

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col items-center justify-center select-none">
      {/* Game Title */}
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Analyzing Your Video...</h2>
        <p className="text-gray-600">Play Rocky Runner while you wait!</p>
      </div>

      {/* Game Canvas */}
      <div className="relative w-full max-w-4xl h-60 bg-white border-2 border-gray-300 overflow-hidden">
        {/* Ground Line */}
        <div className="absolute bottom-10 left-0 w-full h-0.5 bg-gray-400"></div>
        
        {/* Moving Ground Pattern */}
        <div 
          className="absolute bottom-0 left-0 w-full h-10 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 20px, #ccc 20px, #ccc 21px)`,
            transform: `translateX(-${(score * gameSpeed) % 40}px)`
          }}
        />

        {/* Rocky Character */}
        <div 
          className="absolute transition-none"
          style={{ 
            left: `${rockyX}px`, 
            bottom: `${40 + rockyY}px`,
            transform: gameState === 'playing' ? 'none' : 'none'
          }}
        >
          {/* Head */}
          <div className="w-8 h-8 bg-gray-800 mb-0.5" style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 40%, 75% 100%, 25% 100%, 0% 40%)'}}>
            <div className="absolute top-2 left-2 w-0.5 h-0.5 bg-white"></div>
            <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-white"></div>
          </div>
          
          {/* Body */}
          <div className="w-6 h-8 bg-red-600 mx-auto mb-0.5"></div>
          
          {/* Arms */}
          <div className={`absolute top-8 -left-2 w-4 h-1.5 bg-gray-800 ${gameState === 'playing' ? 'animate-pulse' : ''}`}>
            <div className="absolute -left-1 -top-0.5 w-2 h-2.5 bg-red-800"></div>
          </div>
          <div className={`absolute top-8 -right-2 w-4 h-1.5 bg-gray-800 ${gameState === 'playing' ? 'animate-pulse' : ''}`}>
            <div className="absolute -right-1 -top-0.5 w-2 h-2.5 bg-red-800"></div>
          </div>
          
          {/* Legs */}
          <div className="flex justify-center gap-0.5">
            <div className={`w-1.5 h-6 bg-gray-800 ${gameState === 'playing' ? 'animate-bounce' : ''}`} style={{animationDuration: '0.3s'}}></div>
            <div className={`w-1.5 h-6 bg-gray-800 ${gameState === 'playing' ? 'animate-bounce' : ''}`} style={{animationDuration: '0.3s', animationDelay: '0.15s'}}></div>
          </div>
          
          {/* Feet */}
          <div className="flex justify-center gap-0.5 -mt-0.5">
            <div className="w-3 h-1.5 bg-black"></div>
            <div className="w-3 h-1.5 bg-black"></div>
          </div>
        </div>

        {/* Obstacles */}
        {obstacles.map((obstacle, index) => (
          <div key={index} className="absolute" style={{ left: `${obstacle.x}px`, bottom: '40px' }}>
            {obstacle.type === 'punching-bag' ? (
              <div className={`bg-red-900 rounded-full`} style={{ width: `${obstacle.width}px`, height: `${obstacle.height}px` }}></div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-gray-700 rounded-full mb-1"></div>
                <div className="w-6 h-2 bg-gray-800"></div>
                <div className="w-4 h-4 bg-gray-700 rounded-full mt-1"></div>
              </div>
            )}
          </div>
        ))}

        {/* Game Over / Start Screen */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">ROCKY RUNNER</h1>
              {gameState === 'gameOver' && (
                <div className="mb-4">
                  <p className="text-xl text-red-600 font-bold">GAME OVER</p>
                  <p className="text-lg text-gray-600">Score: {Math.floor(score / 10)}</p>
                </div>
              )}
              <p className="text-gray-600 mb-4">
                {gameState === 'waiting' ? 'Press SPACE or CLICK to start' : 'Press SPACE or CLICK to restart'}
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-1 h-1 bg-gray-800 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-1 h-1 bg-gray-800 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-1 bg-gray-800 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Score Display */}
      {gameState === 'playing' && (
        <div className="mt-4 text-2xl font-mono text-gray-800">
          Score: {Math.floor(score / 10)}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600 text-center max-w-md">
        Jump over punching bags and barbells! Use SPACE key or click to jump.
      </div>
    </div>
  );
}

export default function TestThree() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({});

  // Simple formatting function for content within sections
  const formatText = (text: string) => {
    if (!text) return "";
    
    return text
      // Convert **bold** to HTML (global flag to catch all occurrences)
      .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
      // Convert timestamps to clickable blue links
      .replace(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/g, '<span class="timestamp-link" data-start="$1" data-end="$2" style="color: #3b82f6; cursor: pointer; text-decoration: underline;">$1 - $2</span>')
      .replace(/\[(\d{2}:\d{2})\]\s*-\s*\[(\d{2}:\d{2})\]/g, '<span class="timestamp-link" data-start="$1" data-end="$2" style="color: #3b82f6; cursor: pointer; text-decoration: underline;">[$1] - [$2]</span>')
      // Handle remaining single * for bullet points
      .replace(/^(\s*)\* (.+)/gm, '$1• $2')
      // Convert line breaks to <br>
      .replace(/\n/g, '<br>');
  };

  // Convert timestamp string to seconds
  const timeToSeconds = (timeStr: string) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Handle timestamp clicks
  const handleTimestampClick = (startTime: string) => {
    const videoElement = document.getElementById('uploaded-video') as HTMLVideoElement;
    if (videoElement && startTime) {
      const seconds = timeToSeconds(startTime);
      videoElement.currentTime = seconds;
      videoElement.play();
    }
  };

  // Parse summary into sections
  const parseSections = (text: string) => {
    if (!text) return [];
    
    console.log("Original text:", text);
    
    // Split by ## headers - try a simpler approach
    const lines = text.split('\n');
    const sections = [];
    let currentSection: { title: string; content: string } | null = null;
    
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

  // Download PDF function
  const downloadPDF = async () => {
    try {
      // Create a clean text version of the summary for PDF
      const cleanText = (text: string) => {
        return text
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
          .replace(/&amp;/g, '&') // Replace HTML entities
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
      };

      const sections = parseSections(summary);
      
      let pdfContent = 'Video Analysis Summary\n\n';
      
      if (sections.length > 0) {
        sections.forEach((section) => {
          pdfContent += `${section.title}\n`;
          pdfContent += '='.repeat(section.title.length) + '\n\n';
          pdfContent += cleanText(section.content) + '\n\n';
        });
      } else {
        pdfContent += cleanText(summary);
      }

      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-analysis-summary-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading summary:', error);
      setError('Failed to download summary. Please try again.');
    }
  };

  // Refresh page function
  const refreshPage = () => {
    // Reset all state
    setSummary("");
    setLoading(false);
    setError("");
    setUploaded(false);
    setUploadedFile(null);
    setOpenSections({});
    
    // Reset file input
    const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const sections = parseSections(summary);

  return (
    <>
      {/* Show Rocky Runner Game during loading */}
      {loading && <RockyRunnerGame />}

      <main className={`pt-20 flex ${uploaded ? 'flex-row gap-8 px-8' : 'flex-col items-center'}`}>
        {/* Left side - Summary or Upload */}
        <div className={`flex flex-col ${uploaded ? 'w-1/2' : 'w-[45%] items-center justify-center'}`}>
          {!uploaded && (
            <>
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
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-background">MP4, min: 360x360</p>
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
                      setUploadedFile(file);

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
                  }}
                />
              </label>
              <div className="bg-background opacity-75 mt-24 p-2 rounded-2xl">
                <p className="text-xl text-foreground text-bold">Instructions:</p>
                <p className="text-xl text-foreground text-bold mt-4">- Upload a video of yourself playing sports</p>
                <p className="text-xl text-foreground text-bold mt-4">- Ensure that the video is in mp4 format and at least 360x360</p>
                <p className="text-xl text-foreground text-bold mt-4">- Processing the video may take some time</p>
              </div>
            </>
          )}

          {/* Display summary with dropdown sections */}
          {summary && (
            <div className="mt-4 p-4 bg-background border-4 rounded shadow text-sm text-foreground w-full opacity-85">
              <h3 className="font-bold mb-4 text-xl text-center">Video Analysis:</h3>

              {sections.length > 0 ? (
                <div className="space-y-3">
                  {sections.map((section, index) => (
                    <div key={index} className="border-2 border-foreground rounded-lg shadow-2xl">
                      <button
                        onClick={() => toggleSection(section.title)}
                        className="w-full px-4 py-3 text-left text-lg font-semibold bg-background hover:bg-[#d4d2cb] rounded-lg flex justify-between items-center transition-colors"
                      >
                        <span>{section.title}</span>
                        <svg
                          className={`w-5 h-5 transform transition-transform ${openSections[section.title] ? 'rotate-180' : ''
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {openSections[section.title] && (
                        <div className="px-4 py-3 border-t border-background">
                          <div
                            className="whitespace-pre-wrap leading-relaxed text-base"
                            dangerouslySetInnerHTML={{
                              __html: formatText(section.content)
                            }}
                            style={{
                              lineHeight: '1.6',
                              fontFamily: 'inherit'
                            }}
                            onClick={(e) => {
                              const target = e.target as HTMLElement;
                              if (target.classList.contains('timestamp-link')) {
                                const startTime = target.getAttribute('data-start');
                                if (startTime) {
                                  handleTimestampClick(startTime);
                                }
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
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
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.classList.contains('timestamp-link')) {
                        const startTime = target.getAttribute('data-start');
                        if (startTime) {
                          handleTimestampClick(startTime);
                        }
                      }
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
        </div>

        {/* Right side - Video player (only show when uploaded) */}
        {uploaded && uploadedFile && (
          <div className="w-1/2 flex flex-col">
            <h3 className="font-bold mt-4 text-lg text-foreground">Your Video:</h3>
            <div className="bg-foreground rounded-lg overflow-hidden shadow-lg">
              <video
                id="uploaded-video"
                controls
                className="w-full h-auto max-h-96"
                src={URL.createObjectURL(uploadedFile)}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="mt-2 text-sm text-foreground">
              Click on timestamps in the analysis to jump to specific moments in the video.
            </p>

            {/* Action buttons below video */}
            <div className="mt-4 flex gap-4">
              <button
                onClick={downloadPDF}
                className="flex-1 bg-foreground hover:bg-[#2a2a2a] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Summary
              </button>

              <button
                onClick={refreshPage}
                className="flex-1 bg-foreground hover:bg-[#2a2a2a] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start Over
              </button>
            </div>
          </div>
        )}

        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
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