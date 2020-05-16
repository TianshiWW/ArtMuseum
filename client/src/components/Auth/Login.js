import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import {
    Container, Col, Form,
    FormGroup, Label, Input,
    Button, FormFeedback,
} from 'reactstrap';
import './Login.css';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'email': '',
            'password': '',
            validate: {
                emailState: '',
            },
            pushToSignupPage : false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.loginHandler = this.loginHandler.bind(this);
    }

    validateEmail(e) {
        const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const { validate } = this.state
        if (emailRex.test(e.target.value)) {
            validate.emailState = 'has-success'
        } else {
            validate.emailState = 'has-danger'
        }
        this.setState({ validate })
    }

    handleChange = async (event) => {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        await this.setState({
            [name]: value,
        });
    }

    loginHandler() {

        axios.post('http://localhost:8081/users/login/', { email: this.state.email, password: this.state.password })
        .then(response => {
            console.log(response);
            // console.log(response.data.value);
            if (response.data.status === true) {
                this.props.handleSuccessfulAuth(response.data)
            } else {
                alert("Fail to loggin");
            }
            
        }).catch(error => {

        });

    }

    submitForm(e) {
        alert('A name was submitted: ' + this.state.email);
        e.preventDefault();
        console.log(`Email: ${this.state.email}`)
    }

    setRedirectToSign = () => {
        this.setState({
            pushToSignupPage: true
        })
      }

    renderRedirectToSign = () => {
        if (this.state.pushToSignupPage) {
          return <Redirect to='/WelcomePage' />
        }
    }

    render() {
        const { email, password } = this.state;
        return (
            <Container className="Login">
                <h2>
                    <p className="text-white">
                        Sign in
                    </p>
                    <Button onClick={this.setRedirectToSign} color="primary" >Try for free!</Button>
                    {this.renderRedirectToSign()}
                </h2>

                <Form className="form" onSubmit={(e) => this.submitForm(e)}>
                    <Col>
                        <FormGroup>
                            <Label>
                                <p className="text-white">
                                    Your email
                                </p>
                            </Label>
                            <Input
                                type="email"
                                name="email"
                                id="exampleEmail"
                                placeholder="myemail@email.com"
                                value={email}
                                valid={this.state.validate.emailState === 'has-success'}
                                invalid={this.state.validate.emailState === 'has-danger'}
                                onChange={(e) => {
                                    this.validateEmail(e)
                                    this.handleChange(e)
                                }}
                            />

                            <FormFeedback>
                                Please check your email.
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="examplePassword">
                                <p className="text-white">
                                    Password
                                </p>

                            </Label>
                            <Input
                                type="password"
                                name="password"
                                id="examplePassword"
                                placeholder="********"
                                value={password}
                                onChange={(e) => this.handleChange(e)}
                            />
                        </FormGroup>
                    </Col>
                    <Button className = "button"
                        onClick={(e) => {
                            this.loginHandler()
                        }}>
                        Login
                    </Button>
                </Form>
                
            </Container>
        );
    }
}

export default Login;

