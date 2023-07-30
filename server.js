'use strict';

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const PORT = +process.env.PORT;
const HOST = '0.0.0.0';
const args = process.argv;
const env = args.find((arg) => {
  return ['local', 'dev', 'sat', 'prod'].find((environment)=> arg === environment)
});

const { google } = require("googleapis");

const GOOGLE_PRIVATE_KEY = process.env.private_key.split(String.raw`\n`).join('\n');
const GOOGLE_CLIENT_EMAIL = process.env.client_email;
const GOOGLE_PROJECT_NUMBER = process.env.project_number;
const GOOGLE_CALENDAR_ID = process.env.calendar_id;

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY,
    SCOPES
);

const calendar = google.calendar({
  version: "v3",
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
});

const addCalendarEvent = async () => {
  return await calendar.events.insert({
    // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
    calendarId: GOOGLE_CALENDAR_ID,

    // Request body metadata
    requestBody: {
      summary: "Test Event added by Node.js",
      description: "This event was created by Node.js",
      start: {
        dateTime: "2023-08-03T09:00:00-02:00",
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: "2023-08-04T17:00:00-02:00",
        timeZone: "Asia/Kolkata",
      },
      attendees: [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
      // request body parameters
      // {
      //   "anyoneCanAddSelf": false,
      //   "attachments": [],
      //   "attendees": [],
      //   "attendeesOmitted": false,
      //   "colorId": "my_colorId",
      //   "conferenceData": {},
      //   "created": "my_created",
      //   "creator": {},
      //   "description": "my_description",
      //   "end": {},
      //   "endTimeUnspecified": false,
      //   "etag": "my_etag",
      //   "eventType": "my_eventType",
      //   "extendedProperties": {},
      //   "gadget": {},
      //   "guestsCanInviteOthers": false,
      //   "guestsCanModify": false,
      //   "guestsCanSeeOtherGuests": false,
      //   "hangoutLink": "my_hangoutLink",
      //   "htmlLink": "my_htmlLink",
      //   "iCalUID": "my_iCalUID",
      //   "id": "my_id",
      //   "kind": "my_kind",
      //   "location": "my_location",
      //   "locked": false,
      //   "organizer": {},
      //   "originalStartTime": {},
      //   "privateCopy": false,
      //   "recurrence": [],
      //   "recurringEventId": "my_recurringEventId",
      //   "reminders": {},
      //   "sequence": 0,
      //   "source": {},
      //   "start": {},
      //   "status": "my_status",
      //   "summary": "my_summary",
      //   "transparency": "my_transparency",
      //   "updated": "my_updated",
      //   "visibility": "my_visibility"
      // }
    },
  });
};

const listCalendarEvents = async () => {
  return await calendar.events.list({
    calendarId: GOOGLE_CALENDAR_ID,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
};


if (!env) {
  console.log("Environment not detected, please run again with either 'dev', 'sat', or 'prod'.");
  process.exit();
}

const app = express();
app.get('/events/list', cors(), async (request, response) => {
  const events = await listCalendarEvents();

  if (events.data.items.length > 0) {
    console.log("List of upcoming events: ", events.data.items); // If there are events, print them out
  } else {
    console.log("No upcoming events found."); // If no events are found
  }

  response.send(events.data.items);
});

app.get('/events/create', cors(), async (request, response) => {
  const events = await addCalendarEvent();
  console.log(events);
  response.send(`Event saved!`);
});

app.disable('x-powered-by');

app.listen(PORT, HOST, 0);
console.log(`Running on https://${HOST}:${PORT}`);