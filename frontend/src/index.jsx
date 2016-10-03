import React from 'react';
import {render} from 'react-dom';
import Upload from './upload.jsx';
import Download from './download.jsx';
/*
Class: Header
Class that manages header part of the page
*/
class Header extends React.Component {
  render() {
    return(
      <div>
        <center>
        <h2>{this.props.title}</h2>
        </center>
      </div>
    )
  }
}

/*
Class: Main
Class that manages main part of the page
*/
class Main extends React.Component {
  /*
  Function: constructor
     Initializes initial state variables.
  Parameters:props
  Returns:Initial state variables
  */
  constructor(props){
    super(props);
    var maincontent=[];
    maincontent.push(
      <Upload indexthis={this}/>
    )
    this.state={
      maincontent,title:"File Upload"
    }
  }
  /*
  Function: switchPage
     Switches page from upload to Download
  Parameters:none
  */
  switchPage(){
    // console.log("switch called");
    var maincontent=[];
    maincontent.push(<Download indexthis={this}/>);
    this.setState({maincontent});
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
        <Header title={this.state.title}/>
        {this.state.maincontent}
      </div>
    )
  }
}


/*
Function: render
   renders main component inside app div
Parameters:none
Returns:Dom of html page
*/
render(<Main/>, document.getElementById('app'));
