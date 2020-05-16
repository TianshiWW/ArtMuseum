import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'

import {
    Container, Col, Form,
    FormGroup, Label, Input,
    Button, FormFeedback,
} from 'reactstrap';
import './Signup.css'
import axios from 'axios';





class Signup extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            'email': '',
            'password': '',
            'secondPassword': '',
            'favorite author' : '',
            'favorite gallery' : '',
            validate: {
                emailState: '',
                passwordState: '',
            },

        }
        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.SignupHandler = this.SignupHandler.bind(this);
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

    validatePassword(e) {
        const { validate } = this.state

        if (this.password !== '' && this.secondPassword !== '') {
            if (this.password === this.secondPassword) {
                validate.passwordState = 'Success'
                // return
            } else {
                validate.passwordState = 'Failure'
            }
        } else {
            validate.passwordState = 'Failure'
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

    SignupHandler() {

        axios.post('http://localhost:8081/users/signup/', { email: this.state.email, password: this.state.password })
        .then(response => {
            console.log(response);
 
            if (response.data.status === true) {
                this.props.handleSuccessfulAuth(response.data)
            } else {
                alert("Already Signed Up or Wrong password set");
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
          return <Redirect to='/' />
        }
    }

    render() {
        const { email, password, secondPassword } = this.state;
        return (
            <Container className="Signup">
                <h2>
                    <p className="text-white">
                        Sign Up
                    </p>

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

                                value={password}
                                onChange={(e) => this.handleChange(e)}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="examplePassword">
                                <p className="text-white">
                                    Password Double Check
                                </p>

                            </Label>
                            <Input
                                type="secondPassword"
                                name="secondPassword"
                                id="secondPassword"

                                value={secondPassword}
                                onChange={(e) => 
                                    {
                                        this.validatePassword(e)
                                        this.handleChange(e)
                                    }

                                }
   
                            />
                        </FormGroup>
                    </Col>
                    <Button className = "button"

                        onClick={(e) => {
                            if (this.state.password === '' || this.state.secondPassword === '') {
                                alert("Password Null")
                            } else if (this.state.email === '') {
                                alert("Email Null")
                            }else if (this.state.password === this.state.secondPassword) {
                                if (this.state.validate.emailState === 'has-success') {
                                    this.SignupHandler()
                                } else {
                                    alert("Email Not valid")
                                }
                                
                            } else {
                                alert("Invalid Password")
                            }
                        }}>
                        Signup
                    </Button>
                </Form>
                
            </Container>
        );
    }
}

export default Signup;
