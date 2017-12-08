import React from 'react';


class TransferListItem extends React.Component {

    getPercentage(task) {
        return task.totalBytes/task.processedBytes * 100;
    }

    render() {
        const {task} = this.props;
        return (
            <li>
                <p>{task.file.name} - {task.file.size} bytes ==>> [{this.getPercentage(task)}]</p>
            </li>
        );
    }
}

export default TransferListItem;