var fs=require("fs");
var path = require('path');
/*
Module:AdmZip
AdmZip is used to extract all the files
*/
var AdmZip = require('adm-zip');
/*
Module:node-native-zip
node-native-zip is used to archive files
*/
var zip = require("node-native-zip");
/*
Module:file-encryptor
file-encryptor is used to encrypt and decrypt files
*/
var encryptor = require('file-encryptor');
/*
Module:rmfr
rmfr is used to delete folders recursively
*/

const rmfr = require('rmfr');
/*
Function: walk
   returns array of all files in directory
Parameters:dir,callback fxn
Returns:array of all files in callback
*/
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

// key used for encryption and decryption of files
var key="192920";


/*
Handler Function: uploadzip
   handles all uploading related tasks
Parameters:request and response
Returns:success if all uploading tasks are completed sucessfully
*/
exports.uploadzip = function(req, res) {
   //console.log(req.file);
   var dir="../backend/files";
   //remove previously stored files in folder if any
   rmfr(dir)
   .then(() => {
     //extract all files from zip
     var zip = new AdmZip(req.file.path);
     zip.extractAllTo(/*target path*/dir, /*overwrite*/true);
   }).then(() => {
     /*
     Function: encryptfiles
        encrypts files and returns array of all files in directory
     Parameters:dir,callback fxn
     Returns:array of all files in callback
     */
     function encryptfiles(dir,callback){
       walk(dir,function(err,results){
        if(err){
          console.log("err");
        }
        for(var i=0;i<results.length;i++){
          encryptor.encryptFile(results[i], results[i]+'dat', key, function(err){})
        }
        callback(results);
       })
     }
     //encrypt all files and once callbackis recieved delete unencypted files which are extracted from zip
      encryptfiles(dir, function(fileresults){
        for(var i=0;i<fileresults.length;i++){
          fs.unlink(fileresults[i]);
        }
      });
      res.send({"success":"files Received"});
    })
   .catch(console.error);
};


/*
Handler Function: listfiles
   handles listing files after they are uploaded
Parameters:request and response
Returns:json containing list of all files
*/
exports.listfiles = function(req,res){
    // console.log(req.body);
    var dir=path.resolve(".")+'/files'; // give path
    function listfileresult(dir,callback){
      walk(dir,function(err,results){
        for(var i in results){
        results[i] = results[i].replace(dir+"/","");
        results[i] = results[i].replace("dat","");
        // console.log(results[i]);
        }
        callback(results);
      });
    }

    listfileresult(dir, function(fileresults){
      // console.log(fileresults);
      res.json(fileresults);
    })

}

/*
Handler Function: downloadfiles
   handles all downloading related tasks(create zip of requested files)
Parameters:request and response
Returns:success if all downloading tasks are completed sucessfully
*/

exports.downloadfiles = function(req,res){
  var dir=path.resolve(".")+'/files/'; // give path

  var files = req.body;
  /*
  Function: decryptFiles
    decrypts files and returns array of all files in directory
  Parameters:dir,callback fxn
  Returns:array of all decrypted files in callback
  */

  function decryptFiles(dir,callback){
    var decryptedFilesarray =[];
    for(var i in files){
      var encryptFileName = dir+files[i].path+"dat";
      var decryptFileName = dir+files[i].path;
      encryptor.decryptFile(encryptFileName, decryptFileName, key, function(err) {});
      decryptedFilesarray.push(decryptFileName);
    }
    callback(decryptedFilesarray);
  }
  //directory to store zip files
  var zipdir = path.resolve(".")+'/zipfiles/';

  //archive files once they are decrypted by decryptor
  decryptFiles(dir,function(decryptedFilesarray){
    // console.log("decfiles",decryptedFilesarray);
    var filestoZip=[];
    for(var i in decryptedFilesarray){
      //create array of files in a json required by node-native-zip
      var filename = decryptedFilesarray[i].substring(
                     (decryptedFilesarray[i].lastIndexOf("/")+1),
                     decryptedFilesarray[i].length);
      filestoZip.push(
        {name:filename,path:decryptedFilesarray[i]}
      )
      }
      // console.log(filestoZip);
      //archive all files to single zip
      var archive = new zip();
      archive.addFiles(filestoZip, function (err) {
        if (err) return console.log("err while adding files", err);

        var buff = archive.toBuffer();

        fs.writeFile(zipdir+"reqfiles.zip", buff, function () {
            for(var i in decryptedFilesarray){
              fs.unlink(decryptedFilesarray[i]);
            }
            res.send({"success":"file zipping succesfull"});

        });
    });
  });
}

/*
Handler Function: downloadzip
   allows user to download zip file
Parameters:request and response
Returns:zip containing requested files
*/

exports.downloadzip = function(req,res){
  var dir=path.resolve(".")+'/zipfiles/'; // give path
  var file = dir+"reqfiles.zip";
  res.download(file);
}
