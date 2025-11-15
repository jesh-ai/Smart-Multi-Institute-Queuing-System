const API_BASE = '';

// Utility: Display response
function displayResponse(elementId, data, isError = false) {
  console.log('displayResponse called:', elementId, data, isError);
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }
  element.className = isError ? 'response-box error-box' : 'response-box success-box';
  element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

// Utility: Show/hide loading
function setLoading(elementId, isLoading) {
  const element = document.getElementById(elementId);
  if (element) {
    element.className = isLoading ? 'loading active' : 'loading';
  }
}

// Utility: Clear response
function clearResponse(elementId) {
  document.getElementById(elementId).innerHTML = '';
}

// Database Stats
async function getStats() {
  console.log('getStats called');
  setLoading('stats-loading', true);
  try {
    console.log('Fetching:', `${API_BASE}/api/test/stats`);
    const response = await fetch(`${API_BASE}/api/test/stats`);
    console.log('Response:', response);
    const data = await response.json();
    console.log('Data:', data);
    
    if (data.success) {
      const stats = data.data;
      const html = `
        <div class="stats-grid">
          <div class="stat-card">
            <h3>${stats.institutes.count}</h3>
            <p>Institutes</p>
          </div>
          <div class="stat-card">
            <h3>${stats.services.count}</h3>
            <p>Services</p>
          </div>
          <div class="stat-card">
            <h3>${stats.sessions.count}</h3>
            <p>Sessions</p>
          </div>
          <div class="stat-card">
            <h3>${stats.queue.count}</h3>
            <p>Queue</p>
          </div>
          <div class="stat-card">
            <h3>${stats.applicants.count}</h3>
            <p>Applicants</p>
          </div>
        </div>
      `;
      document.getElementById('stats-response').innerHTML = html;
    } else {
      const element = document.getElementById('stats-response');
      element.className = 'response-box error-box';
      element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
  } catch (error) {
    displayResponse('stats-response', { error: error.message }, true);
  }
  setLoading('stats-loading', false);
}

// Get Institutes
async function getInstitutes() {
  setLoading('institutes-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/test/institutes`);
    const data = await response.json();
    displayResponse('institutes-response', data);
  } catch (error) {
    displayResponse('institutes-response', { error: error.message }, true);
  }
  setLoading('institutes-loading', false);
}

// Get Services
async function getServices() {
  setLoading('services-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/test/services`);
    const data = await response.json();
    displayResponse('services-response', data);
  } catch (error) {
    displayResponse('services-response', { error: error.message }, true);
  }
  setLoading('services-loading', false);
}

// Ping Chatbot
async function pingChatbot() {
  setLoading('ping-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/chatbot/ping`);
    const data = await response.json();
    displayResponse('ping-response', data);
  } catch (error) {
    displayResponse('ping-response', { error: error.message }, true);
  }
  setLoading('ping-loading', false);
}

// Start Conversation
async function startConversation() {
  setLoading('start-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/chatbot/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Message: 'start',
        MessageType: 'closed'
      })
    });
    const data = await response.json();
    displayResponse('start-response', data);
  } catch (error) {
    displayResponse('start-response', { error: error.message }, true);
  }
  setLoading('start-loading', false);
}

// Request Feedback
async function requestFeedback() {
  setLoading('feedback-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/chatbot/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Message: 'feedback',
        MessageType: 'closed'
      })
    });
    const data = await response.json();
    displayResponse('feedback-response', data);
  } catch (error) {
    displayResponse('feedback-response', { error: error.message }, true);
  }
  setLoading('feedback-loading', false);
}

// Send Custom Closed Message
async function sendClosedMessage() {
  const message = document.getElementById('closed-message').value.trim();
  if (!message) {
    displayResponse('closed-response', { error: 'Please enter a message' }, true);
    return;
  }

  setLoading('closed-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/chatbot/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Message: message,
        MessageType: 'closed'
      })
    });
    const data = await response.json();
    displayResponse('closed-response', data);
  } catch (error) {
    displayResponse('closed-response', { error: error.message }, true);
  }
  setLoading('closed-loading', false);
}

// Send Open Message
async function sendOpenMessage() {
  const message = document.getElementById('open-message').value.trim();
  if (!message) {
    displayResponse('open-response', { error: 'Please enter a message' }, true);
    return;
  }

  setLoading('open-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/chatbot/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Message: message,
        MessageType: 'open'
      })
    });
    const data = await response.json();
    displayResponse('open-response', data);
  } catch (error) {
    displayResponse('open-response', { error: error.message }, true);
  }
  setLoading('open-loading', false);
}

// Get Sessions
async function getSessions() {
  setLoading('sessions-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/test/sessions`);
    const data = await response.json();
    displayResponse('sessions-response', data);
  } catch (error) {
    displayResponse('sessions-response', { error: error.message }, true);
  }
  setLoading('sessions-loading', false);
}

// Get Queue
async function getQueue() {
  setLoading('queue-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/test/queue`);
    const data = await response.json();
    displayResponse('queue-response', data);
  } catch (error) {
    displayResponse('queue-response', { error: error.message }, true);
  }
  setLoading('queue-loading', false);
}

// Get Tables
async function getTables() {
  setLoading('tables-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/test/tables`);
    const data = await response.json();
    displayResponse('tables-response', data);
  } catch (error) {
    displayResponse('tables-response', { error: error.message }, true);
  }
  setLoading('tables-loading', false);
}

