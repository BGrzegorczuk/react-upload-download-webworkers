import React from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import TransferListItem from "./TransferListItem";


class TransferList extends React.Component {

    renderEmptyList() {
        return <div>EMPTY LIST</div>;
    }

    renderList(tasks) {
        if (!isEmpty(tasks)) {
            return map(tasks, (taskId, task) => <TransferListItem key={taskId} file={task.file}/>);
        } else {
            return this.renderEmptyList();
        }
    }

    render() {
        return (
            <div>
                <h2>TransferList</h2>
                <ul>
                    { this.renderList(this.props.tasks) }
                </ul>
            </div>
        );
    }
}

export default TransferList;