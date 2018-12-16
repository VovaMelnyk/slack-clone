import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessageForm from '../MessageForm/MessageForm';
import MessageHeader from '../MessageHeader/MessageHeader';

class Messages extends Component {
    render() {
        return (
            <React.Fragment>
                <MessageHeader/>
                <Segment>
                    <Comment.Group className='messages'>
                        {/* Messages */}

                    </Comment.Group>
                </Segment>
                <MessageForm/>
            </React.Fragment>
        );
    }
}

export default Messages;