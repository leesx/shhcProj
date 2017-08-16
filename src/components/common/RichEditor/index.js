import React, { Component } from 'react';
import classnames from 'classnames';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './index.less';

export default class RichEditor extends Component {
		constructor(props) {
	    super(props);
			this.state = {
				editorState:EditorState.createEmpty(),
			};
	  }


		componentWillReceiveProps(nextProps){
			if(nextProps.editorConetent == this.props.editorConetent) return ;
			const html = nextProps.editorConetent || '';
			const contentBlock = htmlToDraft(html);
			if (contentBlock) {
				const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
				const editorState = EditorState.createWithContent(contentState);
				this.state = {
					editorState,
				};
			}

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
				const cls = classnames('myeditor-wrapper',this.props.className)
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName={cls}
                    editorClassName="myeditor-editor"
                    onEditorStateChange={this.onEditorStateChange}
                />
                {/* <textarea
                    style={{width:'100%'}}
                    disabled
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                /> */}

            </div>
        );
    }
}
