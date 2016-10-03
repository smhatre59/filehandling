/*
Class: Download
Class that manages Download part of the page
*/
import React from 'react';
import {render} from 'react-dom';
var request = require('superagent');
/*
The base url for accessing apis on server
*/
var apiBaseUrl = "http://localhost:3000/api"

export default class Download extends React.Component {
  /*
  Function: constructor
     Initializes initial state variables.
  Parameters:props
  Returns:Initial state variables
  */
  constructor(props){
    super(props);
    var tablebody=[];
    tablebody.push(
      <tr>
        <td>Loading Files...</td>
        <td>Please wait</td>
      </tr>
    );
    this.props.indexthis.setState({"title":"File Download"});
    this.state={
      tablebody:tablebody,
      checkedarray:[]
    }
  }
  /*
  Function: componentDidMount
     Handles ajax requests after first render of the page
  Parameters:none
  */
  componentDidMount(){
    var payload={
      "foldername":""
    }
    var checked=false;
    var self = this;
    //request to get list of uploaded files from server
    request
    .post(apiBaseUrl+'/listfiles')
    .send(payload)
    .end(function(err, res){
      if(err)
      console.log(err);

      var tablebody=[];
      //console.log(res.body);
      var filetree = res.body;
      for(var i=0;i<res.body.length;i++){
          // var filetree = res.body[i].split("/");
          // console.log(filetree);
          tablebody.push(
            <tr>
              <td>{res.body[i]}</td>
              <td><input type="checkbox" value={i} onChange={(event)=> self.handleCheck(event)}/></td>
            </tr>
          )
      }
      self.setState({tablebody,filetree});
    });
  }
  /*
  Function: handleCheck
     Initializes checked with files selected for download
  Parameters:event
  */
  handleCheck(event){
    Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
    };
    if(event.target.checked ==true)
      this.state.checkedarray.push(event.target.value);
    else{
      this.state.checkedarray.remove(event.target.value);
    }
    // console.log(this.state.checkedarray);
  }
  /*
  Function: handleCheck
     Makes ajax call to get requested files as zip from server
  Parameters:none
  */
  handleDownload(){
    var payload=[];
    var self = this;
    for(var i =0;i<this.state.checkedarray.length;i++){
      console.log(self.state.checkedarray[i],self.state.filetree[self.state.checkedarray[i]]);
      payload.push(
        {"path":self.state.filetree[self.state.checkedarray[i]]}
      )
    }
    // console.log("download called",payload);
    request
    .post(apiBaseUrl+'/filedownload')
    .send(payload)
    .end(function(err, res){
        // Do something
        if(err){
          console.log(err);
        }
          // console.log("some res",res);
          //if result is sucessfull prompt download of zip file
          window.location.replace("http://localhost:3000/api/filedownload");

    });
  }
  /*
  Function: render
     main render function
  Parameters:none
  Returns:Dom of html page
  */
  render() {
    return(
      <div>
        <center>
        <table>
          <tbody>
            <tr>
              <td>File Name</td>
              <td>Download</td>
            </tr>
            {this.state.tablebody}
          </tbody>
        </table>
        <button onClick={() => this.handleDownload()}>File download</button>
        </center>
      </div>
    )
  }
}
