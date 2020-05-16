import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/DisplayTimeline.css";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';

import SideNavbar from './SideNavbar';
import TopNavbar from './TopNavbar';
import Footer from './Footer';

export default class DisplayTimeline extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component.
    // This component maintains a list of randomly picked paintings
    this.state = {
      imageDivs: []
    }

    // Any instance method should be binded here
    this.createImageCols = this.createImageCols.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/timeline",
      {
        method: 'GET' // The type of HTTP request.
      }).then(res => {
        // Convert the response data to a JSON.
        console.log(res);
        return res.json();
      }, err => {
        // Print the error if there is one.
        console.log(err);
      }).then(imageList => {
        if (!imageList) return;
        this.createImageCols(imageList);
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });

  }


  createImageCols(imageList) {
    // Map each UrlObj in UrlList to an HTML element:
    let imagesDiv = imageList.map((imgObj, i) =>

    <Row className="img-row justify-content-md-center ">
      <Row className="time-div">
        <Col className=" align-self-center time-text"><h1>{imgObj.timeline_start}</h1></Col>
      </Row>
      <Row>
        <Col className="img-col">
          <Link to={"/singleimage/"+ imgObj.form_image_id}><img key={i} src={imgObj.form_image_source} alt=""/></Link>
          <div className="img-overlay-text">{imgObj.form}</div>
        </Col>
        <Col className="img-col">
          <Link to={"/singleimage/"+ imgObj.type_image_id}><img key={i} src={imgObj.type_image_source} alt=""/></Link>
          <div className="img-overlay-text">{imgObj.type}</div>
        </Col>
        <Col className="img-col">
          <Link to={"/singleimage/"+ imgObj.school_image_id}><img key={i} src={imgObj.school_image_source} alt=""/></Link>
          <div className="img-overlay-text">{imgObj.school}</div>
        </Col>
       </Row>
      </Row>
    );

    // Set the state of the genres list to the value returned by the HTTP response from the server.
    this.setState({
      imageDivs: imagesDiv
    });
  }

  render() {

    return (
      <div className="wrapper">

        <SideNavbar userID={this.props.user} imageID={this.props.match.params.imageID} />


        <div id="main">

          <TopNavbar loggedInStatus={this.props.loggedInStatus} handleLogout={this.props.handleLogout} />

          <div className="intro">
            <h1 id="intro">How they CHANGED</h1>
          </div>


        <div className="img-row-container">
          <Row>
            <Col><h3>Form</h3></Col>
          <Col><h3>Type</h3></Col>
        <Col><h3>School</h3></Col>
          </Row>
          {this.state.imageDivs}
        </div>


          <Footer />

        </div>

      </div>

    );
  }

}
