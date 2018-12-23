import React from "react";
import firebase from "../../firebase";
import {connect} from 'react-redux';
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  Segment
} from "semantic-ui-react";
import {TwitterPicker} from "react-color";

class ColorPanel extends React.Component {
  state = {
    modal: false,
    primary: '',
    secondary: '',
    usersRef: firebase.database().ref("users")
  };

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  handleChangePrimaryColor = color => {
      this.setState({primary: color.hex})
  }

  handleChangeSecondaryColor = color => {
    this.setState({secondary: color.hex})
  }

  handleSaveColors = () => {
    if (this.state.primary && this.state.secondary) {
      this.saveColors(this.state.primary, this.state.secondary);
    }
  };

  saveColors = (primary, secondary) => {
    this.state.usersRef
      .child(`${this.props.user.currentUser.uid}/colors`)
      .push()
      .update({
        primary,
        secondary
      })
      .then(() => {
        console.log("Colors added");
        this.closeModal();
      })
      .catch(err => console.error(err));
  };


  render() {
    const { modal, primary, secondary } = this.state;

    return (
      <Sidebar
        as={Menu}
        icon="labeled"
        inverted
        vertical
        visible
        width="very thin"
      >
        <Divider />
        <Button icon="add" size="small" color="blue" onClick={this.openModal} />

        {/* Color Picker Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Choose App Colors</Modal.Header>
          <Modal.Content>
            <Segment>
            <Label content="Primary Color" />
            <TwitterPicker onChange={this.handleChangePrimaryColor} color={primary}/>
            </Segment>
            <Segment>
            <Label content="Secondary Color" />
            <TwitterPicker onChange={this.handleChangeSecondaryColor} color={secondary}/>
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSaveColors}>
              <Icon name="checkmark" /> Save Colors
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}

const MSTP = state => ({
    user: state.user
})

export default connect(MSTP)(ColorPanel);
