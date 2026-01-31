const sendNotification = (req, userId, payload) => {
  const io = req.app.get("io");
  io.to(userId.toString()).emit("notification", payload);
};

module.exports = sendNotification;
