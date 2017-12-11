import React from 'react';


class TransferListItem extends React.Component {

    getPercentage(task) {
        const percentage = !task.processedBytes ? 0 : task.processedBytes/task.totalBytes * 100;
        return percentage;
    }

    render() {
        const {task} = this.props;
        return (
            <li>
                <p>{task.file.name} - {task.file.size} bytes ==>> [{this.getPercentage(task)}%]</p>
            </li>
        );
    }
}

export default TransferListItem;