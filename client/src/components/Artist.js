import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/Artist.css";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Image} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import SideNavbar from './SideNavbar';
import TopNavbar from './TopNavbar';
import Footer from './Footer';

export default class Artist extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component.
    // This component maintains a list of randomly picked paintings
    this.state = {
      imagesColumn:[],
      currentLetter:""
    }

    // Any instance method should be binded here
    this.createImageCols = this.createImageCols.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/artists/"+this.props.match.params.firstLetter,
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      console.log(res);
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(artistList => {
      if (!artistList) return;
      this.createImageCols(artistList);
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });

  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.match.params.firstLetter !== prevProps.match.params.firstLetter) {
      fetch("http://localhost:8081/artists/"+this.props.match.params.firstLetter,
      {
        method: 'GET' // The type of HTTP request.
      }).then(res => {
        // Convert the response data to a JSON.
        return res.json();
      }, err => {
        // Print the error if there is one.
        console.log(err);
      }).then(artistList => {
        if (!artistList) return;
        this.createImageCols(artistList);

      }, err => {
        // Print the error if there is one.
        console.log(err);
      });
    }
  }

  createImageCols(artistList){
    // Map each UrlObj in UrlList to an HTML element:
    var background = {backgroundSize : 'cover'};

    let artistsDiv = artistList.map((artistObj, i) =>
    <div className="img-wrap">
      <div className="img-text"><h3>{artistObj.full_name}</h3></div>
    <Row className="img-hover"><Link to={"/display/AUTHOR_ID/" + artistObj.ID}><Image style={background} responsive key={i} src={artistObj.IMAGE_SOURCE} alt=""></Image></Link></Row>

    </div>
    );

    var imageCols = [];
    for (var i = 0; i < 4; i++) {
      var imageCol = [];
      var colLength = Math.floor(artistsDiv.length / 4);
      for (var index = i*colLength; index < i*colLength+colLength; index++) {
        imageCol.push(artistsDiv[index]);
      }
      var colDiv = <div className="column-4"> {imageCol} </div>
      imageCols.push(colDiv)
    }

    // Set the state of the genres list to the value returned by the HTTP response from the server.
    this.setState({
      imagesColumn: imageCols,
      firstLetter: this.props.match.params.firstLetter
    });
  }

  render() {

    return (
    <div className="wrapper">

      <SideNavbar userID={this.props.user} imageID={this.props.match.params.imageID}/>


      <div id="main">

        <TopNavbar loggedInStatus={this.props.loggedInStatus} handleLogout={this.props.handleLogout}/>

        <div className="intro">

          <Row>
            <Col>
              <h1 className="search-key" id="intro">ARTIST</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2 className="search-value" id="intro">{this.state.firstLetter}</h2>
            </Col>
          </Row>

        </div>

        <div className="images-grid">
          {this.state.imagesColumn}
        </div>


        <Footer />

      </div>

    </div>

    );
  }

}
