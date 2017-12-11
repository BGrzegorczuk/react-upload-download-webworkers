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
            return map(tasks, (task, taskId) => <TransferListItem key={taskId} task={task}/>);

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