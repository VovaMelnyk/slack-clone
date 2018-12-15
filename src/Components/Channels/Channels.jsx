import React, { Component } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';
import {connect} from 'react-redux';

class Channels extends Component {

    state= {
        channels : [],
        modal: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
    }

    componentDidMount () {
        this.addListeners();
    }

    addListeners = () => {
        let loadedChanels = [];
        this.state.channelsRef.on('child_added',snap => {
            loadedChanels.push(snap.val())
            console.log(loadedChanels);
            this.setState({
                channels: loadedChanels
            })
        })
    }

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

    addChannel = () => {
        const {channelsRef, channelName, channelDetails} = this.state;
        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: this.props.user.displayName,
                avatar: this.props.user.photoURL,
            }
        }

        channelsRef
        .child(key)
        .update(newChannel)
        .then(() => {
            this.setState({
                channelName: '', channelDetails: ''
            })
            this.closeModal();
            console.log('channel added');
        })
        .catch(err => console.log(err))
    }

    handleSubmit = e => {
        e.preventDefault();
        if(this.isFormValid(this.state)) {
            // console.log('channel added');
            this.addChannel();
            
        }
    }

    isFormValid = ({channelName, channelDetails}) => channelName && channelDetails;


    render() {
        const {channels, modal} = this.state;
        return (
            <React.Fragment>
            <Menu.Menu style={{paddingBottom:'2rem'}}>
            <Menu.Item>
                <span>
                    <Icon name='exchange'/> CHANNELS
                </span> ({channels.length})<Icon name='add' onClick={this.openModal}/>
            </Menu.Item>
            {channels.length > 0 && channels.map(channel => (
                <Menu.Item 
                key={channel.id}
                name={channel.name}
                style={{opacity:0.7}}
                >
                # {channel.name}    
                </Menu.Item>
            ))}
            </Menu.Menu>
            <Modal open={modal} onClose={this.closeModal} style={{background:'#fff'}}>
            <Modal.Header>Add a Channel</Modal.Header>
            <Modal.Content>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <Input 
                        fluid 
                        label='Channel  Name'
                        name='channelName'
                        onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input 
                        fluid 
                        label='Channel Details'
                        name='channelDetails'
                        onChange={this.handleChange}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted onClick={this.closeModal}>
                    <Icon name='remove'/> Cancel
                </Button>
                <Button color='green' inverted onClick={this.handleSubmit}>
                    <Icon name='checkmark'/> Add
                </Button>
            </Modal.Actions>
            </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.currentUser,
})

export default connect(mapStateToProps)(Channels);