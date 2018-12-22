import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import {connect} from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../redux/actions'
import firebase from '../../firebase';

class DirectMessages extends React.Component {
  state = {
    activeChannel: "",
    users: [],
    usersRef: firebase.database().ref('users'),
    connectedRef: firebase.database().ref('.info/connected'),
    onlineRef: firebase.database().ref('onlineUsers'),
  }

  componentDidMount() {
    if(this.props.user) {
      this.addListener(this.props.user.uid)
    }
  }

  addListener = id => {
    let loadedUsers = [];
    this.state.usersRef.on('child_added',snap => {
      if(id !== snap.key) {
        let user = snap.val();
        user.uid = snap.key;
        user.status = 'offline';
        loadedUsers.push(user);
        this.setState({
          users: loadedUsers
        })
      }
    })

    this.state.connectedRef.on('value', snap => {
      if (snap.val()) {
       const ref = this.state.onlineRef.child(id);
       ref.set(true);
       ref.onDisconnect().remove(err => {
         if(err !==null) {
           console.log(err);
         }
       })
      }
    })

    this.state.onlineRef.on('child_added', snap => {
      if(id !== snap.key) {
        this.setUserStatus(snap.key);
      }
    })

    this.state.onlineRef.on('child_removed', snap => {
      if(id !== snap.key) {
        this.setUserStatus(snap.key,false);        
      }
    })
  }

  setUserStatus = (id, status = true) => {
    const updateUsers = this.state.users.map(el => {
      if(el.uid === id) {
        el.status = `${status ? 'online' : 'offline'}`
      }
    })
    this.setState({
      users: updateUsers,
    })
  }

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  };

  getChannelId = userId => {
    const currentUserId = this.props.user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  setActiveChannel = userId => {
    this.setState({ activeChannel: userId });
  };



  render() {
    const { users, activeChannel } = this.state;

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span> ({ users.length })
        </Menu.Item>
        {/* Users to Send Direct Messages */}
          {users.map(el => <Menu.Item
          key={el.uid}
          active={el.uid === activeChannel}
          onClick={()=> this.changeChannel(el)}
          style={{opacity:0.7, fontStyle: 'italic'}}
          >
          <Icon name='circle'
          color={el.status === 'online' ? 'green' : 'grey'}/>
          @ {el.name}
          </Menu.Item>)}
      </Menu.Menu>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.currentUser,
})

export default connect(mapStateToProps, { setCurrentChannel, setPrivateChannel })(DirectMessages);