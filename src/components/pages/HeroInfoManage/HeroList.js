/**
 * Created by leesx on 2017/8/10.
 */

import React,{Component} from 'react';
import {Table,Button,Popconfirm,Pagination,Modal,message} from 'antd';
import {myAxios,notice} from 'utils';

import EditFormBox from './Edit'

function cleanHTMLTag(str=''){
	if(str === null) str ="";
  return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}

function setColumns(that){
	const columns = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			render(text,record){
					const url = record.photolist && record.photolist.length ? (record.photolist[0].url || record.photolist[0].thumbUrl) : 'http://192.168.4.233:3031/dist/images/logo.png'
					return (
							<div className="list-photo">
									<div className="avtar" style={{marginRight:5}}><img src={url} /></div>
									<span>{!text ? '' :text}</span>
							</div>
					)
			}
	}, {
			title: '星宿',
			dataIndex: 'star',
			key: 'star',
	}, {
			title: '诨名',
			dataIndex: 'alias',
			key: 'alias',
	}, {
			title: '职位',
			dataIndex: 'title',
			key: 'title',
	}, {
			title: '结局',
			dataIndex: 'final',
			key: 'final',
			render(text){
				const final = ['未知','战死','朝廷任用','病逝','返乡、出海','毒毙','自缢','出家','抗金'];
				return final[text]
			}
	}, {
			title: '排行',
			dataIndex: 'rank',
			key: 'rank',
	}, {
			title: '功力指数',
			dataIndex: 'skill',
			key: 'skill',
	}, {
			title: '介绍',
			dataIndex: 'content',
			key: 'content',
			render(text){
					return <div className="list-intro" style={{width:160}}>{cleanHTMLTag(text)}</div>
			}
	}, {
			title: '操作',
			dataIndex: 'other',
			key: 'other',
			render: (text, record, index) => {
				return (
						<div>
							<Popconfirm title="你确定要删除这条数据吗?" onConfirm={()=>that.handleClickDelete(index,record._id)}  okText="确定" cancelText="取消">
								<Button style={{marginRight:5}}>删除</Button>
							</Popconfirm>
								<Button onClick={()=>that.handleClickEdit(record._id)}>编辑</Button>
						</div>
				)
			},

	}];

	return columns;
}
export default class HeroList extends Component{
		constructor(props){
			super(props)
			this.state={
	        dataSource:[],
					pageSize:5, //每页多少条
					currentPage:1,//当前页码
					total:null,
					dataLoading:false,
					confirmLoading:false,
					editID:null,
	    }
			this.columns = setColumns(this)
		}

    componentDidMount(){
        this.fetchData()
    }
    fetchData=()=>{
			const {currentPage,pageSize} = this.state
			this.setState({
				dataLoading:true
			})
        myAxios.post('/api/getHeroList',{
					currentPage,
					pageSize,
				}).then((data)=>{
            console.log(data)
						if(data.rs){
							this.setState(
	                {
	                    dataSource:data.data,
											total:data.total,
											dataLoading:false,
	                }
	            )
						}else{
							this.setState(
	                {
											dataLoading:false,
	                }
	            )
						}

        }).catch((err) => {
					this.setState(
							{
									dataLoading:false,
							}
					)
				})
    }
		handleClickDelete=(index,id)=>{
			myAxios.delete('/api/'+id).then((data)=>{
					if(data.rs === 'ok'){
						const {dataSource} = this.state
						dataSource.splice(index,1)
						this.setState({
							dataSource
						})
						message.success('成功')
					}

			})
		}
		handleClickEdit=(editID)=>{
			this.setState({
				editID,
				visible:true,
			})
		}

		handleChangePag=(currentPage,pageSize)=>{
			this.setState({
				currentPage,pageSize
			},()=>{
				this.fetchData()
			})
		}

		handleEditModalOk=(e)=>{
			//new FormBox().handleSubmit(e)
			e.preventDefault();
			this.refs.editDom.validateFields((err,values)=>{
				const photolist = values.photo.map((item) => {
						return {
								url     : item.response,
								thumbUrl: item.thumbUrl,
						}
				});
				const params = Object.assign(values, {photolist});
				params.id = this.state.editID;
				this.setState({
					confirmLoading:true
				})
				myAxios.post('/api/updateHeroList', params).then((data) => {
					if(data.rs==='ok'){
						this.setState({
							confirmLoading:false,
							visible:false,
						})
						notice('success',{msg:'提示',desc:'修改成功'})
						//更新数据
						this.fetchData()
					}
				}).catch((err) => {
					this.setState({
						confirmLoading:false
					})
				})
			})
		}
		handleEditModalCancel=()=>{
			this.setState({
				visible:false
			})
		}
    render(){
        const {dataSource,currentPage,pageSize,total,dataLoading,visible,editID,confirmLoading} = this.state

        return (
						<div>
							<Table dataLoading={dataLoading} dataSource={dataSource} columns={this.columns} pagination={false} />
							<Pagination
								style={{marginTop:20,textAlign:'right'}}
								defaultCurrent={currentPage}
								current={currentPage}
								total={total}
								pageSize={pageSize}
								showTotal={(total, range) => `当前第${currentPage}页/总共 ${total} 条`}
								onChange={this.handleChangePag}
							/>
							<Modal title="编辑"
								visible={visible}
								width={1000}
								height={500}
								confirmLoading={confirmLoading}
								onOk={this.handleEditModalOk}
								onCancel={this.handleEditModalCancel}
								maskClosable={false}
							>
								<div className="edit-modal-box" style={{maxHeight:500,overflow:'auto'}}>
									<EditFormBox ref="editDom" editID={editID} />
								</div>
							</Modal>
						</div>
        )
    }
}
