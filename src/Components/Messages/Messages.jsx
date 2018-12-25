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
        searchTerm: '',
        searchMessages: [],
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
               this.addListeners(this.props.currentChannel.id);
            }
        }
    }

    addListeners = channelId => {
        let loadedMessages = [];
        // console.log(this.state.messagesRef);
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val())
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

    hendleSearch =  async (e) => {
        await this.setState({
            searchTerm: e.target.value,
        })
        this.searchMessage()
    }

    searchMessage = () => {
        let searchResult = this.state.messages.filter(el => {
            if(el.content) {
                return el.content.includes(this.state.searchTerm)
            }
        });
        this.setState({
            searchMessages: searchResult,
        })
    }

    paintMessages = messages => {
       return messages.map(message => <SingleMessage
            key={message.time}
            message={message}
            user={message.user}
            />)
    }


    render() {
        // console.log(this.props.currentChannel);
        const {messagesRef, messages, searchTerm, searchMessages} = this.state;
        return (
            <React.Fragment>
                <MessageHeader usersAmount={this.state.countUser} hendleSearch= {this.hendleSearch}/>
                <Segment>
                    <Comment.Group className='messages'>
                        {messages.length > 0 && !searchTerm ? this.paintMessages(messages) : this.paintMessages(searchMessages)}

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