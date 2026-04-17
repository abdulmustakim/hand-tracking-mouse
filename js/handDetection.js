// Import necessary libraries
import { HandPose, drawConnectors, drawLandmarks } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { createCanvas, getContext, clearRect } from 'canvas';

// Initialize MediaPipe Hands
const hands = new HandPose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  };
});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

// Get webcam feed
const videoElement = document.querySelector('video');
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});
camera.start();

// Create a canvas for drawing
const canvas = createCanvas(1280, 720);
const ctx = canvas.getContext('2d');

// Draw function
async function drawResults(handsResults) {
  clearRect(0, 0, canvas.width, canvas.height);
  // Draw hand landmarks
  if (handsResults.multiHandLandmarks) {
    for (const landmarks of handsResults.multiHandLandmarks) {
      drawConnectors(ctx, landmarks, HandPose.HAND_CONNECTIONS,
        { color: '#00FF00', lineWidth: 5 });
      drawLandmarks(ctx, landmarks,
        { color: '#FF0000', lineWidth: 2 });
    }
  }
  requestAnimationFrame(() => drawResults(handsResults));
}

// Start detection
hands.onResults(drawResults);