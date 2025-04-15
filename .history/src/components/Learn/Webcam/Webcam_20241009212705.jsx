import React, { useRef, useState, useEffect } from 'react';

const WebcamStream = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
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
      setIsStreaming(true);
      captureFrames();
    } catch (error) {
      console.error("Error accessing webcam:", error);
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
    <div>
      <button onClick={startWebcam}>Start Webcam</button>
      <video ref={videoRef} width="320" height="240" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WebcamStream;


