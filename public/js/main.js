/**
 * Created by Wu Yongqiu on 2017/6/30.
 */
var $registerbox = $('.registerbox')
var $loginbox = $('.loginbox')
var $welcome = $('.welcome')
var $logout = $('.welcome').find('.logout')
var $userInfo = $welcome.find('.userInfo span')
var $adminTips = $('.admin')
var $notAdmin = $('.notadmin')
var $regInfo = $registerbox.find('.backInfo')
var $loginInfo = $loginbox.find('.backInfo')
var $tags = $('.post-footer .tags')
var $myInfoArticle = $('.myInfo .article')
var $myInfoTags = $('.myInfo .tags')
/*
* 全局方法--获取url后的参数
* */
function getParam() {
    var url = location.search.replace('&','&')
    var param = {}
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            param[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
        }
    }
    return param
}

/*
* 验证cookies
* */
function checkCookies() {
    $.ajax({
        type: 'POST',
        url: '/api/user/cookies',
        data: {},
        dataType: 'json',
        success: function (data) {
            if (data.userId) {
                //有缓存
                $welcome.removeClass('hide');
                $loginbox.addClass('hide');
                $userInfo.empty().html(data.userName)
                if (data.isAdmin) {
                    //是管理员
                    $adminTips.removeClass('hide')
                    $notAdmin.addClass('hide')
                    return
                }
                $notAdmin.removeClass('hide')
                $adminTips.addClass('hide')
            } else {
                //没有缓存
                $loginbox.removeClass('hide');
            }
        }
    });
}
checkCookies();

/*
* 登陆，注册，用户信息显示
* */
$(function () {
    //切换到注册
    $loginbox.find('.replaceToSign').on('click', function () {
        $loginbox.addClass('hide');
        $registerbox.removeClass('hide');
    })
    //切换到登陆
    $registerbox.find('.replaceToLogin').on('click', function () {
        $registerbox.addClass('hide');
        $loginbox.removeClass('hide');
    })
    //退出登录
    $logout.on('click', function () {
        $.ajax({
            type: 'get',
            url: '/api/user/logout',
            success: function (result) {
                if (!result.code) {
                    $welcome.addClass('hide');
                    $loginbox.removeClass('hide');
                }
            }
        })
    })
    //点击注册
    $registerbox.find('button').on('click', function () {
        $.ajax({
            type: 'POST',
            url: '/api/user/register',
            data: {
                username: $registerbox.find('[name="username"]').val(),
                password: $registerbox.find('[name="password"]').val(),
                repassword: $registerbox.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function (result) {
                var message = result.message
                if (result.code !== 0) {
                    $regInfo.empty().html(message)
                    return
                } else {
                    $regInfo.empty().html(message)
                    //登陆成功后显示login面板
                    setTimeout(function () {
                        $registerbox.addClass('hide');
                        $loginbox.removeClass('hide');
                    }, 1000)
                    //还是直接显示信息面板
                    // window.location.reload()
                }
            }
        });
    })

    //点击登陆
    $loginbox.find('button').on('click', function () {
        $.ajax({
            type: 'POST',
            url: '/api/user/login',
            data: {
                username: $loginbox.find('[name="username"]').val(),
                password: $loginbox.find('[name="password"]').val()
            },
            dataType: 'json',
            success: function (result) {
                console.log(result)
                var message = result.message
                if (result.code !== 0) {
                    $loginInfo.empty().html(message)
                    return
                } else {
                    checkCookies();
                    $userInfo.empty().html(result.userInfo.username)
                }
            }
        })
    })

});

/*
* 获取文章信息
* */
$(function () {
    var param = getParam();
    var id = param.id
    var page = 1;
    if(!id){
        page = 1
    }else {
        page = Number(id)
    }
    var limit = 5
    // 获取文章
    $.ajax({
        type: 'GET',
        url: '/api/user/getAllArticle?page='+ page,
        success: function (result) {
            var articleList = result.data
            var totalCount = Math.ceil(result.totalCount/limit)
            var $content = $('.main-content .articleList')
            var $pagination = $('.main-content .pagination')
            var prepage = page - 1
            var nextpage = page + 1

            var lastpage = totalCount
            $myInfoArticle.append(
                '文章<br>'+result.totalCount
            )
            if(page == 1){
                $pagination.append(
                    '<span class="page-number">第 1 页 &frasl; 共 '+ totalCount +' 页</span>'+
                    '<a class="older-posts" href="page?id=2"><i class="fa fa-angle-right"></i></a>'
                )
            }else if (page == lastpage){
                $pagination.append(
                    '<a class="older-posts" href="page?id='+ prepage+'"><i class="fa fa-angle-left"></i></a>'+
                    '<span class="page-number">第 '+ page +' 页 &frasl; 共 '+ totalCount +' 页</span>'
                )
            }else {
                $pagination.append(
                    '<a class="older-posts" href="page?id='+ prepage+'"><i class="fa fa-angle-left"></i></a>'+
                    '<span class="page-number">第 '+ page +' 页 &frasl; 共 '+ totalCount +' 页</span>'+
                    '<a class="older-posts" href="page?id='+ nextpage +'"><i class="fa fa-angle-right"></i></a>'
                )
            }
            for (var i = 0; i < articleList.length; i++) {
                let  markedArticle = marked(articleList[i].description, {
                    renderer: new marked.Renderer(),
                    gfm: true,
                    pedantic: false,
                    sanitize: false,
                    tables: true,
                    breaks: true,
                    smartLists: true,
                    smartypants: true,
                    highlight: function (code) {
                        return hljs.highlightAuto(code).value;
                    }
                })
                var tags = articleList[i].tags
                let tagsList = tags.map(function(value) {
                    return '<a href="#">'+value+'</a>'
                })
                $content.append(
                    '<article id=104 class="post">' +
                    '<div class="post-head">' +
                    '<h1 class="post-title">'+ articleList[i].title +'</h1>' +
                    '<div class="post-meta">' +
                    '<span class="author">作者：<a href="#">yongqiu</a></span> &nbsp;' +
                    '<time class="post-date">'+articleList[i].date+'</time>' +
                    '</div>' +
                    '</div>' +
                    '<div class="featured-media">' +
                    '<a href="#"></a>' +
                    '</div>' +
                    '<div class="post-content">' +
                    '<p>'+ markedArticle +'</p>' +
                    '</div>' +
                    '<div class="post-permalink">' +
                    '<a href="details?id='+ articleList[i]._id +'" class="btn btn-default">阅读全文</a>' +
                    '</div>' +
                   ' <footer class="post-footer clearfix">'+
                        '<div class="pull-left tag-list">'+
                            '<i class="fa fa-folder-open-o"></i>'+
                            '<div class="tags">'+ tagsList +'</div>'+
                        '</div>'+
                        '<div class="pull-right share">'+
                        '</div>'+
                    '</footer>'+
                    '</article>'
                )

            }
        }
    })

    //获取标签
    $.ajax({
        url: '/api/user/getAllTags',
        type: 'GET',
        success: function (result) {
            var tagArray = result.tagArray
            var $tagcontent = $('.tag-cloud')
            $myInfoTags.append(
                '标签<br>'+tagArray.length
            )
            for (var i=0; i<tagArray.length; i++){
                $tagcontent.append(
                    '<a href="javascript:;">'+ tagArray[i] +'</a>'
                )
            }
        }
    })

})