hljs.initHighlightingOnLoad();

$(function() {
    var deferredRenderer = null;
    var renderPreview = function(preview, plainText) {
        preview.innerHTML = converter.makeHtml(plainText);
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
        renderingConfig: {
            codeSyntaxHighlighting: true,
        },
        spellChecker: false,
        previewRender: function(plainText, preview) {
            if (deferredRenderer === null) {
                deferredRenderer = setTimeout(renderPreview, 200, preview, plainText);
            }
            return preview.innerHTML;
        }
    });

    $('#btn_submit').on('click', function(e) {
        var id = $('#inp_id').val();
        var created = new Date($('#inp_created').val());
        var md = editor.value();
        var title = $('#inp_title').val();
        var tags = $('#inp_tags').val();
        var permalink = $('#inp_permalink').val();

        var post = {
            id: id,
            created: created,
            title: title,
            contents: md,
            category: '',
            tags: tags,
            permalink: permalink
        };
        $.ajax({
            type: 'POST',
            url: '/api/post/edit',
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