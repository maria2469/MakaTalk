import React, { useRef, useState } from 'react';
import { FaVideo } from 'react-icons/fa'; // Import a webcam icon from react-icons

const Webcam = () => {
  const videoRef = useRef(null); // Reference for the video element
  const [isVideoEnabled, setIsVideoEnabled] = useState(false); // State to manage video feed

  const handleWebcamToggle = async () => {
    if (!isVideoEnabled) {
      try {
        // Request access to the user's webcam
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream; // Set the video stream to the video element
        videoRef.current.play();
        setIsVideoEnabled(true); // Update state to indicate that the video is enabled
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    } else {
      // Stop the video stream
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop()); // Stop each track
      videoRef.current.srcObject = null; // Clear the video source
      setIsVideoEnabled(false); // Update state to indicate that the video is disabled
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={handleWebcamToggle} 
        className="mb-4 p-2 bg-gray-100 text-black rounded hover:bg-gray-200" // Updated classes
      >
        <FaVideo className="inline-block text-black" /> {/* Set icon color to black */}
      </button>
      <video ref={videoRef} className="border rounded" width="320" height="240" autoPlay muted />
    </div>
  );
};

export default Webcam;

