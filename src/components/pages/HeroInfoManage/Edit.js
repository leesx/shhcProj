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

import {myAxios} from 'utils'
import HeroList from './HeroList'

class FormBox extends React.Component {
    state        = {
        editorContent : '',
				loading:false,
        previewVisible: false,
				editData:{},
        previewImage  : '',
    }

		componentDidMount(){
			this.fetchData()
		}

		fetchData(){
        myAxios.post('/api/getHeroList',{
					id:this.props.editID
				}).then((data)=>{
						if(data.rs=='ok'){
							this.setState({
								editData:data.data
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
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
							console.log('values',values)
                const photolist = values.photo.map((item) => {
                    return {
                        url     : item.response,
                        thumbUrl: item.thumbUrl,
                    }
                });
                const params = Object.assign(values, {photolist, content: this.state.editorContent});
								params.id = this.props.editID;
								this.setState({
									loading:true
								})
								console.log('params',params)
                myAxios.post('/api/updateHeroList', params).then((data) => {
									if(data.rs==='ok'){
										this.setState({
											loading:false
										})
										message.success('修改成功')
									}
                }).catch((err) => {
									this.setState({
										loading:false
									})
								})
                //console.log('Received values of form: ', values);
            }
        });
    }
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    getgetEditorContent = (content) => {
        this.setState({
            editorContent: content,
        })
        console.log(content)
    }

    render() {
        const {previewVisible, previewImage, fileList,editData,loading} = this.state
        const {getFieldDecorator}                      = this.props.form;
        const formItemLayout                           = {
            labelCol  : {span: 2},
            wrapperCol: {span: 22},
        };

				const photolist = editData.photolist || [];
				const uploadImgs = photolist.length &&photolist.map((item,index)=>{
					console.log('item',item)
					return Object.assign({},item,{uid:index,status:'done'})
				})

				console.log('uploadImgs',uploadImgs)

        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );

				console.log('editData',editData)
        return (
            <Form onSubmit={this.handleSubmit}>

                <FormItem
                    {...formItemLayout}
                    label="姓名"
                    hasFeedback
                >
                    {getFieldDecorator('name', {
												initialValue:editData.name,
                        rules: [
                            {required: true, message: '请输入英雄大名!'},
                        ],
                    })(
                        <Input style={{width: 240}} placeholder="如宋江"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="星宿"
                    hasFeedback
                >
                    {getFieldDecorator('star', {
												initialValue:editData.star,
                        rules: [
                            {required: true, message: '请输入英雄星宿!'},
                        ],
                    })(
                        <Input style={{width: 240}} placeholder="如天魁星!"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="诨名"
                    hasFeedback
                >
                    {getFieldDecorator('alias', {
												initialValue:editData.alias,
                        rules: [
                            {required: true, message: '请输入英雄诨名!'},
                        ],
                    })(
                        <Input style={{width: 240}} placeholder="如及时雨、呼保义!"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="梁山泊职位"
                    hasFeedback
                >
                    {getFieldDecorator('title', {
												initialValue:editData.title,
                        rules: [
                            {required: true, message: '请输入英雄梁山泊职位!'},
                        ],
                    })(
                        <Input style={{width: 240}} placeholder="如总兵都头领!"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="英雄结局"
                >
                    {getFieldDecorator('final', {
												initialValue:editData.final,
                        defaultValue: '1'
                    })(
                        <Select style={{width: 240}}>
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
                    {getFieldDecorator('rank', {initialValue: 1,initialValue:editData.rank,})(
                        <InputNumber style={{width: 240}} min={1} max={108}/>
                    )}
                    <span className="ant-form-text"> 位</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="天罡地煞"
										initialValue={editData.scope}
                >
                    {getFieldDecorator('scope', {valuePropName: 'checked'})(
                        <Switch checkedChildren="天罡" unCheckedChildren="地煞"/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="功力"
                >
                    {getFieldDecorator('skill',{
											initialValue:editData.skill ? editData.skill*1  : 10,
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
                        valuePropName    : 'fileList',
												initialValue:uploadImgs,
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
                >
                    {getFieldDecorator('content', {})(
                        <RichEditor editorConetent={editData.content} getEditorContent={this.getgetEditorContent}/>
                    )}
                </FormItem>

                <FormItem
                    wrapperCol={{span: 24}}
                >
                    <Button loading={loading} type="primary" size="large" className="ft-submit-btn" htmlType="submit">提交</Button>
                </FormItem>
            </Form>
        );
    }
}

const EditFormBox = Form.create()(FormBox);
export default EditFormBox;
