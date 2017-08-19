import * as React from 'react';
import Dropzone from 'react-dropzone'

const Thumb = (props) => {
    const {name, size, preview} = props.file;
    return (
        <li>
            <img src={preview} alt="thumbnail" width={200}/>
            <p>{name} - {size} bytes</p>
        </li>
    );
};

class DropZone extends React.Component {
    render() {
        return (
            <section>
                <div className="dropzone">
                    <Dropzone
                        // accept="image/jpeg, image/png"
                        // maxSize={2000000}
                        onDropAccepted={this.props.onDrop}
                    >
                        <p>Try dropping some files here or click to select files to upload</p>
                    </Dropzone>
                </div>
                <aside>
                    <h2>Dropped files</h2>
                    <ul>
                        {
                            this.props.files.map((f, i) => <Thumb key={i} file={f}/>)
                        }
                    </ul>
                </aside>
            </section>
        )
    }
}

export default DropZone;