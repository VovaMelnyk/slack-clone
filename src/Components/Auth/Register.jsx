import React, {Component} from 'react';
import firebase from '../../firebase';
import md5 from 'md5';
import {NavLink} from 'react-router-dom'
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from 'semantic-ui-react';
class Register extends Component {

  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  }

  handlerChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  isFormEmpty = ({username, email, password, passwordConfirm}) => {
    return !username.length || !email.length || !password.length || !passwordConfirm.length;
  }

  isPasswordValid = ({password, passwordConfirm}) => {
    return password === passwordConfirm;
  }

  isFormValid = () => {
    let errors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      error = {
        message: 'Fill in all fields'
      };
      this.setState({
        errors: errors.concat(error)
      })
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = {
        message: 'Password is invalid'
      };
      this.setState({
        errors: errors.concat(error)
      })
      return false;
    } else {
      return true;
    }
  }

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
        this.setState({ errors: [], loading: true})
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user.updateProfile({
            displayName: this.state.username,
            photoURL:`http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
          })
          .then(()=> {
                // 1 this.setState({ loading: false })
                // 2 save user
                this.saveUser(createdUser).then(()=> console.log('user saved'))
          })
          .catch(err => {
            console.error(err);
            this.setState({ errors: this.state.errors.concat(err), loading: false })
          })
        })
        .catch(err => {
          console.error(err);
          this.setState({ errors: this.state.errors.concat(err), loading: false })
        })
    }
  }

  handleInput = (errors, inputName) => {
    return errors.some(el => el.message.toLowerCase().includes(inputName)) ? 'error' : ''
   }
 


  render() {
    const {username, email, password, passwordConfirm, errors, loading} = this.state

    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{
          maxWidth: 450
        }}>
          <Header as='h1' icon color='orange' textAlign='center'>
            <Icon name='comment alternate' color='orange'/>
            Register for Slack Clone
          </Header>
          <Form size='large' onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name='username'
                icon='user'
                iconPosition='left'
                placeholder='Username'
                type='text'
                onChange={this.handlerChange}
                value={username}
                className={this.handleInput(errors, 'username')}/>

              <Form.Input
                fluid
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email'
                type='email'
                onChange={this.handlerChange}
                value={email}
                className={this.handleInput(errors, 'email')}/>

              <Form.Input
                fluid
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                onChange={this.handlerChange}
                value={password}
                className={this.handleInput(errors, 'password')}/>

              <Form.Input
                fluid
                name='passwordConfirm'
                icon='repeat'
                iconPosition='left'
                placeholder='Password Confirm'
                type='password'
                onChange={this.handlerChange}
                value={passwordConfirm}
                className={this.handleInput(errors, 'password')}/>

              <Button disabled={loading} className={loading ? 'loading': ''} color='orange' fluid size='large'>
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
            Already a user?
            <NavLink to='/login'>Login</NavLink>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;