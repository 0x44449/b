hljs.initHighlightingOnLoad();

$(function() {
    var deferredRenderer = null;
    var renderPreview = function() {
        var md = editor.value();
        var html = converter.makeHtml(md);
        $('#preview_area').html(html);
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
        deferredRenderer = null;
    }

    var converter = new showdown.Converter();
    converter.setFlavor('github');
    converter.setOption('tables', true);

    var editor = new SimpleMDE({
        element: $("#editor")[0],
        previewRender: function(plainText, preview) {
            //setTimeout(function() {
            //    preview.innerHTML = converter.makeHtml(plainText);
            //}, 1000);
            //return "Loading...";

            return converter.makeHtml(plainText);
        }
    });
    editor.codemirror.on('change', function() {
        if (deferredRenderer === null) {
            deferredRenderer = setTimeout(renderPreview, 1000);
        }
    });

    $('#btn_submit').on('click', function(e) {
        var md = editor.value();
        var title = $('#inp_title').val();
        var tags = $('#inp_tags').val();
        var permalink = $('#inp_permalink').val();

        var post = {
            title: title,
            contents: md,
            category: '',
            tags: tags,
            permalink: permalink
        };
        $.ajax({
            type: 'POST',
            url: '/api/post/add',
            data: JSON.stringify(post),
            contentType: "application/json; charset=utf-8",
            xhrFields: {
                withCredentials: true
            }
        })
            .done(function(resp) {
                location.href = '/';
            })
            .fail(function(xhr, status) {

            });
    });
});

$(document).bind('paste', function(e) {
    var clipboardData = e.originalEvent.clipboardData || window.clipboardData;
    var data = clipboardData.getData('Text');
    console.log(data);
});