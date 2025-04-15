import React, { useRef, useState, useEffect } from 'react';
import { FaVideo, FaVideoSlash } from 'react-icons/fa'; // Import video and stop icons

const WebcamStream = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false); // Toggle between streaming states
  const socket = useRef(null);

  useEffect(() => {
    // Setup WebSocket connection
    socket.current = new WebSocket("ws://localhost:5000"); // Assuming backend is running on localhost:5000
    socket.current.onopen = () => console.log("Connected to server");
    socket.current.onclose = () => console.log("Disconnected from server");

    return () => {
      if (socket.current) socket.current.close();
    };
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsStreaming(true); // Webcam is now streaming
      captureFrames();
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopWebcam = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream?.getTracks();
    if (tracks) {
      tracks.forEach(track => track.stop()); // Stop each track of the stream
      videoRef.current.srcObject = null; // Clear the video source
      setIsStreaming(false); // Webcam is no longer streaming
    }
  };

  const captureFrames = () => {
    if (!isStreaming || !videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    // Set canvas dimensions to match the video element
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    // Draw the current frame onto the canvas
    context.drawImage(videoRef.current, 0, 0, width, height);

    // Send the frame as an image data URL to the backend via WebSocket
    const frameData = canvasRef.current.toDataURL('image/jpeg'); // Convert the frame to a JPEG image
    socket.current.send(frameData); // Send the image data to the backend

    // Capture the next frame in the next animation frame
    requestAnimationFrame(captureFrames);
  };

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={isStreaming ? stopWebcam : startWebcam} // Toggle between starting and stopping webcam
        className="mb-4 p-2 bg-gray-100 text-black rounded hover:bg-gray-200"
      >
        {isStreaming ? (
          <FaVideoSlash className="inline-block text-black" /> // Show stop icon when streaming
        ) : (
          <FaVideo className="inline-block text-black" /> // Show start icon when not streaming
        )}
        {isStreaming ? ' Stop Webcam' : ' Start Webcam'} {/* Toggle button label */}
      </button>
      <video ref={videoRef} width="320" height="240" className="border rounded" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WebcamStream;

