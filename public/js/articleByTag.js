/**
 * Created by yongqiu on 2017/8/2.
 */
/*
 * 获取文章信息
 * */
$(function () {
    var param = getParam();
    var page = Number(param.page)
    var tag = param.tag
    var limit = 5
    // 获取文章
    $.ajax({
        type: 'GET',
        url: '/api/user/getArticleByTag?page='+ page + '&tag='+ tag,
        success: function (result) {
            var articleList = result.atcList
            var totalCount = Math.ceil(result.totalCount/limit)
            var $content = $('.main-content .atcbytag')
            var $pagination = $('.main-content .pagbytag')
            var prepage = page - 1
            var nextpage = page + 1

            var lastpage = totalCount
            if(page == 1){
                $pagination.append(
                    '<span class="page-number">第 1 页 &frasl; 共 '+ totalCount +' 页</span>'+
                    '<a class="older-posts" href="/pageByTags?tag='+tag+'&page=2"><i class="fa fa-angle-right"></i></a>'
                )
            }else if (page == lastpage){
                $pagination.append(
                    '<a class="older-posts" href="/pageByTags?tag='+tag+'&page='+ prepage+'"><i class="fa fa-angle-left"></i></a>'+
                    '<span class="page-number">第 '+ page +' 页 &frasl; 共 '+ totalCount +' 页</span>'
                )
            }else {
                $pagination.append(
                    '<a class="older-posts" href="/pageByTags?tag='+tag+'&page='+ prepage+'"><i class="fa fa-angle-left"></i></a>'+
                    '<span class="page-number">第 '+ page +' 页 &frasl; 共 '+ totalCount +' 页</span>'+
                    '<a class="older-posts" href="/pageByTags?tag='+tag+'&page='+ nextpage +'"><i class="fa fa-angle-right"></i></a>'
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
})