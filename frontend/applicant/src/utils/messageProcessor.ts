// Utility function to process applicant messages locally
import responsesData from '../../responses.json';

/**
 * Determines the appropriate response key based on the message
 */
function determineResponseKey(message: string): string {
  const lowerMessage = message.toLowerCase().trim();
  
  // Priority 1: Check if message matches any choice text from responses (exact match)
  for (const [responseKey, responseData] of Object.entries(responsesData)) {
    if (responseData.Choices && typeof responseData.Choices === 'object') {
      const choiceValues = Object.values(responseData.Choices);
      for (const choiceText of choiceValues) {
        if (typeof choiceText === 'string' && lowerMessage === choiceText.toLowerCase()) {
          // Match found - determine which response to return
          // For choices that map to specific responses
          if (choiceText.toLowerCase().includes('clearance')) return 'clearance';
          if (choiceText.toLowerCase().includes('other')) return 'other';
          if (choiceText.toLowerCase().includes('passport application')) return 'default';
          if (choiceText.toLowerCase().includes('passport record')) return 'default';
          if (choiceText.toLowerCase().includes('queue status')) return 'default';
          if (choiceText.toLowerCase().includes('appointment')) return 'default';
          if (choiceText.toLowerCase().includes('representative')) return 'default';
          if (choiceText.toLowerCase().includes('poor') || 
              choiceText.toLowerCase().includes('fair') || 
              choiceText.toLowerCase().includes('good') || 
              choiceText.toLowerCase().includes('excellent')) return 'default';
          // Default to the current response key
          return responseKey;
        }
      }
    }
  }
  
  // Priority 2: Check for keyword matches in message
  const initialKeywords: { [key: string]: string[] } = {
    'greetings': ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'welcome'],
    'inquiry': ['inquire', 'inquiry', 'ask', 'question'],
    'assistToday': ['assist', 'help', 'support'],
    'experience': ['experience', 'feedback', 'rate', 'review'],
  };

  for (const [key, keywords] of Object.entries(initialKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return key;
    }
  }
  
  // Default response
  return 'default';
}

/**
 * Processes applicant message and returns appropriate response
 */
export function processMessage(message: string) {
  try {
    // Validate input
    if (!message || typeof message !== 'string') {
      return {
        message: '',
        choices: [],
        error: 'Invalid input: Message is required'
      };
    }

    // Determine which response to use
    const responseKey = determineResponseKey(message);
    console.log('Message:', message, '-> Response Key:', responseKey);
    const response = responsesData[responseKey as keyof typeof responsesData] || responsesData.default;

    // Build choices array from the new format (Choice1, Choice2, etc.)
    const choices: string[] = [];
    if (response.Choices && typeof response.Choices === 'object') {
      const choicesObj = response.Choices as Record<string, string>;
      // Extract choice values in order (Choice1, Choice2, Choice3, Choice4)
      for (let i = 1; i <= 4; i++) {
        const choiceKey = `Choice${i}`;
        if (choicesObj[choiceKey]) {
          choices.push(choicesObj[choiceKey]);
        }
      }
    }

    console.log('Response:', response.Message, 'Choices:', choices);

    // Return successful response
    return {
      message: response.Message,
      choices,
      error: response.Errors || ''
    };

  } catch (error) {
    console.error('Error in processMessage:', error);
    return {
      message: '',
      choices: [],
      error: 'Internal error processing message'
    };
  }
}
