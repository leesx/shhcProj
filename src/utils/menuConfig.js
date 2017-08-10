/**
 * Created by leesx on 2017/8/2.
 */
const menuConfig = [{
    title   : '水浒人员管理',
    icon    : 'shop',
    key     : 'bindshuihu',
    children: [{
        title: '英雄图谱管理',
        path : 'shuihu/hero/list',
        key  : 'hero',
    }, {
        title: '背景音乐管理',
        path : 'shuihu/music/list',
        key  : 'music',
    }, {
        title: '水浒故事管理',
        path : 'shuihu/story/list',
        key  : 'story',
    }]
}]

export default menuConfig