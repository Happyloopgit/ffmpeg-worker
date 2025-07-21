/**
 * FFmpeg Worker - Asynchronous Video Rendering Service
 * 
 * This service receives video creation requests and processes them asynchronously
 * in the background, allowing the client to continue without waiting for the
 * potentially lengthy rendering process to complete.
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Read API secret key from environment variables
// This should be set in the deployment environment (e.g., Render.com)
const API_SECRET_KEY = process.env.API_SECRET_KEY;
if (!API_SECRET_KEY) {
  console.warn('WARNING: API_SECRET_KEY environment variable is not set. API security is compromised!');
}

// Configure Express to parse JSON with a high limit for potentially large payloads
app.use(express.json({ limit: '50mb' }));

/**
 * Health Check Endpoint
 * Used by monitoring services to verify the worker is running
 */
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'FFmpeg Worker is alive and ready!'
  });
});

/**
 * Main Video Creation Endpoint
 * 
 * This endpoint demonstrates the asynchronous nature of the worker:
 * 1. It immediately acknowledges receipt of the request with a 202 Accepted response
 * 2. It then continues processing in the background after the response is sent
 * 3. The client doesn't need to wait for the potentially lengthy rendering process
 * 
 * In a production environment, this would:
 * - Store the job in a database or queue
 * - Potentially notify the client when processing is complete via webhook/socket
 * - Handle errors gracefully with retries and notifications
 * 
 * Security:
 * - This endpoint is secured with an API key
 * - The key must be provided in the x-api-key header
 * - The key must match the API_SECRET_KEY environment variable
 */
app.post('/create-video', (req, res) => {
  // Check for API key in the request header
  const apiKey = req.headers['x-api-key'];
  
  // Validate the API key
  if (!apiKey || apiKey !== API_SECRET_KEY) {
    // If key is missing or incorrect, return 401 Unauthorized
    console.warn('Unauthorized access attempt to /create-video endpoint');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // API key is valid, proceed with the request
  
  // Log the received payload for debugging
  console.log('Received video creation request:', JSON.stringify(req.body, null, 2));
  
  // Extract the sutra_id from the request body
  const { sutra_id } = req.body;
  
  // Immediately respond with 202 Accepted to acknowledge receipt
  // This is key to the asynchronous nature - we don't make the client wait
  res.status(202).json({
    status: 'Accepted',
    message: 'Video rendering job accepted and will be processed in the background.'
  });
  
  // After sending the response, begin the background processing
  // In a real implementation, this might be handled by a job queue system
  // like Bull, or a separate worker process
  
  console.log(`Starting video assembly for sutra_id: ${sutra_id}`);
  
  // Simulate the video processing steps with setTimeout
  // This prevents blocking the event loop while we "work"
  setTimeout(() => {
    console.log(`Step 1: Downloading assets for sutra_id: ${sutra_id}...`);
    
    // Simulate the next step after a delay
    setTimeout(() => {
      console.log(`Step 2: Running complex FFmpeg command for sutra_id: ${sutra_id}... (This would take several minutes)`);
      
      // Simulate the next step after a delay
      setTimeout(() => {
        console.log(`Step 3: Uploading final video to storage for sutra_id: ${sutra_id}...`);
        
        // Simulate the final step after a delay
        setTimeout(() => {
          console.log(`Step 4: Updating status in database for sutra_id: ${sutra_id}...`);
          console.log(`Process complete for sutra_id: ${sutra_id}`);
          
          // In a real implementation, we might:
          // - Update a database record with the completed status
          // - Send a webhook to notify the client system
          // - Move on to the next job in the queue
          
        }, 1000); // Simulate database update (1 second)
      }, 2000); // Simulate upload (2 seconds)
    }, 3000); // Simulate FFmpeg processing (3 seconds)
  }, 1000); // Simulate asset download (1 second)
});

// Start the server
app.listen(PORT, () => {
  console.log(`FFmpeg Worker service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/`);
  console.log(`Video creation endpoint available at http://localhost:${PORT}/create-video (requires x-api-key header)`);
  
  // Remind about API key if not set
  if (!API_SECRET_KEY) {
    console.log('\x1b[33m%s\x1b[0m', 'SECURITY WARNING: API_SECRET_KEY is not set. Set this environment variable to secure your API.');
    console.log('Example: API_SECRET_KEY=your_secret_key node index.js');
  }
});
