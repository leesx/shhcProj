/*
 * @Author: leesx
 * @Date: 2017-07-06 11:03:22
 * @Last Modified by:   leesx
 * @Last Modified time: 2017-07-06 11:03:22
 */

import React, {Component} from 'react';
import {SVGIcon, RichEditor} from 'components/common';


import {
    Form, Select, InputNumber, Input, Switch, Radio,
    Slider, Button, Upload, Icon, Modal, Tabs,message,
} from 'antd';
const FormItem    = Form.Item;
const Option      = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup  = Radio.Group;
const TabPane     = Tabs.TabPane;

import {myAxios,notice} from 'utils';
import HeroList from './HeroList';

class FormBox extends React.Component {
    state        = {
				loading:false,
        previewVisible: false,
				editData:{},
        previewImage  : '',
				editID:this.props.editID,
    }

		componentDidMount(){
			this.fetchData(this.state.editID)
		}
		componentWillReceiveProps(nextProps,nextState){
			console.log(this.props,nextProps,'====================')
			if(this.props.editID !== nextProps.editID){
				this.fetchData(nextProps.editID)
			}
		}
		fetchData(id){
        myAxios.post('/api/getHeroList',{
					id
				}).then((data)=>{
						if(data.rs=='ok'){
							this.setState({
								editData:data.data
							})
							const { name,
							alias,
							title,
							content,
							final,
							rank,
							photolist,
							scope,
							skill,
							star, } = data.data

							const plist = data.data.photolist || [];
							const newPhoto = plist.length && plist.map((item,index)=>{
								return Object.assign({},item,{uid:index,status:'done'})
							})
							this.props.form.setFieldsValue({
								name,
								alias,
								title,
								content,
								final,
								rank,
								photo:newPhoto,
								scope:!!scope,
								skill:skill*1,
								star,
							})
						}
        }).catch((err) => {
					console.error(err)
				})
    }
    handleCancel = () => this.setState({previewVisible: false})

    handlePreview       = (file) => {
        this.setState({
            previewImage  : file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    handleSubmit        = (e) => {

    }
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    getEditorContent = (content) => {
			//设置自定义表单组件的value
				this.props.form.setFieldsValue({
					content:content
				})
    }

    render() {
        const {previewVisible, previewImage, fileList,editData,loading} = this.state
        const {getFieldDecorator}                      = this.props.form;
        const formItemLayout                           = {
            labelCol  : {span: 4},
            wrapperCol: {span: 20},
        };

				const photolist = editData.photolist || [];
				const photoImgs = photolist.length && photolist.map((item,index)=>{
					return Object.assign({},item,{uid:index,status:'done'})
				})

        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <Form onSubmit={this.handleSubmit}>

                <FormItem
                    {...formItemLayout}
                    label="姓名"
                    hasFeedback
                >
                    {getFieldDecorator('name', {
												//initialValue:editData.name,
                        rules: [
                            {required: true, message: '请输入英雄大名!'},
                        ],
                    })(
                        <Input  placeholder="如宋江"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="星宿"
                    hasFeedback
                >
                    {getFieldDecorator('star', {
												//initialValue:editData.star,
                        rules: [
                            {required: true, message: '请输入英雄星宿!'},
                        ],
                    })(
                        <Input  placeholder="如天魁星!"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="诨名"
                    hasFeedback
                >
                    {getFieldDecorator('alias', {
												//initialValue:editData.alias,
                        rules: [
                            {required: true, message: '请输入英雄诨名!'},
                        ],
                    })(
                        <Input  placeholder="如及时雨、呼保义!"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="梁山泊职位"
                    hasFeedback
                >
                    {getFieldDecorator('title', {
												//initialValue:editData.title,
                        rules: [
                            {required: true, message: '请输入英雄梁山泊职位!'},
                        ],
                    })(
                        <Input  placeholder="如总兵都头领!"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="英雄结局"
                >
                    {getFieldDecorator('final', {
												//initialValue:editData.final,
                        defaultValue: '1'
                    })(
                        <Select >
                            <Option value="1">战死</Option>
                            <Option value="2">朝廷任用</Option>
                            <Option value="3">病逝</Option>
                            <Option value="4">返乡、出海</Option>
                            <Option value="5">毒毙</Option>
                            <Option value="6">自缢</Option>
                            <Option value="7">出家</Option>
                            <Option value="8">抗金</Option>

                        </Select>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="梁山泊排行"
                >
                    {getFieldDecorator('rank', {
											//initialValue:editData.rank,
										})(
                        <InputNumber  min={1} max={108}/>
                    )}
                    <span className="ant-form-text"> 位</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="天罡地煞"
										initialValue={editData.scope}
                >
                    {getFieldDecorator('scope', {
											valuePropName: 'checked',
										})(
                        <Switch checkedChildren="天罡" unCheckedChildren="地煞"/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="功力"
                >
                    {getFieldDecorator('skill',{
											//initialValue:editData.skill ? editData.skill*1  : 10,
										})(
                        <Slider style={{width: 360}}
                                marks={{0: '10', 20: '20', 40: '40', 60: '60', 80: '80', 100: '100'}}/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="英雄头像"
                >
                    {getFieldDecorator('photo', {
											// initialValue:photoImgs,
											valuePropName: 'fileList',
            					getValueFromEvent: this.normFile,
                    })(
                        <Upload name="photo" action="/api/upload/photo" listType="picture-card">
                            {uploadButton}
                        </Upload>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="英雄介绍"
										className="field-content"
                >
                    {getFieldDecorator('content', {
										})(
											<div className="modal-editor-content">
												<RichEditor className="modal-editor" editorConetent={editData.content} getEditorContent={this.getEditorContent}/>
											</div>
                    )}
                </FormItem>
            </Form>
        );
    }
}

const EditFormBox = Form.create()(FormBox);

export default EditFormBox;
