﻿hljs.initHighlightingOnLoad();

$(function() {
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
        },
        autofocus: true
    });

    $('#btn-submit').on('click', function(e) {
        e.preventDefault();
        if (confirm('Submit this post?')) {
            var id = $('#post-id').val();
            var created = new Date($('#created').val());
            var md = editor.value();
            var title = $('#title').val();
            var permalink = $('#permalink').val();

            var post = {
                id: id,
                created: created,
                title: title,
                contents: md,
                category: '',
                tags: '',
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
                if (resp.ok) {
                    location.href = '/';
                }
                else {
                    alert(resp.reason);
                }
            })
            .fail(function(xhr, status) {
                alert(status);
            });
        }
    });
});