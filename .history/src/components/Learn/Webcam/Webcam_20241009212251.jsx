import React, { useRef, useState, useEffect } from 'react';
import { FaVideo } from 'react-icons/fa';

const Webcam = () => {
  const videoRef = useRef(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [intervalId, setIntervalId] = useState(null); // To store interval ID

  const handleWebcamToggle = async () => {
    if (!isVideoEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsVideoEnabled(true);
        startSendingFrames(); // Start capturing and sending frames
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    } else {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsVideoEnabled(false);
      stopSendingFrames(); // Stop sending frames
    }
  };

  const startSendingFrames = () => {
    const id = setInterval(captureAndSendFrame, 500); // Capture a frame every 500ms
    setIntervalId(id);
  };

  const stopSendingFrames = () => {
    clearInterval(intervalId); // Stop the interval
    setIntervalId(null);
  };

  const captureAndSendFrame = () => {
    if (!videoRef.current) return;

    // Create a canvas to capture the video frame
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 (or you can convert to blob)
    const frameData = canvas.toDataURL('image/jpeg');

    // Send the frame to the backend
    fetch('http://your-backend-endpoint.com/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ frame: frameData }),
    }).catch(err => console.error("Failed to send frame:", err));
  };

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={handleWebcamToggle} 
        className="mb-4 p-2 bg-gray-100 text-black rounded hover:bg-gray-200"
      >
        <FaVideo className="inline-block text-black" />
      </button>
      <video ref={videoRef} className="border rounded" width="320" height="240" autoPlay muted />
    </div>
  );
};

export default Webcam;

