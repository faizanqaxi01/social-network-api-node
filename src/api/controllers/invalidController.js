// Controller Actions
module.exports.badRequest = (req, res) => {
  res.status(400);
  res.send('status: 400, Bad request');
};