// Get QR Code
async function getQR() {
  setLoading('qr-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/qr`);
    const data = await response.json();
    
    if (data.qr) {
      document.getElementById('qr-response').innerHTML = `
        <img src="${data.qr}" alt="QR Code" style="max-width: 200px; display: block; margin: 10px auto;">
      `;
    } else {
      displayResponse('qr-response', data);
    }
  } catch (error) {
    displayResponse('qr-response', { error: error.message }, true);
  }
  setLoading('qr-loading', false);
}

// Auto-load stats on page load
window.addEventListener('DOMContentLoaded', () => {
  getStats();
});

// Session & Devices
async function getSession() {
  setLoading('session-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/session`, {
      credentials: 'include'
    });
    const data = await response.json();
    displayResponse('session-response', data);
  } catch (error) {
    displayResponse('session-response', { error: error.message }, true);
  }
  setLoading('session-loading', false);
}

async function getDevices() {
  setLoading('session-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/devices`, {
      credentials: 'include'
    });
    const data = await response.json();
    displayResponse('session-response', data);
  } catch (error) {
    displayResponse('session-response', { error: error.message }, true);
  }
  setLoading('session-loading', false);
}

async function getServerCheck() {
  setLoading('session-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/server/check`, {
      credentials: 'include'
    });
    const data = await response.json();
    displayResponse('session-response', data);
  } catch (error) {
    displayResponse('session-response', { error: error.message }, true);
  }
  setLoading('session-loading', false);
}

// Counters
async function getCounters() {
  setLoading('counters-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/counters`, {
      credentials: 'include'
    });
    const data = await response.json();
    displayResponse('counters-response', data);
  } catch (error) {
    displayResponse('counters-response', { error: error.message }, true);
  }
  setLoading('counters-loading', false);
}

async function createCounter() {
  setLoading('counters-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/counters`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    displayResponse('counters-response', data);
  } catch (error) {
    displayResponse('counters-response', { error: error.message }, true);
  }
  setLoading('counters-loading', false);
}

// Counter by ID
async function getCounterById() {
  const sessionId = document.getElementById('counter-sessionId').value.trim();
  if (!sessionId) {
    displayResponse('counter-id-response', { error: 'Session ID is required' }, true);
    return;
  }

  setLoading('counter-id-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/counters/${sessionId}`, {
      credentials: 'include'
    });
    const data = await response.json();
    displayResponse('counter-id-response', data);
  } catch (error) {
    displayResponse('counter-id-response', { error: error.message }, true);
  }
  setLoading('counter-id-loading', false);
}

async function deleteCounterById() {
  const sessionId = document.getElementById('counter-sessionId').value.trim();
  if (!sessionId) {
    displayResponse('counter-id-response', { error: 'Session ID is required' }, true);
    return;
  }

  if (!confirm(`Are you sure you want to delete counter with session ID: ${sessionId}?`)) {
    return;
  }

  setLoading('counter-id-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/counters/${sessionId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await response.json();
    displayResponse('counter-id-response', data);
  } catch (error) {
    displayResponse('counter-id-response', { error: error.message }, true);
  }
  setLoading('counter-id-loading', false);
}

// Update Counter
async function updateCounter() {
  const sessionId = document.getElementById('counter-update-sessionId').value.trim();
  const counterDataRaw = document.getElementById('counter-data').value.trim();

  if (!sessionId) {
    displayResponse('counter-update-response', { error: 'Session ID is required' }, true);
    return;
  }

  let counterData;
  try {
    counterData = JSON.parse(counterDataRaw);
  } catch (e) {
    displayResponse('counter-update-response', { error: 'Invalid JSON in Counter Data field: ' + e.message }, true);
    return;
  }

  setLoading('counter-update-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/counters/${sessionId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ counter: counterData })
    });
    const data = await response.json();
    displayResponse('counter-update-response', data);
  } catch (error) {
    displayResponse('counter-update-response', { error: error.message }, true);
  }
  setLoading('counter-update-loading', false);
}

// Institute Info
async function getInstituteInfo() {
  setLoading('institute-info-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/institute/info`);
    const data = await response.json();
    displayResponse('institute-info-response', data);
  } catch (error) {
    displayResponse('institute-info-response', { error: error.message }, true);
  }
  setLoading('institute-info-loading', false);
}


// Institute Services
async function getInstituteServices() {
  setLoading('institute-services-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/institute/services`);
    const data = await response.json();
    displayResponse('institute-services-response', data);
  } catch (error) {
    displayResponse('institute-services-response', { error: error.message }, true);
  }
  setLoading('institute-services-loading', false);
}

// Service Form
async function getServiceForm() {
  const serviceId = document.getElementById('service-id').value;
  if (!serviceId && serviceId !== '0') {
    displayResponse('service-form-response', { error: 'Please enter a service ID' }, true);
    return;
  }

  setLoading('service-form-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/institute/form/${serviceId}`);
    const data = await response.json();
    displayResponse('service-form-response', data);
  } catch (error) {
    displayResponse('service-form-response', { error: error.message }, true);
  }
  setLoading('service-form-loading', false);
}

// Privacy Notice
async function getPrivacyNotice() {
  setLoading('privacy-loading', true);
  try {
    const response = await fetch(`${API_BASE}/api/institute/notice`);
    const data = await response.json();
    displayResponse('privacy-response', data);
  } catch (error) {
    displayResponse('privacy-response', { error: error.message }, true);
  }
  setLoading('privacy-loading', false);
}
