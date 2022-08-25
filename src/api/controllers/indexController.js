module.exports.index_get = (req, res) => {
  console.log('Get request on /');
  res.status(200).json({ msg: 'Server running' });
};
