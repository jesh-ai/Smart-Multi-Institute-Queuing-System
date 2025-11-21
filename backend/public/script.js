/**
 * EASY CARD TEMPLATE SYSTEM - AUTO-GENERATED FUNCTIONS
 * =====================================================
 * 
 * To add a new API testing card, just add a new object to the `cardConfigs` array below!
 * The system will automatically generate the fetch function for you!
 * 
 * CARD CONFIGURATION:
 * -------------------
 * {
 *   id: 'unique-id',              // Unique ID for the card
 *   title: 'Card Title',          // Display title
 *   description: 'Description',   // Display description
 *   endpoint: '/api/endpoint',    // API endpoint to call
 *   method: 'GET',                // HTTP method (GET, POST, PUT, DELETE)
 *   inputs: [...],                // Optional: input fields
 *   textareas: [...],             // Optional: textarea fields
 *   buttons: [...],               // Button configurations
 *   customClass: 'my-class',      // Optional: custom CSS class
 *   customHandler: myFunction     // Optional: use custom function instead of auto-generated
 * }
 * 
 * BUTTON CONFIGURATION:
 * ---------------------
 * {
 *   label: 'Button Text',         // Button label
 *   endpoint: '/api/endpoint',    // API endpoint (can use :param for dynamic values)
 *   method: 'GET',                // HTTP method
 *   useInputs: ['input-id'],      // Optional: which inputs to use for URL params
 *   useBody: ['input-id'],        // Optional: which inputs to send in body
 *   customHandler: myFunction     // Optional: use custom function instead
 * }
 * 
 * EXAMPLES:
 * ---------
 * 
 * Simple GET request:
 * {
 *   id: 'users',
 *   title: 'Get Users',
 *   description: 'Fetch all users',
 *   buttons: [{ label: 'Get Users', endpoint: '/api/users', method: 'GET' }]
 * }
 * 
 * Dynamic parameter in URL:
 * {
 *   id: 'user-by-id',
 *   title: 'Get User by ID',
 *   description: 'Fetch specific user',
 *   inputs: [{ id: 'user-id', type: 'number', placeholder: 'User ID' }],
 *   buttons: [{ label: 'Get User', endpoint: '/api/users/:id', method: 'GET', useInputs: ['user-id'] }]
 * }
 * 
 * POST with body:
 * {
 *   id: 'create-user',
 *   title: 'Create User',
 *   description: 'Create a new user',
 *   textareas: [{ id: 'user-data', rows: 4, placeholder: '{"name": "John"}' }],
 *   buttons: [{ label: 'Create', endpoint: '/api/users', method: 'POST', useBody: ['user-data'] }]
 * }
 */

const API_BASE = '';

// ============= CARD TEMPLATE SYSTEM =============

