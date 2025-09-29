Applicant handles the web app used by the applicants to enter the queue
Running this on a device turns it into an applicant in the network

[Backend README](../server/backend/APPLICANT_README.md)
- API Contract

To do:
1. Create testing Institution JSON from Data Gathered
2. Flowchart the requested APIs in the API Contract
3. Create API and API Contract entry for responding to chat messages:
  a. retrieve and parse an Institution JSON containing starting info.
  b. create responses for closed-ended messages.


[Frontend README](frontend/README.md)
- Data Requirements

To do: 
1. Create Data Requirements (Name, Format), List it here
2. Add actual Privacy Notice, only allow to check the box when done scrolling
Chatbot Interface
3. Options on the screen not below the textfield when keyboard is not open (figma messaging home)
4. Create dynamic chat interface handling the following scenarios:
    - next question is waiting closed-ended response (should be able to parse question choices as selectable buttons)
    - next question is waiting open-ended response (should not have choices when keyboard is opened, all other previous open-ended buttons are removed)
    // simulate this by using custom json inputs/console log, after achieving the ideal format write the Data Requirement 

