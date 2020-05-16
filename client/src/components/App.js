/*
 * @Description:
 * @Version: 1.0
 * @Autor: Tianshi
 * @Date: 2020-05-04 08:42:41
 * @LastEditors: Tianshi
 * @LastEditTime: 2020-05-05 03:29:38
 */
import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Artist from './Artist';
import Display from './Display';
import DisplayPopular from './DisplayPopular';
import Home from './Home'
import SingleImage from './SingleImage';
import WelcomePage from './WelcomePage';
import DisplayTimeline from './DisplayTimeline';
import axios from 'axios'

/*** Font Awesome Icon **/
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab, faHotjar, faGratipay, faTwitter, faFacebook, faInstagram} from '@fortawesome/free-brands-svg-icons'
import { far, faUser, faHeart as farHeart} from '@fortawesome/free-regular-svg-icons'
import { faSearch, faSpinner, faHeart as fasHeart, faEnvelope, faAngleDoubleRight} from '@fortawesome/free-solid-svg-icons'

library.add(fab, faSearch, faSpinner, faHotjar, faGratipay, far, fasHeart, farHeart, faUser,
	faTwitter, faFacebook, faInstagram, faEnvelope, faAngleDoubleRight )


export default class App extends React.Component {

	constructor () {
		super();

		this.state = {
		  loggedInStatus: "NOT_LOGGED_IN",
		  user: '',
		  historyImageIDs: []
		};

		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.handleHistory = this.handleHistory.bind(this);
	}

	handleLogin(data) {

		this.setState({
		  loggedInStatus: "LOGGED_IN",
		  user: data.value
		});

	}

	handleLogout() {

        axios.post('http://localhost:8081/users/history/', {historyImageIDs : this.state.historyImageIDs})
        .then(response => {
            console.log(response);
			this.setState({
				historyImageIDs: []
			});
        }).catch(error => {

		});
		this.setState({
			loggedInStatus: "NOT_LOGGED_IN",
			user: '',
			
		});


	}

	handleHistory(imageID) {
		
		this.setState(prevState => ({
			historyImageIDs: [...prevState.historyImageIDs, imageID]
		}))
		// console.log(this.state.historyImageIDs)
	}

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
						exact
						path={"/"}
						render={props => (
							<Home
							{...props}
							handleLogin={this.handleLogin}
							// handleLogout={this.handleLogout}
							user={this.state.user}
							loggedInStatus={this.state.loggedInStatus}
							/>
						)}
						/>
						<Route
						exact
						path={"/WelcomePage"}
						render={props => (
							<WelcomePage
							{...props}
							handleLogin={this.handleLogin}
							handleLogout={this.handleLogout}
							handleHistory={this.handleHistory}
							user={this.state.user}
							loggedInStatus={this.state.loggedInStatus}
							/>
						)}
						/>

						<Route
						exact
						path={"/display/:key/:value"}
						render={props => (
							<Display
							{...props}
							handleLogout={this.handleLogout}
							handleHistory={this.handleHistory}
							user={this.state.user}
							loggedInStatus={this.state.loggedInStatus}
							/>
						)}
						/>

						<Route
						exact
						path={"/singleimage/:imageID"}
						render={props => (
							<SingleImage
							{...props}
							handleLogout={this.handleLogout}
							handleHistory={this.handleHistory}
							user={this.state.user}
							loggedInStatus={this.state.loggedInStatus}
							/>
						)}
						/>

						<Route
						exact
						path={"/artist/:firstLetter"}
						render={props => (
							<Artist
							{...props}
							handleLogout={this.handleLogout}
							handleHistory={this.handleHistory}
							user={this.state.user}
							loggedInStatus={this.state.loggedInStatus}
							/>
						)}
						/>

						<Route
							path={"/populars/:genre"}
							render={(props) => (
								<DisplayPopular
									{...props}
									handleLogout={this.handleLogout}
									handleHistory={this.handleHistory}
									user={this.state.user}
									loggedInStatus={this.state.loggedInStatus}
								/>
							)}
						/>
						<Route
							path={"/timeline"}
							render={(props) => (
								<DisplayTimeline
									{...props}
									handleLogout={this.handleLogout}
									handleHistory={this.handleHistory}
									user={this.state.user}
									loggedInStatus={this.state.loggedInStatus}
								/>
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}
