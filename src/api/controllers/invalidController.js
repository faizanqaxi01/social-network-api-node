// Controller Actions
module.exports.badRequest = (req, res) => {
  res.status(400);
  res.send('status: 400, Bad request');
};

module.exports.invalidURL = (req, res) => {
  res.status(404).send('status: 404, Page not found');
};
