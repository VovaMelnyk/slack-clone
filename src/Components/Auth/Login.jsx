import React, { Component } from 'react';
import firebase from '../../firebase';
import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon
  } from 'semantic-ui-react';
  import {NavLink} from 'react-router-dom'
  class Login extends Component {
  
    state = {
      email: '',
      password: '',
      errors: [],
      loading: true,
    }

  
    handlerChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      })
    }

    isFormValid = ({email, password}) => email && password;
  
    handleSubmit = e => {
      e.preventDefault();
      if (this.isFormValid(this.state)) {
          firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(signedInUser => {
              console.log(signedInUser);
          })
          .catch(err => {
              console.log(err);
              this.setState({
                  errors: this.state.errors.concat(err),
                  loading: false,
              })
            })
      }
    }
  
    handleInput = (errors, inputName) => {
     return errors.some(el => el.message.toLowerCase().includes(inputName)) ? 'error' : ''
    }
  
    render() {
  
      const {email, password, errors, loading} = this.state
  
      return (
        <Grid textAlign='center' verticalAlign='middle' className='app'>
          <Grid.Column style={{
            maxWidth: 450
          }}>
            <Header as='h1' icon color='violet' textAlign='center'>
              <Icon name='code branch' color='violet'/>
              Login to Slack Clone
            </Header>
            <Form onSubmit={this.handleSubmit} size='large'>
              <Segment stacked>  
                <Form.Input
                  fluid
                  name='email'
                  icon='mail'
                  iconPosition='left'
                  placeholder='Email'
                  onChange={this.handlerChange}
                  type='email'
                  value={email}
                  className={this.handleInput(errors, 'email')}/>
  
                <Form.Input
                  fluid
                  name='password'
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  onChange={this.handlerChange}
                  type='password'
                  value={password}
                  className={this.handleInput(errors, 'password')}/>
                <Button disabled={loading} className={loading ? 'loading': ''} color='violet' fluid size='large'>
                  Submit
                </Button>
              </Segment>
            </Form>
            {errors.length > 0 && (
              <Message error>
                <h3>Error</h3>
                {errors.map(el => <p key={el.message}>{el.message}</p>)}
              </Message>
            )}
            <Message>
              Don`t have an account ?
              <NavLink to='/registration'>Registration</NavLink>
            </Message>
          </Grid.Column>
        </Grid>
      );
    }
  }
  
  export default Login;