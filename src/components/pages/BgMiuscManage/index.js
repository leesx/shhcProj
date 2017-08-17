/*
 * @Author: leesx
 * @Date: 2017-07-06 11:03:35
 * @Last Modified by:   leesx
 * @Last Modified time: 2017-07-06 11:03:35
 */

import React, { Component } from 'react';
import {SVGIcon} from 'components/common';
import { Upload, Button, Icon,message } from 'antd';
import {myAxios} from 'utils';


// defaultFileList: [{
// 	uid: 1,
// 	name: 'xxx.png',
// 	status: 'done',
// 	reponse: 'Server Error 500',  // custom error message to show
// 	url: 'http://www.baidu.com/xxx.png',
// }, {
// 	uid: 2,
// 	name: 'yyy.png',
// 	status: 'done',
// 	url: 'http://www.baidu.com/yyy.png',
// }, {
// 	uid: 3,
// 	name: 'zzz.png',
// 	status: 'error',
// 	reponse: 'Server Error 500',  // custom error message to show
// 	url: 'http://www.baidu.com/zzz.png',
// }]




export default class BgMiuscManage extends Component{
	state = {
		fileList:[],
	}
	componentDidMount(){
		this.fetchData()
	}
	fetchData(){
		myAxios.post('/api/getMusicList').then((data) => {
			const fileList = data.data.map((item,index) => {
				return Object.assign({},item,{uid:index})
			})
			if(data.rs){
				this.setState({
					fileList,
				})
			}
		})
	}

	handleUploadChange = (info) => {
		let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    //fileList = fileList.slice(-2);

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    // 3. filter successfully uploaded files according to response from server
    // fileList = fileList.filter((file) => {
    //   if (file.response) {
    //     return file.response.status === 'success';
    //   }
    //   return true;
    // });

    this.setState({ fileList });
  }
	handleRemoveMusic=(file)=>{
		console.log('删除',file)
		myAxios.post('/api/removeMusic',{
			id:file._id,
			url:file.url
		}).then((data) => {
			if(data.rs){
				message.success('删除成功')
			}else{
				message.error('删除失败')
				return false
			}
		}).catch((err) => {
			message.error('删除失败')
		})
	}
  render(){
		const {fileList} = this.state;
		const props = {
			action:'/api/uploadMusic',
			accept:'audio/*',
			onChange:this.handleUploadChange,
			onRemove:this.handleRemoveMusic,
    };
    return (
        <div>
            <h1>背景音乐管理</h1>
					<p>共{fileList.length}首音乐</p>
				{
					fileList.length ? (
						<audio src={fileList[0].url} controls="controls">
						Your browser does not support the audio element.
						</audio>
					) : null
				}

				<div style={{width:300}}>
						<Upload
							{...props}
							fileList = {fileList}
						>
							<Button>
								<Icon type="upload" /> Upload
							</Button>

						</Upload>
				</div>
        </div>
    )
  }
}
