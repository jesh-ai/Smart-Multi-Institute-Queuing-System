## API CONTRACT
Include:
- Endpoint path (POST /chatbot/respond)
- Required request body
- Response format with field types and examples
- Error codes and fallback messages

## Startup
createQueue
createDeviceSessions
createCounterSessions

## GET
fetchQueueServerInfo
- [Queue Table Object](../api_object_templates/queue_data.json)
- Total in Queue
- Next in Line (Queue No.)

fetchDevicesServerInfo
- [Devices Object](../api_object_templates/devices.json)
- Total Connected Devices

fetchDevicesServerInfo
- [Counter Session Object](../api_object_templates/sessions.json)
- Total Active Counters

## POST
disconnectDevice
- pwede ba toh? like ikick sa network/flush session?

createCounterSession
endCounterSession
- Include queue migration if counter still has applicants in line
