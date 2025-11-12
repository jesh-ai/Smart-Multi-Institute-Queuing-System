## API CONTRACTS
Include:
- Endpoint path (POST /chatbot/respond)
- Required request body
- Response format with field types and examples
- Error codes and fallback messages

## GET
fetchInstituteInfo
- Privacy Notice
- Name
- Offered Documents and Services
- Welcome Message

fetchQueueInfo
- Queue No.
- Counter No.
- Queue Status

fetchQueueLine (to be used for getting number of people in front of the queue)
- Applicant Count
- Approx Time of waiting


## POST
sendMessage
submitForm
submitFeedback
endSession
