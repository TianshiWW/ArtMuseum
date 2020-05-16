import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/Display.css";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';

import SideNavbar from './SideNavbar';
import TopNavbar from './TopNavbar';
import Footer from './Footer';

export default class Display extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component.
    // This component maintains a list of randomly picked paintings
    this.state = {
      imagesFirstColumn: [],
      imagesSecondColumn: [],
      currentKey: "",
      currentValue: ""
    }

    // Any instance method should be binded here
    this.createImageCols = this.createImageCols.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/images/" + this.props.match.params.key + "/" + this.props.match.params.value,
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

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if ((this.props.match.params.key !== prevProps.match.params.key) || (this.props.match.params.value !== prevProps.match.params.value)) {
      fetch("http://localhost:8081/images/" + this.props.match.params.key + "/" + this.props.match.params.value,
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
  }

  createImageCols(imageList) {
    // Map each UrlObj in UrlList to an HTML element:
    let imagesDiv = imageList.map((imgObj, i) =>
      <div className="img-container"><Link to={"/singleimage/" + imgObj.ID}><img key={i} src={imgObj.IMAGE_SOURCE} alt="" /></Link></div>
    );
    var imagesCol1 = [];
    for (var index = 0; index < imagesDiv.length / 2; index++) {
      imagesCol1.push(imagesDiv[index]);
    }
    var imagesCol2 = [];

    for (index = Math.floor(imagesDiv.length / 2); index < imagesDiv.length; index++) {
      imagesCol2.push(imagesDiv[index]);
    }

    // Set the state of the genres list to the value returned by the HTTP response from the server.
    this.setState({
      imagesFirstColumn: imagesCol1,
      imagesSecondColumn: imagesCol2,
      currentKey: this.props.match.params.key,
      currentValue: this.props.match.params.value
    });
  }

  render() {

    return (
      <div className="wrapper">

        <SideNavbar userID={this.props.user} imageID={this.props.match.params.imageID} />


        <div id="main">

          <TopNavbar loggedInStatus={this.props.loggedInStatus} handleLogout={this.props.handleLogout} />

          <div className="intro">

            <Row>
              <Col>
                <h1 className="search-key" id="intro">{this.state.currentKey}</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2 className="search-value" id="intro">{this.state.currentValue}</h2>
              </Col>
            </Row>

          </div>

          <div className="images-grid">
            <div className="column">
              {this.state.imagesFirstColumn}
            </div>
            <div className="column">
              {this.state.imagesSecondColumn}
            </div>
          </div>


          <Footer />

        </div>

      </div>

    );
  }

}
