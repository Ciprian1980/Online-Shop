import multer from 'multer';
import express from 'express';
import { isAuth } from '../../utils.js';

const uploadRouter = express.Router();

const storage = multer.diskStorage({ //storage for images
    destination(req, file, cb) {
        cb(null, 'uploads/')
    }, 
//saving file in upload folder and set file name to the timestamp.
    filename(req, file, cb) {
        cb(null, `${Date.now()}.jpg`);
    }
});
const upload = multer({storage});

uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
    res.send(`${req.file.path}`);
})

export default uploadRouter