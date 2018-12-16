import React, {Component} from 'react';
import {Segment, Input, Button} from 'semantic-ui-react';
import {connect} from 'react-redux';
import firebase from '../../firebase';
class MessageForm extends Component {

  state = {
    message : '',
    loading: false,
    errors: [],
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  createMessage = () => {
    const message = {
      content: this.state.message,
      time: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.props.currentUser.uid,
        name: this.props.currentUser.displayName,
        avatar: this.props.currentUser.photoURL,
      }
    }
    return message;
  }

  sendMessage = () => {
    const {messagesRef, currentChannel} = this.props;
    const {message} = this.state;

    if (message) {
      // send
      this.setState({loading: true,})
      messagesRef
      .child(currentChannel.id)
      .push()
      .set(this.createMessage())
      .then(()=> {
        this.setState({loading: false, message: ''})
      })
      .catch( err => {
        this.setState({
          loading: false,
          errors: this.state.errors.concat(err)
        })
      })
    }
  } 



  render() {
    return (
      <Segment className='message__form'>
        <Input
          fluid
          name='message'
          onChange={this.handleChange}
          style={{marginBottom: '0.7rem'}}
          label={< Button icon = 'add' />}
          labelPosition='left'
          placeholder='Write your message'
          value={this.state.message}/>
        <Button.Group icon widths='2'>
          <Button disabled={this.state.loading} color='orange' content='Add Reply' labelPosition='left' icon='edit' onClick={this.sendMessage}/>
          <Button
            color='teal'
            content='Upload media'
            labelPosition='right'
            icon='cloud upload'/>
        </Button.Group>
      </Segment>
    );
  }
}

const mapStateToProps = state => ({
  currentChannel: state.channel,
  currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(MessageForm);