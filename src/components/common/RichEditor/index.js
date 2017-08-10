import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './index.less';

export default class RichEditor extends Component {
    state = {
        editorState: EditorState.createEmpty(),
    }

    onEditorStateChange=(editorState) => {
        this.setState({
            editorState,
        });

        const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.props.getEditorContent(content)
    };

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="myeditor-wrapper"
                    editorClassName="myeditor-editor"
                    onEditorStateChange={this.onEditorStateChange}
                />
                <textarea
                    style={{width:'100%'}}
                    disabled
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                />

            </div>
        );
    }
}