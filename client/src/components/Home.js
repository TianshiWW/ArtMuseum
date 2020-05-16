/*
 * @Description:
 * @Version: 1.0
 * @Autor: Tianshi
 * @Date: 2020-05-04 03:49:53
 * @LastEditors: Tianshi
 * @LastEditTime: 2020-05-04 05:16:05
 */
import React, { Component } from "react";
import {
    Container,
} from 'reactstrap';
import SignUp from './Auth/Signup'
import Login from './Auth/Login'
import "../style/Home.css"

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
        // this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }
    handleSuccessfulAuth(data) {
        this.props.handleLogin(data);
        this.props.history.push("/welcomepage");
    }

    render() {
        return (
            <Container className="Home">
            <div>
                <h2>
                    <p className="text-white">
                        HWANG ART GALLERY HOME
                    </p>

                </h2>

                <Login handleSuccessfulAuth = {this.handleSuccessfulAuth}/>
                <SignUp handleSuccessfulAuth = {this.handleSuccessfulAuth}/>

            </div>



            </Container>


        );
    }
}
