import React, {Component} from 'react';
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label
} from 'semantic-ui-react';
import firebase from '../../firebase';
import {connect} from 'react-redux';
import {setCurrentChannel} from '../../redux/actions'

class Channels extends Component {

  state = {
    activeChannel: '',
    channels: [],
    modal: false,
    channelName: '',
    channelDetails: '',
    channelsRef: firebase
      .database()
      .ref('channels'),
    firstLoad: true,
    channel: null,
    messagesRef: firebase
      .database()
      .ref("messages"),
    notifications: []
  }

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  removeListeners = () => {
    this
      .state
      .channelsRef
      .off();
  }

  addListeners = () => {
    let loadedChanels = [];
    this
      .state
      .channelsRef
      .on('child_added', snap => {
        loadedChanels.push(snap.val())
        // console.log(loadedChanels);
        this.setState({
          channels: loadedChanels
        }, () => {
          this.loadFirstChannel()
        })
        this.addNotificationListener(snap.key);
      })
  }

  addNotificationListener = channelId => {
    this
      .state
      .messagesRef
      .child(channelId)
      .on("value", snap => {
        if (this.state.channel) {
          this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
        }
      });
  };

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(notification => notification.id === channelId);

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }

    this.setState({notifications});
  };

  loadFirstChannel = () => {
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(this.state.channels[0]);
      this.showActiveChannel(this.state.channels[0]);
      this.setState({ channel: this.state.channels[0] });
    }
    this.setState({firstLoad: false})
  }

  changeChannel = channel => {
    this.showActiveChannel(channel)
    this.clearNotifications();
    this
      .props
      .setCurrentChannel(channel)
    this.setState({channel});
  }

  clearNotifications = () => {
    let index = this
      .state
      .notifications
      .findIndex(notification => notification.id === this.state.channel.id);

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({notifications: updatedNotifications});
    }
  };

  showActiveChannel = channel => {
    this.setState({activeChannel: channel.id})
  }

  getNotificationCount = channel => {
    let count = 0;

    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  openModal = () => {
    this.setState({modal: true})
  }

  closeModal = () => {
    this.setState({modal: false})
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  addChannel = () => {
    const {channelsRef, channelName, channelDetails} = this.state;
    const key = channelsRef
      .push()
      .key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: this.props.user.displayName,
        avatar: this.props.user.photoURL
      }
    }

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({channelName: '', channelDetails: ''})
        this.closeModal();
        console.log('channel added');
      })
      .catch(err => console.log(err))
  }

  handleSubmit = e => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      // console.log('channel added');
      this.addChannel();

    }
  }

  isFormValid = ({channelName, channelDetails}) => channelName && channelDetails;

  render() {
    const {channels, modal} = this.state;
    return (
      <React.Fragment>
        <Menu.Menu className='menu'>
          <Menu.Item>
            <span>
              <Icon name='exchange'/>
              CHANNELS
            </span>
            ({channels.length})<Icon name='add' onClick={this.openModal}/>
          </Menu.Item>
          {channels.length > 0 && channels.map(channel => (
            <Menu.Item
              key={channel.id}
              name={channel.name}
              style={{
              opacity: 0.7
            }}
              onClick={() => this.changeChannel(channel)}
              active=
              {channel.id === this.state.activeChannel}>
              {this.getNotificationCount(channel) && (
                <Label color="red">{this.getNotificationCount(channel)}</Label>
              )}
              # {channel.name}
            </Menu.Item>
          ))}
        </Menu.Menu>
        <Modal
          open={modal}
          onClose={this.closeModal}
          style={{
          background: '#fff'
        }}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label='Channel  Name'
                  name='channelName'
                  onChange={this.handleChange}/>
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label='Channel Details'
                  name='channelDetails'
                  onChange={this.handleChange}/>
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' inverted onClick={this.closeModal}>
              <Icon name='remove'/>
              Cancel
            </Button>
            <Button color='green' inverted onClick={this.handleSubmit}>
              <Icon name='checkmark'/>
              Add
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({user: state.user.currentUser})

const mapDispatchToProps = dispatch => ({
  setCurrentChannel: function (channel) {
    dispatch(setCurrentChannel(channel))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Channels);