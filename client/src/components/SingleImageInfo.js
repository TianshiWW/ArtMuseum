/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Tianshi
 * @Date: 2020-05-04 18:49:17
 * @LastEditors: Tianshi
 * @LastEditTime: 2020-05-04 20:38:35
 */
import React from 'react';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/SingleImage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios"

export default class SingleImageInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likeState: false,
      likeIcon: <FontAwesomeIcon icon={['far', 'heart']} />
    }
    this.toggleLike = this.toggleLike.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
    
  }

  // React function that is called when the page load.
  componentDidMount() {

    
    this.checkStatus();

  }

  toggleLike() {
    
    if (this.props.loggedInStatus !== "LOGGED_IN") {

      alert("Please login before star an image")
    } else {
      if (this.state.likeState === true) {
        axios.post('http://localhost:8081/users/unlike/', { userID: this.props.userID, imageID: this.props.imageID })
        .then(response => {
          console.log(response);

          if (response.data.status === true) {
            console.log("Unlike success")
            var icon = <FontAwesomeIcon icon={['far', 'heart']} />
            
            this.setState({
              likeIcon: icon,
              likeState: false
            });
            this.props.history.push('/homepage');
            return
            
          } else {
            alert("Failure to unstar");
          }

        }).catch(error => {

        });


      } else {
        axios.post('http://localhost:8081/users/collect/', { userID: this.props.userID, imageID: this.props.imageID })
        .then(response => {
          console.log(response);

          if (response.data.status === true) {
            console.log("Like success")
            var icon = <FontAwesomeIcon icon="heart" />;
            this.setState({
              likeIcon: icon,
              likeState: true
            });
            this.props.history.push('/homepage');
            return
          } else {
            alert("Failure to star");
          }

        }).catch(error => {

        });
      }
     
    }

  }

  checkStatus() {
    
    if (this.props.loggedInStatus === "LOGGED_IN") {
      
      axios.post('http://localhost:8081/users/getStarStatus/', { userID: this.props.userID, imageID: this.props.imageID }) 
      .then(response => {
        console.log(response);
        if (response.data.status === true) {
          var icon = <FontAwesomeIcon icon="heart" />;
          this.setState({
            likeIcon: icon,
            likeState: true
          });

        } else {
          icon = <FontAwesomeIcon icon={['far', 'heart']} />
          this.setState({
            likeIcon: icon,
            likeState: false
          });
        }

      }).catch(error => {

      });
    }
  }



  render() {
    return (
      <div className="img-info-section">

        <div className="img-section">
          <div className="img-container">
            <img src={this.props.source} alt="" />
          </div>
        </div>

        <div className="info-section">

          <div>TITLE:{this.props.title} </div>
          <div>SIZE: {this.props.size}</div>
          <div>ARTIST: {this.props.artist}</div>
					<div>CREATED AT: <Link to={"/display/TIMELINE_START/"+this.props.start}>{this.props.date}</Link> </div>
          <div>TECHNIQUE: {this.props.technique}</div>
					<div>TYPE: <Link to={"/display/TYPE/"+this.props.type}>{this.props.type}</Link> </div>
					<div>FORM: <Link to={"/display/FORM/"+this.props.form}>{this.props.form}</Link> </div>
					<div>SCHOOL: <Link to={"/display/SCHOOL/"+this.props.school}>{this.props.school}</Link></div>
          <div>NOW AT: {this.props.location}</div>
          <div>{this.props.description}</div>
          <div><button onClick={this.toggleLike}>{this.state.likeIcon}</button></div>

        </div>

      </div>

    );
  }
}
