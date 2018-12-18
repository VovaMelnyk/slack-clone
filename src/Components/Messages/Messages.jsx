import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import {connect} from 'react-redux';
import firebase from '../../firebase';
import MessageForm from '../MessageForm/MessageForm';
import MessageHeader from '../MessageHeader/MessageHeader';
import SingleMessage from '../SingleMessage/SingleMessage';

class Messages extends Component {

    state = {
        messagesRef: firebase.database().ref('messages'),
        messages: [],
        loading: true,
        countUser: '',
    }

    componentDidMount () {
        setTimeout(()=> {
            const {currentChannel, currentUser} = this.props;
         if(currentChannel && currentUser) {
             this.addListeners(currentChannel.id)
         }
        }, 1000);
    }

    componentDidUpdate (prevProps) {
        
        if(prevProps.currentChannel && this.props.currentChannel) {
            if (prevProps.currentChannel.name !== this.props.currentChannel.name) {
                // this.addListeners(this.props.currentChannel.id)
               this.addListeners(this.props.currentChannel.id);
            }
        }
    //     const {currentChannel, currentUser} = this.props;
    //      if(currentChannel && currentUser) {
    //          this.addListeners(currentChannel.id)
    //      }
    }

    addListeners = channelId => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val())
            // console.log(loadedMessages);
            this.setState({
                messages: loadedMessages,
                loading: false
            })
            this.countUnicUsers(loadedMessages)
        })
    }

    countUnicUsers = messages => {
        const iniqueUsers = messages.reduce((acc, el)=> {
            if(!acc.includes(el.user.name)){
                acc.push(el.user.name)
            }
            return acc
        }, [])

        this.setState({
            countUser: `${iniqueUsers.length} users`
        })
    }


    render() {
        // console.log(this.props.currentChannel);
        const {messagesRef, messages} = this.state;
        return (
            <React.Fragment>
                <MessageHeader usersAmount={this.state.countUser}/>
                <Segment>
                    <Comment.Group className='messages'>
                        {messages.length > 0 && messages.map(message => <SingleMessage
                        key={message.time}
                        message={message}
                        user={message.user}
                        /> )}

                    </Comment.Group>
                </Segment>
                <MessageForm messagesRef = {messagesRef}/>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    currentChannel: state.channel,
    currentUser: state.user.currentUser
  })

export default connect(mapStateToProps)(Messages);