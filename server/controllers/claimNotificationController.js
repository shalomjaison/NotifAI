// server/controllers/claimNotificationController.js
const Notification          = require('../models/notificationModel');
const ClaimNotification     = require('../models/claimModel');
const NotificationRecipient = require('../models/notificationRecipientModel');

exports.getHighPriorityClaims = async (req, res) => {
  try {
    const username = req.session.user.username;
    console.log('🏓 GET /notifications/claims/high-priority for', username);

    // 1) Find all HIGH_PRIORITY ClaimNotifications
    //    that belong to an unread claims Notification sent to this user
    const rows = await ClaimNotification.findAll({
      where: { priority: 'HIGH_PRIORITY' },
      include: [
        {
          model:    Notification,
          where:    { type: 'claims', isread: false },
          include: [
            {
              model:    NotificationRecipient,
              where:    { recipientid: username },
              attributes: []
            }
          ]
        }
      ],
      order: [[ Notification, 'datecreated', 'ASC' ]]
    });

    console.log('🔍 found', rows.length, 'high‐priority rows');

    const payload = rows.map(c => ({
      id:   c.notificationid,   // ← this is the Notification id
      args: c.get({ plain: true })
    }));

    return res.json(payload);
  } catch (err) {
    console.error('Error in getHighPriorityClaims:', err);
    return res.status(500).json({ error: 'Fetch failed' });
  }
};

exports.markClaimRead = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📩 mark‐read called for notification', id, 'by', req.session.user.username);

    const [updated] = await Notification.update(
      { isread: true },
      { where: { id } }    // ← mark the Notification as read
    );
    console.log('🔄 markClaimRead updated rows:', updated);

    if (updated === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.sendStatus(204);
  } catch (err) {
    console.error('Error in markClaimRead:', err);
    return res.status(500).json({ error: 'Mark‐read failed' });
  }
};
