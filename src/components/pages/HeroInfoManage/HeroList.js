/**
 * Created by leesx on 2017/8/10.
 */

import React,{Component} from 'react';
import {Table,Button,Popconfirm,Pagination,Modal} from 'antd'
import {myAxios} from 'utils'

import EditFormBoxModal from './Edit'

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
					loading:false,
	    }
			this.columns = setColumns(this)
		}

    componentDidMount(){
        this.fetchData()
    }
    fetchData(){
			const {currentPage,pageSize} = this.state
			this.setState({
				loading:true
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
											loading:false,
	                }
	            )
						}else{
							this.setState(
	                {
											loading:false,
	                }
	            )
						}

        }).catch((err) => {
					this.setState(
							{
									loading:false,
							}
					)
				})
    }
		handleClickDelete=(index,id)=>{
			myAxios.post('/api/deleteHeroList',{
				id,
			}).then((data)=>{
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
		handleClickEdit=(id)=>{
			//this.props.handleEditList(id)
			console.log('=====================================================')
			this.setState({
				editID:id,
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
    render(){
        const {dataSource,editID,currentPage,pageSize,total,loading,visible,confirmLoading} = this.state
				console.log('render',visible)
        return (
						<div>
							<Table loading={loading} dataSource={dataSource} columns={this.columns} pagination={false} />
							<Pagination
								defaultCurrent={currentPage}
								current={currentPage}
								total={total}
								pageSize={pageSize}
								onChange={this.handleChangePag}
							/>
							<EditFormBoxModal  visible={visible} editID={editID} />

						</div>

        )
    }
}
