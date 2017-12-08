import * as React from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from "redux";
import DropZone from '../DropZone';
import * as consts from '../../../common/consts';
import TransferList from "./TransferList";
import transferQueue from "../../TransferQueue";
// import { addTransferTask, removeTransferTask } from "../../actions/tasks";

// TODO: should be renamed
class TransferManagerC extends React.Component {

    constructor(props) {
        super(props);
        this.createUploadTask = this.createUploadTask.bind(this);
    }

    onDrop = (files) => {
        // this.setState({ files });
        this.createUploadTask(files);
    };

    async createUploadTask(files) {
        for (let file of files) {
            let task = {
                type: consts.TRANSFER_TYPES.UPLOAD,
                file: file
            };

            try {
                const uploadTask = await transferQueue.addTask(task);
                // this.props.addTransferTask(uploadTask);
            } catch(err) {
                console.error("createUploadTask error", err)
            }
        }
    };

    render() {
        return (
            <div>
                {/*<button onClick={this.testAction}>TEST ACTION</button>*/}
                <DropZone onDrop={this.onDrop}/>

                <TransferList tasks={this.props.tasks}/>
            </div>
        );
    }
}


/* CONNECT */
const mapStateToProps = (state) => {
    console.log('state', state);
    return {
        tasks: state.transfer.processTasks.byId
    };
};

// TODO: actions should NOT be dispatched from here.. They should rather be called from transferQueueHandler!
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        // addTransferTask,
        // removeTransferTask
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TransferManagerC);