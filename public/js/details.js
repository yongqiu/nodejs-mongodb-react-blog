$(function () {
    var param = getParam();
    var id = param.id
    //获取文章详情
    $.ajax({
        url: '/admin/api/getArticleDetail?id='+ id,
        type: 'GET',
        success: function (result) {
            var $header = $('.main-content .post-head')
            var $content = $('.main-content .post-content')
            $header.append(
                '<h1 class="post-title">'+ result.title +'</h1>'+
                '<section class="post-meta">'+
                    '<span class="author">作者：<a href="/author/wangsai/">wyq</a></span> •'+
                    '<time class="post-date">'+ result.date +'</time>'+
                '</section>'
            )
            var text = result.description
            let  markedArticle = marked(text, {
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
            $content.append(
                markedArticle
            )
        }
    })
})