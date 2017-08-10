import moment from 'moment';
moment.locale('zh-CN');

export const getFormatTime = (timestamp)=>{
  let time = null
  const now = Date.now()

  if((now - timestamp) < 1*60*1000){
    //小于一分钟
    time = '刚刚'
  }else if((now - timestamp) < 1*60*60*1000){
    //小于1小时
    time = moment(timestamp).startOf('minutes').fromNow()
  }else {
    time = moment(timestamp).format('YYYY-MM-DD,h:mm:ss')
  }
  return time
}
