const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        let folder = path.join(__dirname, '../../public/images/products');
        cb(null, folder);
    },
    filename: (req,file,cb) => {
        let fileName = Date.now() + '_product' + path.extname(file.originalname);
        cb(null, fileName);
    }
});

const uploadFile = multer({storage});

module.exports = uploadFile;