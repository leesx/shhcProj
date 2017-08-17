/*
 * @Author: leesx
 * @Date: 2017-07-06 14:07:23
 * @Last Modified by: leesx
 * @Last Modified time: 2017-07-06 17:09:13
 */

import React, {Component} from 'react';
import {Link} from 'react-router';
import {SVGIcon} from 'components/common'

export default function Home(props) {
    return (
        <div className="home-page">
            <div className="home-hd">
                <h4>水泊梁山</h4>
            </div>
            <div className="home-bd">
								<img className="bind-wm" src={require("assets/img/shhc_01.jpg")}/>
							<div>
								<p>只怕自从你走后，铁狮子一哭会生锈。</p>
								<p>夜风吹透小轩窗，星星月亮全变瘦。</p>
								<p>只怕自从你走后，心里肚里太难受。</p>
								<p>牵挂月月又年年，无眠半宿又一宿。</p>
								<p>何日再相逢？哪天再聚首？</p>
								<p>当面诉别情，花间一壶酒。</p>
								<p>喜鹊连声叫，黄狗轻声吼。</p>
								<p>古桥新流水，蓝天大日头。</p>
							</div>

                {/* <div className="icon-lists">
                    <SVGIcon icon="#icon-ciwei"/>
                    <SVGIcon icon="#icon-xiaoji"/>
                    <SVGIcon icon="#icon-huli"/>
                    <SVGIcon icon="#icon-gongji"/>
                    <SVGIcon icon="#icon-jingyu"/>
                    <SVGIcon icon="#icon-huhou"/>
                    <SVGIcon icon="#icon-nainiu"/>
                    <SVGIcon icon="#icon-kaola"/>
                    <SVGIcon icon="#icon-lu"/>
                    <SVGIcon icon="#icon-hema"/>
                    <SVGIcon icon="#icon-pangxie"/>
                    <SVGIcon icon="#icon-xiongmao"/>
                </div> */}
            </div>

        </div>
    )
}
