// Create Token and saving in cookie

const sendData = (user=[], statusCode, res) => {
  res.status(statusCode).json({
    success: true,
    user,
  });
};

export default sendData;
