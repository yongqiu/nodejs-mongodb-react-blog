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

$(function () {
    // 获取文章
    $.ajax({
        type: 'GET',
        url: '/api/user/getAllArticle?page=1',
        success: function (result) {
            var articleList = result.data
            var $content = $('.main-content .articleList')
            for (var i = 0; i < articleList.length; i++) {
                $content.append(
                    '<article id=104 class="post">' +
                    '<div class="post-head">' +
                    '<h1 class="post-title">'+ articleList[i].title +'</h1>' +
                    '<div class="post-meta">' +
                    '<span class="author">作者：<a href="#">yongqiu</a></span> &bull;' +
                    '<time class="post-date" datetime="2017年6月24日星期六上午9点33分" title="2017年6月24日星期六上午9点33分">2017年6月24日</time>' +
                    '</div>' +
                    '</div>' +
                    '<div class="featured-media">' +
                    '<a href="#"></a>' +
                    '</div>' +
                    '<div class="post-content">' +
                    '<p>'+ articleList[i].description +'</p>' +
                    '</div>' +
                    '<div class="post-permalink">' +
                    '<a href="#" class="btn btn-default">阅读全文</a>' +
                    '</div>' +
                    '<footer class="post-footer clearfix">' +
                    '<div class="pull-left tag-list">' +
                    '<i class="fa fa-folder-open-o"></i>' +
                    '</div>' +
                    '<div class="pull-right share">' +
                    '</div>' +
                    '</footer>' +
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
            for (var i=0; i<tagArray.length; i++){
                $tagcontent.append(
                    '<a href="javascript:;">'+ tagArray[i] +'</a>'
                )
            }
        }
    })

})