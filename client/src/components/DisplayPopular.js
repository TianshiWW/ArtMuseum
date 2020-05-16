/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Tianshi
 * @Date: 2020-05-05 00:30:50
 * @LastEditors: Tianshi
 * @LastEditTime: 2020-05-05 02:08:36
 */
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/SingleImage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SideNavbar from './SideNavbar';
import TopNavbar from './TopNavbar';
import Footer from './Footer';
import SingleImageInfo from './SingleImageInfo'

export default class DisplayPopular extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component.
    // This component maintains a list of randomly picked paintings
    this.state = {
        imageDivs:[]
    }

    // Any instance method should be binded here
    this.fetchImages = this.fetchImages.bind(this);
  }

  componentDidMount() {
    this.fetchImages();
  }


  componentDidUpdate(prevProps) {
    if (this.props.match.params.genre !== prevProps.match.params.genre) {
      this.fetchImages();
    }
  }

  fetchImages() {
    fetch("http://localhost:8081/populars/"+this.props.match.params.genre,
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(imageInfoArr => {
      if (!imageInfoArr) return;

      let imageDivs = imageInfoArr.map((imgInfo, i) =>
      <SingleImageInfo loggedInStatus={this.props.loggedInStatus} userID={this.props.user} imageID={this.props.match.params.imageID}
        source={imgInfo.IMAGE_SOURCE} title={imgInfo.TITLE} size={imgInfo.SIZES} start={imgInfo.TIMELINE_START}
        artist={imgInfo.AUTHOR} date={imgInfo.CREATED_TIME} technique={imgInfo.TECHNIQUE} type={imgInfo.TYPE}
        form={imgInfo.FORM} school={imgInfo.SCHOOL} location={imgInfo.LOCATION} description={imgInfo.DESCRIPTION}/>
      );

      this.setState({
        imageDivs:imageDivs
      });

    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }

  toggleLike(){
    var icon = this.state.likeState ? <FontAwesomeIcon icon={['far', 'heart']} /> : <FontAwesomeIcon icon="heart" />;
    this.setState ({
      likeIcon: icon,
      likeState: !this.state.likeState
    });
  }

  render() {

    return (
    <div>

      <SideNavbar userID={this.props.user} imageID={this.props.match.params.imageID}/>


      <div id="main">

      <TopNavbar loggedInStatus={this.props.loggedInStatus} handleLogout={this.props.handleLogout}/>

        {this.state.imageDivs}

        <Footer />

      </div>

    </div>

    );
  }

}
