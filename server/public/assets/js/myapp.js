$(function(){


  var uploadImgName = ''
  $('#fileInput').on('change',function(){
     var oFormData = new FormData()
     oFormData.append('myfile',this.files[0])
    console.log(this.files[0])

    var oFormData = new FormData()

    console.log(this.files[0])

    oFormData.append('myfile',this.files[0])

    var xhr = new XMLHttpRequest()
    xhr.open('post','/article/upload',true)
    xhr.onload = function(){
      if(this.status === 200){

            var data = xhr.responseText
            //console.log(data.imgUrl)
            uploadImgName = data;
            $('#uploadImg').attr('src',data).width(100)
        }
    }
    xhr.send(oFormData)
  })

  //添加文章
  $('#create-article').on('click','.submit',function(){

    var title = $('#title').val().trim()
    var author = $('#author').val().trim()
    var $type = $('#article-type')
    var content = $('#content').val().trim()
    var files = $('#fileInput').val()
    var category = $('#category').val()

    if(!category || !title || !content) return ;


    $.post('/api/articleCreate',{
      category:category,
      title:title,
      author:author,
      type:3,
      content:content,
      img:uploadImgName,
    },function(data){
        if(data.rs == 'ok'){
          alert('添加成功！')
          location.href="/article/list"
        }
    },'json')

  })

  $('#update-article').on('click','.submit',function(){
    var id = $(this).data().id
    var title = $('#title').val().trim()
    var author = $('#author').val().trim()
    var $type = $('#article-type')
    var content = $('#content').val().trim()
    var files = $('#fileInput').val()
    var category = $('#category').val()
    var imgUrl = $('#uploadImg').attr('src')

    if(!title || !content) return ;

    $.post('/api/articleUpdate',{
      id:id,
      category:category,
      title:title,
      author:author,
      type:3,
      content:content,
      img:imgUrl,
    },function(data){
        if(data.rs == 'ok'){
          alert('修改成功！')
          location.href="/article/list"
        }
    },'json')
  })

  // 删除新闻列表
  $('#articles-list').on('click','button.del',function(){

    var data = $(this).data()
    $.post('/article/remove',{id:data.id},function(result){
      if(result.rs){
        location.reload()
      }
    },'json')
  })

  // 添加评论
  $('#submit-comment').on('click',function(){
    var nick = $('#cm-title').val()
    var con = $('#cm-content').val()
    var id=$('#article-id').val()



    if(!nick || !con) return ;
    $(this).parent().addClass('loading')
    $.post('/comment/add',{
      arId:id,
      nick:nick,
      content:con,
      createTime:Date.now()
    },function(result){
      if(result.rs){
        $(this).parent().removeClass('loading')
        setTimeout(function(){
          location.reload()
        },1000)
      }
    })
  })

  //注册
  $('#reg-box').on('click','.submit',function(){
    var $regbox = $('#reg-box')
    var username = $regbox.find('.username').val().trim()
    var password = $regbox.find('.password').val().trim()
    var repassword = $regbox.find('.repassword').val().trim()

    if(!username || !password || !repassword) return false;
    if(password !== repassword){
      alert('输入的密码不同,请确认！')
      return false;
    }
    $.post('/api/reg',{
      username:username,
      password:password
    },function(data){
      if(data.rs){
        alert('注册成功')
        location.href = '/user/login'
      }else{
        alert(data.error)
      }
    },'json')
  })

  //登录
  $('#login-box').on('click','.submit',function(){
    var $regbox = $('#login-box')
    var username = $regbox.find('.username').val().trim()
    var password = $regbox.find('.password').val().trim()

    if(!username || !password ) return false;

    $.post('/api/login',{
      username:username,
      password:password
    },function(data){
      if(data.rs){
        alert('登录成功')
        location.href = '/'
      }else{
        alert(data.error)
      }
    },'json')
  })

  // 搜索
  $(document).on('keyup','#search',function(e){

    if(e.which == 13 && $(this).is(':focus')){
      var keyword = $(this).val().trim()
      location.href="/article/search?keyword="+keyword
    }
  })
  //select 下拉菜单
  $('select.dropdown').dropdown();
  // 添加喜欢
  $('.cards').on('click','i.heart',function(){
    var $this = $(this)
    var id = $this.parents('.card').data().id
    var likes = $this.next().text()*1+1
    $.post('/api/likes',{
      id:id,
      likes:likes
    },function(data){
      if(data.rs){
        $this.next().text(data.likes)
      }
    })
  })
  // 回复
  $('#comments').on('click','.reply-btn',function(){
    $(this).parent().next().toggle().parents('.comment').siblings().find('.reply-box').hide()
  }).on('click','.reply-submit',function(){
    var replyid = $(this).data().replyid
    var replyCont = $(this).prev().find('textarea').val().trim()

    $.post('/api/reply',{
      repId:replyid,
      repCont:replyCont
    },function(data){
      if(data.rs){
        alert('回复成功')
        location.reload()
      }
    })
  })
  //window.UEDITOR_HOME_URL = '/'
  //var ue = UE.getEditor('container');

})
