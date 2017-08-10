/**
 * Created by leesx on 2017/8/10.
 */

import React,{Component} from 'react';
import {Table,Button} from 'antd'
import {myAxios} from 'utils'

const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render(text,record){
        console.log(text,record)
        const url = record.photolist && record.photolist.length ? record.photolist[0].url : 'http://192.168.4.233:3031/dist/images/logo.png'
        return (
            <div className="list-photo">
                <span>{!text ? '' :text}</span>
                <div className="avtar"><img src={url} /></div>
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
}, {
    title: '排行',
    dataIndex: 'rank',
    key: 'rank',
}, {
    title: '功力',
    dataIndex: 'skill',
    key: 'skill',
}, {
    title: '介绍',
    dataIndex: 'content',
    key: 'content',
    render(text){
        return <div style={{width:160,height:60,overflow:'hidden'}} dangerouslySetInnerHTML={{__html: text}} />
    }
}, {
    title: '操作',
    dataIndex: 'other',
    key: 'other',
    render(text){
        return (
            <div>
                <Button>删除</Button>
                <Button>编辑</Button>
            </div>
        )
    }
}];


export default class HeroList extends Component{
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
    render(){
        const {dataSource} = this.state
        return (
            <Table dataSource={dataSource} columns={columns} />
        )
    }
}
