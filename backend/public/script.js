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

const cardConfigs = [
  // Green
  {
    id: 'institute-info',
    title: 'Institute Info',
    description: 'Get complete institute information',
    buttons: [{ endpoint: '/api/institute/info', method: 'GET' }],
    customClass: 'institute'
  },
  {
    id: 'institute-services',
    title: 'Institute Services',
    description: 'Get list of institute services',
    buttons: [{ endpoint: '/api/institute/services', method: 'GET' }],
    customClass: 'institute'
  },
  {
    id: 'service-form',
    title: 'Service Form',
    description: 'Get form by service ID',
    inputs: [{ id: 'service-form-service-id', type: 'number', placeholder: 'Service ID (0, 1, 2...)', defaultValue: '0' }],
    buttons: [{ endpoint: '/api/institute/form/:id', method: 'GET', useInputs: ['service-form-service-id'] }],
    customClass: 'institute'
  },
  {
    id: 'privacy',
    title: 'Privacy Notice',
    description: 'Get institute privacy notice',
    buttons: [{ endpoint: '/api/institute/notice', method: 'GET' }],
    customClass: 'institute'
  },
  
  // Cyan
  {
    id: 'applicant-submit',
    title: 'Submit Applicant Form',
    description: 'Submit applicant form data',
    textareas: [{ id: 'submit-data', rows: 4, placeholder: '{"name": "John Doe", "document": "BIR Form 1901", "isPriority": false}', defaultValue: '{\n  "name": "John Doe",\n  "document": "BIR Form 1901",\n  "isPriority": false\n}' }],
    buttons: [{ label: 'Submit Form', endpoint: '/api/applicant/submit', method: 'POST', useBody: 'submit-data' }],
    customClass: "applicant-actions"
  },
  {
    id: 'applicant-info',
    title: 'Applicant Info',
    description: 'Get current applicant information from session',
    buttons: [{ label: 'Get My Info', endpoint: '/api/applicant/info', method: 'GET' }],
    customClass: "applicant-actions"
  },
  {
    id: 'applicant-feedback',
    title: 'Submit Feedback',
    description: 'Submit applicant feedback',
    textareas: [{ id: 'feedback-data', rows: 3, placeholder: '{"feedbackChoice": "satisfied", "feedbackComments": "Great service!"}', defaultValue: '{\n  "feedbackChoice": "satisfied",\n  "feedbackComments": "Great service!"\n}' }],
    buttons: [{ label: 'Submit Feedback', endpoint: '/api/applicant/feedback', method: 'POST', useBody: 'feedback-data' }],
    customClass: "applicant-actions"
  },

  
  // Yellow
  {
    id: 'server-shutdown',
    title: 'Server Shutdown',
    description: 'Shutdown the entire server',
    buttons: [{ label: 'Shutdown Server', endpoint: '/api/server/shutdown', method: 'POST' }],
    customClass: 'small-server'
  },
  {
    id: 'dashboard-queue',
    title: 'Dashboard - Queue Status',
    description: 'Get queue data for dashboard (users in queue, next in line)',
    buttons: [{ label: 'Get Queue Data', endpoint: '/api/server/dashboard/queue', method: 'GET' }],
    customClass: 'small-server'
  },
  {
    id: 'dashboard-users',
    title: 'Dashboard - Active Users',
    description: 'Get list of active users for dashboard',
    buttons: [{ label: 'Get Active Users', endpoint: '/api/server/dashboard/users', method: 'GET' }],
    customClass: 'small-server'
  },
  {
    id: 'dashboard-summary',
    title: 'Dashboard - Summary',
    description: 'Get summary statistics (requests today, avg wait time, uptime)',
    buttons: [{ label: 'Get Summary', endpoint: '/api/server/dashboard/summary', method: 'GET' }],
    customClass: 'small-server'
  },
  {
    id: 'qr',
    title: 'QR Code Generator',
    description: 'Generate QR code for any URL',
    buttons: [{ endpoint: '/api/server/qr', method: 'GET', useInputs: ['qr-url'] }],
    customClass: 'small-server'
  },
  {
    id: 'server-check',
    title: 'Server Check',
    description: 'Check server status',
    buttons: [{ endpoint: '/api/server/check', method: 'GET' }],
    customClass: 'small-server'
  },

  // Blue
  {
    id: 'server-devices',
    title: 'Connected Devices',
    description: 'Check registered devices with types',
    buttons: [{ endpoint: '/api/server/devices', method: 'GET' }],
    customClass: 'server-connected-devices'
  },
  {
    id: 'counter-sessions',
    title: 'Counter Sessions',
    description: 'Check session information',
    buttons: [{ endpoint: '/api/session/all', method: 'GET' }],
    customClass: 'server-connected-devices'
  },
  {
    id: 'queue-management',
    title: 'Queue Management',
    description: 'Get complete queue distribution across all counters',
    buttons: [{ label: 'Get Queue Status', endpoint: '/api/queue/status', method: 'GET' }],
    customClass: 'server-connected-devices'
  },
  
  // Orange
  {
    id: 'session-delete',
    title: 'Disconnect Session',
    description: 'Disconnect a session',
    inputs: [{ id: 'delete-session-id', type: 'text', placeholder: 'Session ID' }],
    buttons: [{ label: 'Disconnect Session', endpoint: '/api/session/:id', method: 'DELETE', useInputs: ['delete-session-id'] }],
    customClass: 'server-actions-session'
  },
  {
    id: 'counter-close',
    title: 'Close Counter',
    description: 'Close a counter if it doesn\'t have any applicants',
    buttons: [{ label: 'Close Counter', endpoint: '/api/counter/close', method: 'POST' }],
    customClass: 'server-actions-session'
  },
  {
    id: 'counter-generate-keys',
    title: 'Generate Key',
    description: 'Generate a new counter key',
    buttons: [{ label: 'Generate Key', endpoint: '/api/counter/keys/generate', method: 'POST' }],
    customClass: 'server-actions-session'
  },
  
  // White
  {
    id: 'counter-activate',
    title: 'Activate Counter',
    description: 'Activate a counter with a key (one-time)',
    textareas: [{ id: 'activate-counter-data', rows: 2, placeholder: '{"key": "CS-2025-001-A4F9"}', defaultValue: '{\n  "key": "CS-2025-001-XXXX"\n}' }],
    buttons: [{ label: 'Activate Counter', endpoint: '/api/counter/activate', method: 'POST', useBody: 'activate-counter-data' }],
    customClass: 'counter-1'
  },
  {
    id: 'counter-activate',
    title: 'Activate Counter',
    description: 'Activate a counter with a key (one-time)',
    textareas: [{ id: 'activate-counter-data', rows: 2, placeholder: '{"key": "CS-2025-001-A4F9"}', defaultValue: '{\n  "key": "CS-2025-001-XXXX"\n}' }],
    buttons: [{ label: 'Activate Counter', endpoint: '/api/counter/activate', method: 'POST', useBody: 'activate-counter-data' }],
    customClass: 'counter-1'
  },

  // Purple
  {
    id: 'applicant-served',
    title: 'Mark as Served',
    description: 'Mark applicant as served',
    textareas: [{ id: 'served-data', rows: 2, placeholder: '{"closedServed": "notes"}', defaultValue: '{\n  "closedServed": "Completed"\n}' }],
    buttons: [{ label: 'Mark Served', endpoint: '/api/applicant/served', method: 'PUT', useBody: 'served-data' }],
    customClass: 'counter-actions'
  },
  {
    id: 'applicant-served',
    title: 'Mark as Served',
    description: 'Mark applicant as served',
    textareas: [{ id: 'served-data', rows: 2, placeholder: '{"closedServed": "notes"}', defaultValue: '{\n  "closedServed": "Completed"\n}' }],
    buttons: [{ label: 'Mark Served', endpoint: '/api/applicant/served', method: 'PUT', useBody: 'served-data' }],
    customClass: 'counter-actions'
  },
  {
    id: 'applicant-served',
    title: 'Mark as Served',
    description: 'Mark applicant as served',
    textareas: [{ id: 'served-data', rows: 2, placeholder: '{"closedServed": "notes"}', defaultValue: '{\n  "closedServed": "Completed"\n}' }],
    buttons: [{ label: 'Mark Served', endpoint: '/api/applicant/served', method: 'PUT', useBody: 'served-data' }],
    customClass: 'counter-actions'
  },

  // Debugger
  {
    id: 'session',
    title: 'Session Info',
    description: 'Check session information',
    buttons: [{ endpoint: '/api/session/self', method: 'GET' }],
    customClass: 'debugger'
  },
  {
    id: 'devices',
    title: 'Devices Info',
    description: 'Check registered devices',
    buttons: [{ endpoint: '/api/session/devices', method: 'GET' }],
    customClass: 'debugger'
  },
  {
    id: 'counter-keys',
    title: 'Available Keys',
    description: 'Get available and used counter keys',
    buttons: [{ label: 'Get Keys', endpoint: '/api/counter/keys', method: 'GET' }],
    customClass: 'debugger'
  },

  // IDK
  // {
  //   id: 'applicant-update',
  //   title: 'Update Applicant Info',
  //   description: 'Update applicant information',
  //   textareas: [{ id: 'update-data', rows: 3, placeholder: '{"name": "Updated Name", "isPriority": true}', defaultValue: '{\n  "isPriority": true\n}' }],
  //   buttons: [{ label: 'Update Info', endpoint: '/api/applicant/update', method: 'PUT', useBody: 'update-data' }]
  // },
  // {
  //   id: 'applicant-by-id',
  //   title: 'Get Applicant by ID',
  //   description: 'Get applicant info by session ID',
  //   inputs: [{ id: 'get-applicant-id', type: 'text', placeholder: 'Session ID' }],
  //   buttons: [{ label: 'Get Applicant', endpoint: '/api/applicant/info/:id', method: 'GET', useInputs: ['get-applicant-id'] }]
  // },
  // {
  //   id: 'applicant-all',
  //   title: 'All Applicants',
  //   description: 'Get list of all applicants',
  //   buttons: [{ label: 'Get All', endpoint: '/api/applicant/all', method: 'GET' }]
  // },
  
  // {
  //   id: 'counter-info',
  //   title: 'Counter Info',
  //   description: 'Get current counter information from session',
  //   buttons: [{ label: 'Get My Info', endpoint: '/api/counter/info', method: 'GET' }]
  // },
  // {
  //   id: 'counter-by-id',
  //   title: 'Get Counter by ID',
  //   description: 'Get counter info by session ID',
  //   inputs: [{ id: 'get-counter-id', type: 'text', placeholder: 'Session ID' }],
  //   buttons: [{ label: 'Get Counter', endpoint: '/api/counter/info/:id', method: 'GET', useInputs: ['get-counter-id'] }]
  // },
  // {
  //   id: 'counter-all',
  //   title: 'All Counters',
  //   description: 'Get list of all counters',
  //   buttons: [{ label: 'Get All', endpoint: '/api/counter/all', method: 'GET' }]
  // },
  // {
  //   id: 'counter-active',
  //   title: 'Active Counters',
  //   description: 'Get list of active counters only',
  //   buttons: [{ label: 'Get Active', endpoint: '/api/counter/active', method: 'GET' }]
  // },
  // {
  //   id: 'counter-update',
  //   title: 'Update Counter Info',
  //   description: 'Update counter information',
  //   textareas: [{ id: 'counter-update-data', rows: 2, placeholder: '{"dateActivated": "..."}' }],
  //   buttons: [{ label: 'Update Info', endpoint: '/api/counter/update', method: 'PUT', useBody: 'counter-update-data' }]
  // },
  // {
  //   id: 'counter-delete',
  //   title: 'Delete Counter Info',
  //   description: 'Remove counter data from session',
  //   buttons: [{ label: 'Delete Info', endpoint: '/api/counter/info', method: 'DELETE' }]
  // },
  
  // {
  //   id: 'queue-all',
  //   title: 'Queue Status',
  //   description: 'Get complete queue distribution across all counters',
  //   buttons: [{ label: 'Get Queue Status', endpoint: '/api/queue/all', method: 'GET' }]
  // },
  // {
  //   id: 'applicant-position',
  //   title: 'Applicant Position',
  //   description: 'Get queue position for current session or specific applicant',
  //   inputs: [{ id: 'applicant-session-id', type: 'text', placeholder: 'Session ID (optional, uses current session if empty)' }],
  //   buttons: [{ label: 'Get Position', endpoint: '/api/queue/applicant/:id', method: 'GET', useInputs: ['applicant-session-id'] }]
  // },
  // {
  //   id: 'counter-next',
  //   title: 'Next Applicant',
  //   description: 'Get next applicant for current counter session',
  //   buttons: [{ label: 'Get Next', endpoint: '/api/queue/counter/next', method: 'GET' }]
  // },
  // {
  //   id: 'counter-queue',
  //   title: 'Counter Queue',
  //   description: 'Get queue for specific counter or current session',
  //   inputs: [{ id: 'counter-session-id', type: 'text', placeholder: 'Counter ID (optional, uses current session if empty)' }],
  //   buttons: [{ label: 'Get Counter Queue', endpoint: '/api/queue/counter/:id', method: 'GET', useInputs: ['counter-session-id'] }]
  // },
  // {
  //   id: 'stats',
  //   title: 'Database Statistics',
  //   description: 'View current database state and record counts',
  //   buttons: [{ endpoint: '/api/test/stats', method: 'GET' }]
  // },
  // {
  //   id: 'ping',
  //   title: 'Chatbot Ping',
  //   description: 'Test if chatbot endpoint is responding',
  //   buttons: [{ endpoint: '/api/chatbot/ping', method: 'GET' }]
  // },
  // {
  //   id: 'start',
  //   title: 'Start Conversation',
  //   description: 'Initialize a new chatbot conversation',
  //   buttons: [{ endpoint: '/api/chatbot', method: 'POST', bodyData: { message: 'start', type: 'closed' } }]
  // },
  // {
  //   id: 'feedback',
  //   title: 'Request Feedback',
  //   description: 'Request user feedback options',
  //   buttons: [{ endpoint: '/api/chatbot', method: 'POST', bodyData: { message: 'feedback', type: 'closed' } }]
  // },
  // {
  //   id: 'closed',
  //   title: 'Custom Closed Message',
  //   description: 'Send a custom closed-ended message',
  //   inputs: [{ id: 'closed-closed-message', type: 'text', placeholder: 'Enter message (e.g., \'start\', \'feedback\')' }],
  //   buttons: [{ endpoint: '/api/chatbot', method: 'POST', useBody: { message: 'closed-closed-message', type: 'closed' } }]
  // },
  // {
  //   id: 'open',
  //   title: 'Open-ended Message',
  //   description: 'Send a custom open-ended message',
  //   textareas: [{ id: 'open-open-message', rows: 3, placeholder: 'Type your message here...' }],
  //   buttons: [{ endpoint: '/api/chatbot', method: 'POST', useBody: { message: 'open-open-message', type: 'open' } }]
  // },
  // {
  //   id: 'sessions',
  //   title: 'Active Sessions',
  //   description: 'View all active chat sessions',
  //   buttons: [{ endpoint: '/api/test/sessions', method: 'GET' }]
  // },
  // {
  //   id: 'queue',
  //   title: 'Queue Status',
  //   description: 'View current waiting queue',
  //   buttons: [{ endpoint: '/api/test/queue', method: 'GET' }]
  // },
  // {
  //   id: 'tables',
  //   title: 'Database Tables',
  //   description: 'List all database tables',
  //   buttons: [{ endpoint: '/api/test/tables', method: 'GET' }]
  // },
  // {
  //   id: 'counters-get',
  //   title: 'Get Counters',
  //   description: 'List all counters',
  //   buttons: [{ endpoint: '/api/counter', method: 'GET' }]
  // },
  // {
  //   id: 'counters-create',
  //   title: 'Create Counter',
  //   description: 'Create a new counter',
  //   buttons: [{ endpoint: '/api/counter', method: 'POST', bodyData: {} }]
  // },
  // {
  //   id: 'counter-get',
  //   title: 'Get Counter by ID',
  //   description: 'Get a specific counter',
  //   inputs: [{ id: 'counter-get-sessionId', type: 'text', placeholder: 'Enter session ID' }],
  //   buttons: [{ endpoint: '/api/counter/:id', method: 'GET', useInputs: ['counter-get-sessionId'] }]
  // },
  // {
  //   id: 'counter-delete',
  //   title: 'Delete Counter by ID',
  //   description: 'Delete a specific counter',
  //   inputs: [{ id: 'counter-delete-sessionId', type: 'text', placeholder: 'Enter session ID' }],
  //   buttons: [{ endpoint: '/api/counter/:id', method: 'DELETE', useInputs: ['counter-delete-sessionId'] }]
  // },
  // {
  //   id: 'counter-update',
  //   title: 'Update Counter',
  //   description: 'Update counter status and properties',
  //   inputs: [{ id: 'counter-update-sessionId', type: 'text', placeholder: 'Enter session ID' }],
  //   textareas: [{ id: 'counter-data', rows: 4, placeholder: '{"status": "active", "counterId": "counter-123"}', defaultValue: '{\n  "status": "active"\n}' }],
  //   buttons: [{ endpoint: '/api/counter/:id', method: 'PUT', useInputs: ['counter-update-sessionId'], useBody: 'counter-data' }]
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
      
      if (buttonConfig.useInputs) {
        const inputs = Array.isArray(buttonConfig.useInputs) ? buttonConfig.useInputs : [buttonConfig.useInputs];
        
        if (endpoint.includes(':')) {
          inputs.forEach(inputId => {
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
              const value = inputElement.value;
              endpoint = endpoint.replace(':id', value).replace(/:[\w-]+/, value);
            }
          });
        } else if (method === 'GET') {
          const params = new URLSearchParams();
          inputs.forEach(inputId => {
            const inputElement = document.getElementById(inputId);
            if (inputElement && inputElement.value) {
              const paramName = inputId.split('-').pop();
              params.append(paramName, inputElement.value);
            }
          });
          const paramString = params.toString();
          if (paramString) {
            endpoint += (endpoint.includes('?') ? '&' : '?') + paramString;
          }
        }
      }
      
      if (method !== 'GET' && method !== 'DELETE') {
        if (buttonConfig.bodyData) {
          body = JSON.stringify(buttonConfig.bodyData);
        } else if (buttonConfig.useBody) {
          if (typeof buttonConfig.useBody === 'string') {
            const element = document.getElementById(buttonConfig.useBody);
            if (element) {
              try {
                body = JSON.stringify(JSON.parse(element.value));
              } catch (e) {
                body = JSON.stringify({ data: element.value });
              }
            }
          } else if (typeof buttonConfig.useBody === 'object') {
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

function generateApiInfo(button) {
  if (!button.endpoint) return '';
  
  const method = button.method || 'GET';
  let info = `<div class="api-info">
    <strong>${method}</strong> <code>${button.endpoint}</code>`;
  
  if (button.bodyData) {
    info += `<br><small>Body: <code>${JSON.stringify(button.bodyData)}</code></small>`;
  } else if (button.useBody) {
    if (typeof button.useBody === 'string') {
      info += `<br><small>Body: From <code>${button.useBody}</code> field</small>`;
    } else if (typeof button.useBody === 'object') {
      const fields = Object.entries(button.useBody).map(([key, val]) => `${key}: &lt;${val}&gt;`).join(', ');
      info += `<br><small>Body: { ${fields} }</small>`;
    }
  }
  
  if (button.useInputs) {
    const inputs = Array.isArray(button.useInputs) ? button.useInputs : [button.useInputs];
    info += `<br><small>Params: ${inputs.map(id => `&lt;${id}&gt;`).join(', ')}</small>`;
  }
  
  info += `</div>`;
  return info;
}

function createCard(config) {
  const card = document.createElement('div');
  card.className = `card ${config.customClass || ''}`;
  
  let html = `
    <div class="card-header">
      <h2>${config.title}</h2>
      <button class="go-button" id="${config.id}-go-btn">Go</button>
    </div>
    <p>${config.description}</p>
  `;
  
  if (config.buttons) {
    config.buttons.forEach(button => {
      if (!button.customHandler) {
        html += generateApiInfo(button);
      }
    });
  }
  
  if (config.inputs) {
    config.inputs.forEach(input => {
      html += `<input type="${input.type}" id="${input.id}" placeholder="${input.placeholder}" ${input.defaultValue ? `value="${input.defaultValue}"` : ''}>`;
    });
  }
  
  if (config.textareas) {
    config.textareas.forEach(textarea => {
      html += `<textarea id="${textarea.id}" rows="${textarea.rows}" placeholder="${textarea.placeholder}">${textarea.defaultValue || ''}</textarea>`;
    });
  }
  
  html += `
    <div id="${config.id}-loading" class="loading">Loading...</div>
    <div id="${config.id}-response" class="response-box"></div>
  `;
  
  card.innerHTML = html;
  
  if (config.buttons && config.buttons.length > 0) {
    const goButton = card.querySelector(`#${config.id}-go-btn`);
    const button = config.buttons[0];
    
    if (button.customHandler) {
      goButton.onclick = button.customHandler;
    } else {
      goButton.onclick = generateApiFunction(config.id, button, 0);
    }
  }
  
  return card;
}

function initializeCards() {
  const container = document.getElementById('api-cards-container');
  cardConfigs.forEach(config => {
    container.appendChild(createCard(config));
  });
}

document.addEventListener('DOMContentLoaded', initializeCards);

function displayResponse(elementId, data, isError = false) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.className = isError ? 'response-box error-box' : 'response-box success-box';
  element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

function setLoading(elementId, isLoading) {
  const element = document.getElementById(elementId);
  if (element) {
    element.className = isLoading ? 'loading active' : 'loading';
  }
}
