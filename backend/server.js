/*
*models:UploadSchema to be set for adding records to mongodb
*routes:upload routes to handle file upload processes
*/
var express = require('express'),
 upload = require('./routes/uploadroutes')
var app = express();
var bodyParser = require('body-parser');
/*
Module:mongoose
mongoose is used to handle requests to mongodb database
*/
var mongoose   = require('mongoose');
/*
Module:multer
multer is middleware used to handle multipart form data
*/
var multer = require('multer');
var multerupload = multer({ dest: 'fileupload/' })
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// allow cross origin requests on server
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var router = express.Router();

// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our upload module apis' });
});
// create a file record (accessed at POST http://localhost:3000/api/fileupload)
router.post('/fileupload',multerupload.single("altflo.zip"),upload.uploadzip);
// lists all file records (accessed at POST http://localhost:3000/api/listfiles)
router.post('/listfiles',upload.listfiles);
// create a zip of requested file records (accessed at POST http://localhost:3000/api/filedownload)
router.post('/filedownload',upload.downloadfiles);
// allows download of requested files in zip (accessed at GET http://localhost:3000/api/fileupload)
router.get('/filedownload',upload.downloadzip);
app.use('/api', router);
var port = process.env.PORT || 3000;
app.listen(port);
console.log("serve listening on port 3000");
