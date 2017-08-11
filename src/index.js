import React from 'react';
import ReactDOM  from 'react-dom';
import {Router, Route, IndexRoute, IndexRedirect, hashHistory} from 'react-router';

//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
//import "babel-polyfill";


import 'assets/style/app.less'

import App from 'components/App';

import Home from 'components/pages/common/Home';

//DEMO
import HeroInfoManage from 'components/pages/HeroInfoManage';
import Demo2 from 'components/pages/bindDemo/Demo2';
import Demo3 from 'components/pages/bindDemo/Demo3';



//性能调优工具
//import ReactPerfTool from 'react-perf-tool';
//import 'react-perf-tool/lib/styles.css';
if (process.env.NODE_ENV === 'development') {
    window.Perf = require('react-addons-perf');
}

//无状态组件
// function App(props){
//   return (
//     <div>
//         {React.cloneElement(props.children, {
//                 key: props.location.pathname
//         })}

//     </div>
//   )
// }


ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRedirect to="/home"/>
            <Route path="home" component={Home}/>
            <Route path="/shuihu">
                <Route path="hero/list" component={HeroInfoManage}/>
                <Route path="music/list" component={Demo2}/>
                <Route path="story/list" component={Demo3}/>
            </Route>

        </Route>
    </Router>
), document.getElementById('root'))
