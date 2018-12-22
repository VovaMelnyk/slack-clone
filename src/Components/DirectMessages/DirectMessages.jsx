import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import {connect} from 'react-redux';
import firebase from '../../firebase';

class DirectMessages extends React.Component {
  state = {
    users: [],
    usersRef: firebase.database().ref('users')
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
  }

  render() {
    const { users } = this.state;

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
          onClick={()=> console.log(el)}
          style={{opacity:0.7, fontStyle: 'italic'}}
          >
          <Icon name='circle'/>
          @ {el.name}
          </Menu.Item>)}
      </Menu.Menu>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.currentUser,
})

export default connect(mapStateToProps)(DirectMessages);