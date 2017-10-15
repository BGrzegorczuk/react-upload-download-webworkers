import * as React from 'react';
import DropZone from '../DropZone';
import * as consts from '../../common/consts';
import TransferQueue from '../TransferQueue';
import TransferList from "./TransferList";


class TransferManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: {}
        };
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

            const uploadTask = this.queue.addTask(task);
        }
    };

    addTask(task) {
        this.tasks[task.uid] = task;
    }

    removeTask(taskId) {
        delete this.tasks[taskId];
    }

    render() {
        return (
            <div>
                <DropZone onDrop={this.onDrop}/>
                <TransferList tasks={this.state.tasks}/>
            </div>
        );
    }
}

export default TransferManager;