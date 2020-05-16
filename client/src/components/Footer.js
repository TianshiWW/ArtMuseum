import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/WelcomePage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Footer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {

		}
	}

	render() {
		return (
      <div>
        <footer className="footer" id="footer">
          <div className="container-fluid">

            <FontAwesomeIcon className = "footer-icon" icon={['fab', 'twitter']}/>
            <FontAwesomeIcon className = "footer-icon" icon={['fab', 'facebook']}/>
            <FontAwesomeIcon className = "footer-icon" icon={['fab', 'instagram']}/>
            <FontAwesomeIcon className = "footer-icon" icon="envelope" />

            <p>© Copyright 2020</p>
          </div>
        </footer>
      </div>
        );
	}
}
