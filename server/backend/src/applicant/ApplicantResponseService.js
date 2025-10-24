// handles AI + predefined rlogic

const predefined = require("./PredefinedResponses.json");

async function handleApplicantResponse(message, type) {
  // Closed-ended logic
  if (type === "closed") {
    const found = predefined[message];
    if (found) return found;

    // fallback for undefined close-ended message
    return {
      Message: "I didn’t recognize that option. Please try again.",
      Choices: { Choice1: "Main Menu" },
      Errors: ""
    };
  }

  // Open-ended logic (AI integration)
  if (type === "open") {
    const aiResponse = await fetchAIResponse(message);
    return aiResponse;
  }
}

async function fetchAIResponse(message) {
  // Placeholder for AI API call
  return {
    Message: `AI Response for: ${message}`,
    Choices: {
      Choice1: "Main Menu",
      Choice2: "End Chat"
    },
    Errors: ""
  };
}

module.exports = { handleApplicantResponse };
