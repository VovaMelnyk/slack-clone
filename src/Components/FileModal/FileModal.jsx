import React from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";
import mime from 'mime-types';

class FileModal extends React.Component {

  state = {
    file: null,
    correctType: ['image/jpg','image/png', 'image/jpeg']
  }

  addFile = e => {
    const file = e.target.files[0];
    // console.log(file);
    if (file) {
      this.setState({file});
    }
  }

  sendFile = () => {
    if (this.state.file !== null) {
      if(this.isFileTypeCorect(this.state.file.name)) {
        const metadata = {
          contentType : mime.lookup(this.state.file.name)
        }
        this.uploadFile(this.state.file,metadata);
        this.props.closeModal();
        this.setState({
          file: null,
        })

      }
    }
  }

  uploadFile = (file,metadata) => {
    console.log(file, metadata);
  }

  isFileTypeCorect = fileName => this.state.correctType.includes(mime.lookup(fileName))

  render() {
    const { modal, closeModal } = this.props;

    return (
      <Modal open={modal} onClose={closeModal}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input onChange={this.addFile} fluid label="File types: jpg, png" name="file" type="file" />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.sendFile}>
            <Icon name="checkmark" /> Send
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
