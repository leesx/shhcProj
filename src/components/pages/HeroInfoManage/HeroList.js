/**
 * Created by leesx on 2017/8/10.
 */

import React,{Component} from 'react';
import {Table,Button} from 'antd'
import {myAxios} from 'utils'



function cleanHTMLTag(str){
  return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}
export default class HeroList extends Component{
		columns = [{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				render(text,record){
						console.log(text,record)
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
					console.log('----',this,record)
					return (
							<div>
									<Button style={{marginRight:5}} onClick={()=>this.handleClickDelete(index,record._id)}>删除</Button>
									<Button onClick={()=>this.handleClickEdit(record._id)}>编辑</Button>
							</div>
					)
				},

		}]
    state={
        dataSource:[],
    }
    componentDidMount(){
        this.fetchData()
    }
    fetchData(){
        myAxios.post('/api/getHeroList').then((data)=>{
            console.log(data)
            this.setState(
                {
                    dataSource:data.data
                }
            )
        })
    }
		handleClickDelete=(index,id)=>{
			console.log(id)

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
			console.log(id)

			console.log(this.props)
			this.props.handleEditList(id)

		}
    render(){
        const {dataSource,editID} = this.state
        return (
            <Table dataSource={dataSource} columns={this.columns}  />
        )
    }
}
