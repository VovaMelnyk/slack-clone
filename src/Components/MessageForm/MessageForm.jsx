import React, {Component} from 'react';
import {Segment, Input, Button} from 'semantic-ui-react';
import {connect} from 'react-redux';
import uuidv4 from 'uuid/v4'
import firebase from '../../firebase';
import FileModal from '../FileModal/FileModal';
class MessageForm extends Component {

  state = {
    message : '',
    loading: false,
    errors: [],
    modal: false,
    uploadTask: null,
    storageRef: firebase.storage().ref()
  }

  // componentDidMount() {
  //   fetch('https://firebasestorage.googleapis.com/v0/b/slack-chat-clone.appspot.com/o/chat%2Fpublic%2Fimaged46b4c7d-724f-479a-9463-f270a80164bc.jpg')
  //   .then(res=> res.json())
  //   .then(data => console.log(data))
  // }

  openModal = () => {
    this.setState({
      modal: true,
    })
  }

  closeModal = () => {
    this.setState({
      modal: false,
    })
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  createMessage = (url = null) => {
    const message = {
      // content: this.state.message,
      time: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.props.currentUser.uid,
        name: this.props.currentUser.displayName,
        avatar: this.props.currentUser.photoURL,
      }
    }

    if(url !== null) {
      message['image'] = url
    } else {
      message['content'] = this.state.message;
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
  
  uploadFile = (file,metadata) => {
    // console.log(file, metadata);
    const pathToUpload = this.props.currentChannel.id;
    // console.log(pathToUpload);
    const ref = this.props.messagesRef;
    const filePath = `chat/public/image${uuidv4()}.jpg`;
    this.setState({
      uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
    }, 
    ()=> {
      this.state.uploadTask.on(
        "state_changed",
        () => {
          this.state.uploadTask.snapshot.ref
            .getDownloadURL()
            .then(downloadUrl => {
              this.sendFileMessage(downloadUrl, ref, pathToUpload);
            })
            .catch(err => {
              console.error(err);
            });
        }
      );
    })
  }

  sendFileMessage= (url, ref, path) => {
    ref.child(path)
    .push()
    .set(this.createMessage(url))
    .catch(err => {
      console.log(err);
    })
  }

  handleKeyDown = event => {
    if (event.ctrlKey && event.keyCode === 13) {
      this.sendMessage();
    }
  }



  render() {
    return (
      <Segment className='message__form'>
        <Input
          fluid
          name='message'
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
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
            icon='cloud upload'
            onClick={this.openModal}/>
            <FileModal modal={this.state.modal}
            closeModal ={this.closeModal}
            uploadFile={this.uploadFile}/>
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