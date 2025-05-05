# Reminders & High-Priority Claims Flow

## 1. Architecture Overview

### 1.1 Persistence

* **Users**

  * Adds a `calendar_ics` TEXT column to store raw `.ics` calendar data.
* **Notifications / ClaimNotifications / NotificationRecipients**

  * Store alerts, their subtype data, and who they’re addressed to.

### 1.2 Routes & Endpoints

#### Calendar

* **POST** `/api/calendar/upload-calendar`
  Upload & save an ICS file to the logged-in user’s `calendar_ics`.
* **GET** `/api/calendar/reminders?page=&limit=`
  Parse, filter, sort and paginate upcoming events.

#### Notifications (generic)

* **POST** `/notifications`
  Return a filtered list of notifications (news, policy, claims), based on:

  ```js
  {
    most_recent_first: Boolean,
    filters: {
      sent: Boolean,            // sent vs received
      type?: 'CLAIMS'|'NEWS'|'POLICY',
      read?: Boolean,
      args?: { … }             // e.g. { priority: 'HIGH_PRIORITY' }
    }
  }
  ```
* **POST** `/notifications/:id/mark-read`
  Mark a notification (of any type) as read in the database.

#### Claims-popup shortcut

> Although we reuse the generic `/notifications` list API, the pop-up only needs:
>
> * **List**: POST `/notifications` with
>
>   ```js
>   {
>     most_recent_first: true,
>     filters: {
>       sent: false,
>       type: 'CLAIMS',
>       read: false,
>       args: { priority: 'HIGH_PRIORITY' }
>     }
>   }
>   ```
> * **Dismiss/Open**: POST `/notifications/:id/mark-read`

---

## 2. User Stories

### 2.1 Upload & View Reminders

> **As a busy user**, I want to upload my calendar ICS so I can see only future events.

1. On the **Reminders** page, click **Upload Calendar**, select `.ics`.
2. Frontend ➔ **POST** `/api/calendar/upload-calendar`; server saves raw ICS on the user.
3. Frontend ➔ **GET** `/api/calendar/reminders?page=1&limit=5`.
4. **Controller**:

   * Parses `.ics` with `node-ical`.
   * **Filters** to only events where both `start` and `end` are in the future.
   * **Sorts** ascending by `start`.
   * **Paginates** by `page` & `limit`.
   * **Extracts** any `ATTENDEE` lines into a `members: [...]` array.
5. **UI** renders each `<ReminderItem>` with title, date/time, location, and optional members list.

### 2.2 High-Priority Claim Pop-Ups

> **As a claims manager**, whenever a High-priority claim arrives, I need a toast so I don’t miss it.

1. On login (or when `<ClaimsAlert>` mounts), the component:

   ```js
   axios.post('/notifications', {
     most_recent_first: true,
     filters: {
       sent: false,
       type: 'CLAIMS',
       read: false,
       args: { priority: 'HIGH_PRIORITY' }
     }
   })
   ```
2. **Generic NotificationController.list**:

   * Joins `NotificationRecipients` to filter only those sent to the user.
   * Joins `ClaimNotification` to filter `priority='HIGH_PRIORITY'`.
   * Ensures `Notification.type='claims'` & `isread=false`.
   * Returns `[ { from, to, notification:{ id, title, body, datecreated, args:{ … } } } ]`.
3. **ClaimsAlert** maps that to a queue of `{ id, args }`.
4. Rendering logic:

   * **When** `current===null && queue.length>0`, pop the next item and display.
   * Auto-dismiss after **10 seconds**, or on user clicking **“×”** or **“Open”**.
5. **All dismiss actions** call:

   ```js
   axios.post(`/notifications/${id}/mark-read`)
   ```

   which sets `Notification.isread = true` so it never pops again.

---

## 3. Detailed Endpoint & Controller Mapping

| HTTP | Path                            | Auth? | Controller Method                 | Purpose                                         |
| ---- | ------------------------------- | ----- | --------------------------------- | ----------------------------------------------- |
| POST | `/api/calendar/upload-calendar` | Yes   | `CalendarController.upload`       | Save raw ICS on `User.calendar_ics`.            |
| GET  | `/api/calendar/reminders`       | Yes   | `CalendarController.getReminders` | Parse & return future events, paginated.        |
| POST | `/notifications`                | Yes   | `NotificationController.list`     | Generic listing with type/read/priority filter. |
| POST | `/notifications/:id/mark-read`  | Yes   | `NotificationController.markRead` | Mark a notification as read.                    |

**Claim-Popup Actions**

* **List**: POST `/notifications` (with claim/high-priority filter)
* **Dismiss/Open**: POST `/notifications/:id/mark-read`
* **Note on Dismiss**: The subtle distinction- if you don't open the message from the inbox or click 'x', the message will reappear the next time you login or reload the page since it is still an unread message.

---

## 4. Data Model Highlights

* **User**

  * `username, email, …, calendar_ics: TEXT`
* **Notification**

  * `id, userid → User.username, type, title, body, isread, isarchived, datecreated`
* **ClaimNotification**

  * `notificationid: PK & FK→Notification.id, insuredname, claimantname, tasktype, duedate, lineofbusiness, priority, iscompleted`
* **NotificationRecipient**

  * `notificationid → Notification.id, recipientid → User.username, datesent`

---

## 5. Future-Only Filtering in Reminders

Inside `getReminders` controller:

```js
const parsed = ical.parseICS(user.calendar_ics);
const allEvents = Object.values(parsed)
  .filter(e =>
    e.type === 'VEVENT' &&
    e.start > new Date() &&
    e.end   > new Date()
  )
  .sort((a,b) => new Date(a.start) - new Date(b.start));
```

Only strictly upcoming events (both start and end in the future) are returned.

---

### End-to-End Flow

1. **Upload ICS** → stored → parsed → future-only events appear in list.
2. **List notifications** → filter claims/high-priority → queue pop-ups.
3. **Auto-dismiss/Open/X** → mark-read → never reappear.

