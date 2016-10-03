/*
Class: Upload
Class that manages uploading part of the page
*/
import React from 'react';
import {render} from 'react-dom';
/*
Module:Dropzone
Dropzone is used to allow user to drag and drop files in specific area
Handler funcion:onDrop
onDrop is triggered each time files is uploaded on browser
*/
var Dropzone = require('react-dropzone');
/*
Module:superagent
superagent is used to handle post/get requests to server
*/
var request = require('superagent');
/*
The base url for accessing apis on server
*/
var apiBaseUrl = "http://localhost:3000/api"

export default class Upload extends React.Component {
  /*
  Function: constructor
     Initializes initial state variables.
  Parameters:props
  Returns:Initial state variables
  */
  constructor(props){
    super(props);
    this.state={
      files:[],
      buttontitle:"Upload to server"
    }
  }
  /*
  Function: onDrop
     callback fxn for Dropzone
  Parameters:files
  Returns:Array of files in state variables
  */
  onDrop(files){
    console.log('Received files: ', files);
    this.setState({
        files: files
      });
  }
  /*
  Function: handleUpload
     callback fxn for upload button click
  Parameters:none
  Returns:Sucess or error data based on file upload success or failure
  */
  handleUpload(){
    var self= this;
    if(this.state.files.length > 0){
      var files = this.state.files;
      this.setState({buttontitle:"Uploading...."})
      var req = request.post(apiBaseUrl+'/fileupload');
        files.forEach((file)=> {
          // console.log("upload clicked",file.name);
            req.attach(file.name, file);
        });
        req.end(function(err,res){
          if(err){
            console.log("error ocurred");
          }
          console.log("res",res);
          self.props.indexthis.switchPage();
        });
    }
    else{
      alert("Please upload some files first");
      this.setState({buttontitle:"Upload to server"});
    }
  }
  /*
  Function: render
     main render function
  Parameters:none
  Returns:Dom of html page
  */
  render () {
    return (
      <div>
      <center>
        <div className="flexdiv">
          <div>
              <Dropzone onDrop={(files) => this.onDrop(files)}>
                <div>Try dropping some files here, or click to select files to upload.</div>
              </Dropzone>
          </div>
          <div>
              {this.state.files.length > 0 ?
                  <div>
                    {this.state.files.map((file) =>
                      <div>
                        <h6>
                          {file.name}
                        </h6>
                      </div>
                    )}
                  </div>
                  :
                  <div>No files selected</div>
                }
          </div>
        </div>
        <div>
          <button onClick={() => this.handleUpload()}>{this.state.buttontitle}</button>
        </div>
      </center>
      </div>
    );
  }
}
