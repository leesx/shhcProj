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
    Slider, Button, Upload, Icon, Modal, Tabs,message
} from 'antd';
const FormItem    = Form.Item;
const Option      = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup  = Radio.Group;
const TabPane     = Tabs.TabPane;

import {myAxios,notice} from 'utils'
import HeroList from './HeroList'

class FormBox extends React.Component {
    state        = {
        editorContent : '',
        previewVisible: false,
				loading:false,
        previewImage  : '',
        fileList      : [{
            uid   : -1,
            name  : 'xxx.png',
            status: 'done',
            url   : 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }],
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
                const photolist = values.photo && values.photo.map((item) => {
                    return {
                        url     : item.response,
                        thumbUrl: item.thumbUrl,
                    }
                });
                //console.log(photolist)
                //delete values.photo;
                const params = Object.assign(values, {photolist, content: this.state.editorContent})
								this.setState({
									loading:true
								})
                myAxios.post('/api/insertHeroInfo', params).then((data) => {
										if(data.rs==='ok'){
											this.setState({
												loading:false
											})
											notice('success',{msg:'提示',desc:'保存成功'})
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
    normFile            = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    getEditorContent = (content) => {
        this.setState({
            editorContent: content,
        })
        console.log(content)
    }

    render() {
        const {previewVisible, previewImage, fileList,loading} = this.state
        const {getFieldDecorator}                      = this.props.form;
        const formItemLayout                           = {
            labelCol  : {span: 2},
            wrapperCol: {span: 22},
        };

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
                    {getFieldDecorator('rank', {initialValue: 1})(
                        <InputNumber style={{width: 240}} min={1} max={108}/>
                    )}
                    <span className="ant-form-text"> 位</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="天罡地煞"
                >
                    {getFieldDecorator('scope', {valuePropName: 'checked'})(
                        <Switch checkedChildren="天罡" unCheckedChildren="地煞"/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="功力"
                >
                    {getFieldDecorator('skill')(
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
                    {getFieldDecorator('content', {
                        valuePropName    : 'fileList',
                        getValueFromEvent: this.getEditorContent,
                    })(
                        <RichEditor getEditorContent={this.getEditorContent}/>
                    )}
                </FormItem>

                <FormItem
                    wrapperCol={{span: 24}}
                >
                    <Button loading ={loading} type="primary" size="large" className="ft-submit-btn" htmlType="submit">提交</Button>
                </FormItem>
            </Form>
        );
    }
}

const CreateFormBox = Form.create()(FormBox);
export default CreateFormBox
