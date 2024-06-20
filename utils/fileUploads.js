const multer = require('multer');
const path = require('path');

// Set storage
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Upload
const upload = multer({
  storage,
  limits: { fileSize: 4000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

// Check file types
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: You can only upload image files'));
  }
}

module.exports = upload;
