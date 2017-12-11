import * as React from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from "redux";
import DropZone from '../DropZone';
import * as consts from '../../../common/consts';
import TransferList from "./TransferList";
import transferQueue from "../../TransferQueue";


class TransferManagerC extends React.Component {

    constructor(props) {
        super(props);
        this.createUploadTask = this.createUploadTask.bind(this);
    }

    onDrop = (files) => {
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
            } catch(err) {
                console.error("createUploadTask error", err)
            }
        }
    };

    render() {
        return (
            <div>
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

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TransferManagerC);