import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/WelcomePage.css";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import SideNavbar from './SideNavbar';
import TopNavbar from './TopNavbar';
import Footer from './Footer';

export default class WelcomePage extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component.
    // This component maintains a list of randomly picked paintings
    this.state = {
      randPaintings:[],
      searchContent:[]
    }

    // Any instance method should be binded here
    this.sliding = this.sliding.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {

    this.sliding();

  }


  sliding(){
    var oDiv=document.getElementById('sliding-section');
		var oUl=oDiv.getElementsByTagName('ul')[0];
		var aLi=oUl.getElementsByTagName('li');
		var timer=null;
		var iSpeed=-3;
    var interval = 30;
		oUl.innerHTML+=oUl.innerHTML;
		oUl.style.width=aLi.length*aLi[0].offsetWidth+'px';//定义外层ul的宽度，根据图片的个数和每个图片的宽度计算，保证总宽度是可调整的
		function fnMove(){
			if(oUl.offsetLeft<-oUl.offsetWidth/2){
				oUl.style.left=0;
			}else if(oUl.offsetLeft>0){
				oUl.style.left=-oUl.offsetWidth/2+'px';
			}
			oUl.style.left=oUl.offsetLeft+iSpeed+'px';
		}
		timer=setInterval(fnMove,interval);
		oUl.onmouseover=function(){
			clearInterval(timer);
		}
		oUl.onmouseout=function(){
			timer=setInterval(fnMove,interval);
		}
  }


  render() {

    return (
    <div className="wrapper">

      <SideNavbar userID={this.props.user} imageID={this.props.match.params.imageID}/>

      <div id="main" className="WelcomPage">


        <div className="welcome-section">

          <TopNavbar loggedInStatus={this.props.loggedInStatus} handleLogout={this.props.handleLogout}/>

          <Row className="welcome-row">
            <Col>
              <h1 className="big-heading" id="intro">WELCOME</h1>
            </Col>
          </Row>
          <Button variant ="outline-dark" size= "lg" className="welcome-btn"><i className="fab fa-apple"></i> Search</Button>
          <Button variant="outline-light" size="lg" className="welcome-btn"><i className="fab fa-google-play"></i> Explore</Button>

        </div>


        <div className="sliding-section" id="sliding-section">

          <ul>

            <li><img src="https://www.wga.hu/art/a/aagaard/deerlake.jpg"  alt="" className="sliding-img"/></li>
            <li><img src="https://www.wga.hu/art/g/gogh_van/15/auvers28.jpg"  alt="" className="sliding-img"/></li>
            <li><img src="https://www.wga.hu/art/v/vernet/horace/hunting2.jpg"  alt="" className="sliding-img"/></li>
            <li><img src="https://www.wga.hu/art/g/gogh_van/15/auvers23.jpg"  alt="" className="sliding-img"/></li>

            <div className="clear"></div>
          </ul>

        </div>


        <div className="newsletter">

          <div className="container-fluid">
            <p> Newsletter </p>
            <h3>Find Your True Love for Art Today.</h3>

            <form>
              <label>
                Name:
                <input type="text"  />
              </label>
              <label>
                Email:
                <input type="text" />
              </label>
              <div><input className="submit" type="submit" value="Submit"/></div>
            </form>
          </div>
        </div>


        <Footer />

      </div>

  </div>
    );
  }

}
