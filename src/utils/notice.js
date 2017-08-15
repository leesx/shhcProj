import { Button, notification } from 'antd';

const notice = (type='success',info={msg:'通知',desc:''}) => {
  notification[type]({
    message: info.msg,
    description: info.desc,
  });
};

export default notice
