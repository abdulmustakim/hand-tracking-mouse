// gestureRecognition.js

// Configuration for gesture detection
const GESTURE_CONFIG = {
    PINCH_THRESHOLD: 0.05,
    CLICK_DURATION: 100,
    DOUBLE_CLICK_TIME: 300,
    CONFIDENCE_THRESHOLD: 0.7
};

// Track gesture state
let gestureState = {
    isPinching: false,
    lastClickTime: 0,
    clickCount: 0,
    pinchStart: null
};

// Calculate distance between two points
function calculateDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Detect pinch gesture (thumb and index finger)
function detectPinch(landmarks) {
    if (!landmarks || landmarks.length < 9) return false;
    
    // Get thumb tip (4) and index tip (8) landmarks
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    
    const distance = calculateDistance(thumbTip, indexTip);
    
    return distance < GESTURE_CONFIG.PINCH_THRESHOLD;
}

// Detect right-click gesture (thumb and middle finger)
function detectRightClick(landmarks) {
    if (!landmarks || landmarks.length < 12) return false;
    
    // Get thumb tip (4) and middle finger tip (12)
    const thumbTip = landmarks[4];
    const middleTip = landmarks[12];
    
    const distance = calculateDistance(thumbTip, middleTip);
    
    return distance < GESTURE_CONFIG.PINCH_THRESHOLD;
}

// Handle left click
function handleLeftClick() {
    const now = Date.now();
    
    if (now - gestureState.lastClickTime < GESTURE_CONFIG.DOUBLE_CLICK_TIME) {
        gestureState.clickCount++;
        if (gestureState.clickCount === 2) {
            simulateDoubleClick();
            gestureState.clickCount = 0;
        }
    } else {
        gestureState.clickCount = 1;
        simulateClick();
    }
    
    gestureState.lastClickTime = now;
}

// Handle right click
function handleRightClick() {
    simulateRightClick();
}

// Simulate left click event
function simulateClick() {
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    document.dispatchEvent(event);
    console.log('Left click detected');
}

// Simulate double click event
function simulateDoubleClick() {
    const event = new MouseEvent('dblclick', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    document.dispatchEvent(event);
    console.log('Double click detected');
}

// Simulate right click event
function simulateRightClick() {
    const event = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    document.dispatchEvent(event);
    console.log('Right click detected');
}

// Main gesture detection function
function recognizeGesture(landmarks) {
    if (!landmarks) return;
    
    // Check for pinch (left click)
    const isPinching = detectPinch(landmarks);
    
    // Check for right click
    const isRightClicking = detectRightClick(landmarks);
    
    // Handle pinch state transition
    if (isPinching && !gestureState.isPinching) {
        gestureState.isPinching = true;
        gestureState.pinchStart = Date.now();
    } else if (!isPinching && gestureState.isPinching) {
        gestureState.isPinching = false;
        const duration = Date.now() - gestureState.pinchStart;
        
        if (duration > GESTURE_CONFIG.CLICK_DURATION) {
            handleLeftClick();
        }
    }
    
    // Handle right click
    if (isRightClicking) {
        handleRightClick();
    }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        recognizeGesture,
        detectPinch,
        detectRightClick,
        calculateDistance
    };
}