const cardConfigs = [
  {
    id: 'stats',
    title: 'Database Statistics',
    description: 'View current database state and record counts',
    buttons: [{ label: 'Get Stats', endpoint: '/api/test/stats', method: 'GET' }]
  },
  {
    id: 'institutes',
    title: 'Institutes',
    description: 'View all registered institutes',
    buttons: [{ label: 'Get All Institutes', endpoint: '/api/test/institutes', method: 'GET' }]
  },
  {
    id: 'services',
    title: 'Services',
    description: 'View all available services',
    buttons: [{ label: 'Get All Services', endpoint: '/api/test/services', method: 'GET' }]
  },
  {
    id: 'institute-info',
    title: 'Institute Info',
    description: 'Get complete institute information',
    buttons: [{ label: 'GET /api/institute/info', endpoint: '/api/institute/info', method: 'GET' }],
    customClass: 'institute-card'
  },
  {
    id: 'institute-services',
    title: 'Institute Services',
    description: 'Get list of institute services',
    buttons: [{ label: 'GET /api/institute/services', endpoint: '/api/institute/services', method: 'GET' }],
    customClass: 'institute-card'
  },
  {
    id: 'service-form',
    title: 'Service Form',
    description: 'Get form by service ID',
    inputs: [{ id: 'service-id', type: 'number', placeholder: 'Service ID (0, 1, 2...)', defaultValue: '0' }],
    buttons: [{ label: 'GET /api/institute/form/:id', endpoint: '/api/institute/form/:id', method: 'GET', useInputs: ['service-id'] }],
    customClass: 'institute-card'
  },
  {
    id: 'privacy',
    title: 'Privacy Notice',
    description: 'Get institute privacy notice',
    buttons: [{ label: 'GET /api/institute/notice', endpoint: '/api/institute/notice', method: 'GET' }],
    customClass: 'institute-card'
  },
  {
    id: 'ping',
    title: 'Chatbot Ping',
    description: 'Test if chatbot endpoint is responding',
    buttons: [{ label: 'Ping Chatbot', endpoint: '/api/chatbot/ping', method: 'GET' }]
  },
  {
    id: 'start',
    title: 'Start Conversation',
    description: 'Initialize a new chatbot conversation',
    buttons: [{ label: 'Send "start"', endpoint: '/api/chatbot', method: 'POST', bodyData: { message: 'start', type: 'closed' } }]
  },
  {
    id: 'feedback',
    title: 'Request Feedback',
    description: 'Request user feedback options',
    buttons: [{ label: 'Send "feedback"', endpoint: '/api/chatbot', method: 'POST', bodyData: { message: 'feedback', type: 'closed' } }]
  },
  {
    id: 'closed',
    title: 'Custom Closed Message',
    description: 'Send a custom closed-ended message',
    inputs: [{ id: 'closed-message', type: 'text', placeholder: 'Enter message (e.g., \'start\', \'feedback\')' }],
    buttons: [{ label: 'Send Message', endpoint: '/api/chatbot', method: 'POST', useBody: { message: 'closed-message', type: 'closed' } }]
  },
  {
    id: 'open',
    title: 'Open-ended Message',
    description: 'Send a custom open-ended message',
    textareas: [{ id: 'open-message', rows: 3, placeholder: 'Type your message here...' }],
    buttons: [{ label: 'Send Message', endpoint: '/api/chatbot', method: 'POST', useBody: { message: 'open-message', type: 'open' } }]
  },
  {
    id: 'sessions',
    title: 'Active Sessions',
    description: 'View all active chat sessions',
    buttons: [
      { label: 'Get Sessions', endpoint: '/api/test/sessions', method: 'GET' },
      { label: 'Clear', customHandler: clearSessions }
    ]
  },
  {
    id: 'queue',
    title: 'Queue Status',
    description: 'View current waiting queue',
    buttons: [{ label: 'Get Queue', endpoint: '/api/test/queue', method: 'GET' }]
  },
  {
    id: 'tables',
    title: 'Database Tables',
    description: 'List all database tables',
    buttons: [{ label: 'Get Tables', endpoint: '/api/test/tables', method: 'GET' }]
  },
  {
    id: 'qr',
    title: 'QR Code Generator',
    description: 'Generate QR code for test page',
    buttons: [{ label: 'Generate QR', endpoint: '/api/qr?url=http://localhost:4000/test.html', method: 'GET' }]
  },
  {
    id: 'session',
    title: 'Session & Devices',
    description: 'Check session and device information',
    buttons: [
      { label: 'GET /session', endpoint: '/api/server/session', method: 'GET' },
      { label: 'GET /devices', endpoint: '/api/server/devices', method: 'GET' },
      { label: 'GET /server/check', endpoint: '/api/server/check', method: 'GET' }
    ]
  },
  {
    id: 'counters',
    title: 'Counters',
    description: 'Manage counter operations',
    buttons: [
      { label: 'GET /counters', endpoint: '/api/counter', method: 'GET' },
      { label: 'POST /counters (create)', endpoint: '/api/counter', method: 'POST', bodyData: {} }
    ]
  },
  {
    id: 'counter-id',
    title: 'Counter by ID',
    description: 'Get, update, or delete a specific counter',
    inputs: [{ id: 'counter-sessionId', type: 'text', placeholder: 'Enter session ID' }],
    buttons: [
      { label: 'GET /counters/:id', endpoint: '/api/counter/:id', method: 'GET', useInputs: ['counter-sessionId'] },
      { label: 'DELETE /counters/:id', endpoint: '/api/counter/:id', method: 'DELETE', useInputs: ['counter-sessionId'] }
    ]
  },
  {
    id: 'counter-update',
    title: 'Update Counter',
    description: 'Update counter status and properties',
    inputs: [{ id: 'counter-update-sessionId', type: 'text', placeholder: 'Enter session ID' }],
    textareas: [{ id: 'counter-data', rows: 4, placeholder: '{"status": "active", "counterId": "counter-123"}', defaultValue: '{\n  "status": "active"\n}' }],
    buttons: [{ label: 'PUT /counters/:id', endpoint: '/api/counter/:id', method: 'PUT', useInputs: ['counter-update-sessionId'], useBody: 'counter-data' }]
  }
  
  // ====== ADD YOUR NEW CARDS HERE! ======
  // Just copy one of the examples above and modify it!
  // Example:
  // {
  //   id: 'my-new-card',
  //   title: 'My New API Test',
  //   description: 'Test my awesome endpoint',
  //   buttons: [{ label: 'Test It', endpoint: '/api/my-endpoint', method: 'GET' }]
  // }
];

