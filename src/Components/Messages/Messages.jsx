import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';
import MessageForm from '../MessageForm/MessageForm';
import MessageHeader from '../MessageHeader/MessageHeader';

class Messages extends Component {

    state = {
        messagesRef: firebase.database().ref('messages')
    }

    render() {
        const {messagesRef} = this.state;
        return (
            <React.Fragment>
                <MessageHeader/>
                <Segment>
                    <Comment.Group className='messages'>
                        {/* Messages */}

                    </Comment.Group>
                </Segment>
                <MessageForm messagesRef = {messagesRef}/>
            </React.Fragment>
        );
    }
}

export default Messages;