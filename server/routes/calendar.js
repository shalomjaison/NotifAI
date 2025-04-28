const express = require('express');
const multer  = require('multer');
const fs      = require('fs');
const ical    = require('node-ical');
const router  = express.Router();

const User    = require('../models/userModel');
const upload  = multer({ dest: 'uploads/' });

/**
 * Middleware: ensure user is logged in
 */
function requireLogin(req, res, next) {
    if (!req.session?.user) {
      console.warn('⚠️ User is not logged in');
      return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
  }

router.post('/upload-calendar', requireLogin,upload.single('calendar'), async (req, res) => {
  try {
    console.log(' Session user before upload:', req.session.user);

    const rawData = fs.readFileSync(req.file.path, 'utf-8');
    console.log('Uploaded .ics content (first 300 chars):\n', rawData.slice(0,300));

    // update by username
    const [updatedCount] = await User.update(
      { calendar_ics: rawData },
      { where: { username: req.session.user.username } }
    );
    console.log('Rows updated:', updatedCount);

    fs.unlinkSync(req.file.path);
    return res.send('Calendar uploaded');
  } catch (err) {
    console.error(' Upload failed:', err);
    return res.status(500).send('Upload error');
  }
});

router.get('/reminders',requireLogin, async (req, res) => {
  try {
    console.log('Session user on /reminders:', req.session.user);

    // find by username
    const user = await User.findOne({
      where: { username: req.session.user.username }
    });

    if (!user?.calendar_ics) {
      console.warn('No calendar data found for user');
      return res.json({ events: [], page: 1, total: 0, totalPages: 0 });
    }

    const { page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    const parsed = ical.parseICS(user.calendar_ics);
    const allEvents = Object.values(parsed)
      .filter(e => e.type === 'VEVENT' && e.start > new Date() && e.end > new Date())
      .sort((a,b) => new Date(a.start) - new Date(b.start));

    console.log(`Parsed ${allEvents.length} future events`);

    const slice = allEvents
    .slice(offset, offset + Number(limit))
      .map(e => {
              const ev = {
                summary:  e.summary,
                start:    e.start,
                end:      e.end,
                location: e.location || ''
              };
          
              // optionally add members if there are ATTENDEE lines
              const raw = e.attendee || e.attendeeList;
              if (raw) {
                const list = Array.isArray(raw) ? raw : [raw];
                ev.members = list.map(a => typeof a === 'string' ? a : a.val);
              }
              return ev;
            });

    return res.json({
      events:     slice,
      page:       +page,
      total:      allEvents.length,
      totalPages: Math.ceil(allEvents.length / +limit),
    });
  } catch (err) {
    console.error(' Calendar parse error:', err);
    return res.status(500).send('Failed to load reminders');
  }
});

module.exports = router;
