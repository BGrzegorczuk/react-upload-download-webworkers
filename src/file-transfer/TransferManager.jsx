import * as React from 'react';
import DropZone from './DropZone';
import * as consts from '../common/consts';
import TransferQueue from './TransferQueue';


class TransferManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = { files: [] };
        this.queue = new TransferQueue({
            uploadWorkersNo: 3
        });
    }

    onDrop = (files) => {
        this.setState({ files });
        this.startUpload(files);
    };

    startUpload = (files) => {
        for (let file of files) {
            let task = {
                type: consts.TRANSFER_TYPES.UPLOAD,
                file: file
            };
            this.queue.addTask(task);
        }
    };

    render() {
        return <DropZone onDrop={this.onDrop} files={this.state.files}/>;
    }
}

export default TransferManager;