/**
 * Generate a dynamic API function based on button config
 */
function generateApiFunction(cardId, buttonConfig, buttonIndex) {
  return async function() {
    const loadingId = `${cardId}-loading`;
    const responseId = `${cardId}-response`;
    
    setLoading(loadingId, true);
    
    try {
      let endpoint = buttonConfig.endpoint;
      const method = buttonConfig.method || 'GET';
      let body = null;
      
      // Handle URL parameters from inputs
      if (buttonConfig.useInputs) {
        const inputs = Array.isArray(buttonConfig.useInputs) ? buttonConfig.useInputs : [buttonConfig.useInputs];
        inputs.forEach(inputId => {
          const inputElement = document.getElementById(inputId);
          if (inputElement) {
            const value = inputElement.value;
            endpoint = endpoint.replace(':id', value).replace(/:[\w-]+/, value);
          }
        });
      }
      
      // Handle body data
      if (method !== 'GET' && method !== 'DELETE') {
        if (buttonConfig.bodyData) {
          // Static body data
          body = JSON.stringify(buttonConfig.bodyData);
        } else if (buttonConfig.useBody) {
          // Dynamic body from inputs/textareas
          if (typeof buttonConfig.useBody === 'string') {
            // Single field - parse as JSON
            const element = document.getElementById(buttonConfig.useBody);
            if (element) {
              try {
                body = JSON.stringify(JSON.parse(element.value));
              } catch (e) {
                body = JSON.stringify({ data: element.value });
              }
            }
          } else if (typeof buttonConfig.useBody === 'object') {
            // Object mapping - build body from multiple fields
            const bodyObj = {};
            for (const [key, inputId] of Object.entries(buttonConfig.useBody)) {
              const element = document.getElementById(inputId);
              if (element) {
                bodyObj[key] = key === 'type' ? inputId : element.value;
              }
            }
            body = JSON.stringify(bodyObj);
          }
        }
      }
      
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      };
      
      if (body) {
        options.body = body;
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, options);
      const data = await response.json();
      
      displayResponse(responseId, data, !response.ok);
    } catch (error) {
      displayResponse(responseId, { error: error.message }, true);
    }
    
    setLoading(loadingId, false);
  };
}

/**
 * Generate a card from configuration
 */
function createCard(config) {
  const card = document.createElement('div');
  card.className = `card ${config.customClass || ''}`;
  
  let html = `
    <h2>${config.title}</h2>
    <p>${config.description}</p>
  `;
  
  // Add inputs if specified
  if (config.inputs) {
    config.inputs.forEach(input => {
      html += `<input type="${input.type}" id="${input.id}" placeholder="${input.placeholder}" ${input.defaultValue ? `value="${input.defaultValue}"` : ''}>`;
    });
  }
  
  // Add textareas if specified
  if (config.textareas) {
    config.textareas.forEach(textarea => {
      html += `<textarea id="${textarea.id}" rows="${textarea.rows}" placeholder="${textarea.placeholder}">${textarea.defaultValue || ''}</textarea>`;
    });
  }
  
  // Add loading and response containers
  html += `
    <div id="${config.id}-loading" class="loading">Loading...</div>
    <div id="${config.id}-response" class="response-box"></div>
  `;
  
  card.innerHTML = html;
  
  // Add buttons with generated or custom handlers
  if (config.buttons) {
    config.buttons.forEach((button, index) => {
      const buttonElement = document.createElement('button');
      buttonElement.textContent = button.label;
      
      if (button.customHandler) {
        // Use custom handler if provided
        buttonElement.onclick = button.customHandler;
      } else {
        // Generate handler from config
        buttonElement.onclick = generateApiFunction(config.id, button, index);
      }
      
      // Insert button before loading div
      const loadingDiv = card.querySelector(`#${config.id}-loading`);
      card.insertBefore(buttonElement, loadingDiv);
    });
  }
  
  return card;
}

/**
 * Initialize all cards
 */
function initializeCards() {
  const container = document.getElementById('api-cards-container');
  cardConfigs.forEach(config => {
    container.appendChild(createCard(config));
  });
}

// Initialize cards when DOM is ready
document.addEventListener('DOMContentLoaded', initializeCards);

// ============= UTILITY FUNCTIONS =============

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
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '';
  }
}

// Clear sessions response
function clearSessions() {
  clearResponse('sessions-response');
}
