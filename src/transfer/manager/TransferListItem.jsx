import React from 'react';


class TransferListItem extends React.Component {

    renderItem(file) {
        const {name, size} = file;
        return (
            <li>
                <p>{name} - {size} bytes</p>
            </li>
        );
    }

    render() {
        return this.renderItem(this.props.file);
    }
}

export default TransferListItem;