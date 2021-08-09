const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets/images')
  },
  filename: function (req, file, cb) {
    const fileExtension = (file.originalname.match(/\.+[\S]+$/) || [])[0];
    cb(null, file.fieldname + '-' + Date.now() + fileExtension)
  }
})

module.exports = multer({storage: storage});
