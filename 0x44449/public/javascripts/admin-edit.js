hljs.initHighlightingOnLoad();

function onAttachDragStart(e) {
    var md = '![](' + $(e.target).attr('src') + ')';
    e.dataTransfer.setData("text", md);
}

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

    function upload(data) {
        var id = $('#post-id').val();
        $.ajax({
            type: 'POST',
            url: '/api/attach/upload/' + id,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            xhrFields: {
                withCredentials: true
            }
        })
        .done(function(resp) {
            if (resp.ok) {
                for (var i = 0; i < resp.result.length; i++) {
                    var attr = '';
                    attr += '<div class="write-attach-v">';
                    attr += '    <div class="write-attach-delete-wrap">';
                    attr += '        <div class="write-attach-delete" data-path="' + resp.result[i].path + '">Ｘ</div>';
                    attr += '    </div>';
                    attr += '    <img src="/attach/' + resp.result[i].path + '" style="height: 80px; width: 80px;" draggable="true" ondragstart="onAttachDragStart(event)" />';
                    attr += '</div>';
                    $('#attach-list').append(attr);
                }
            }
        });
    }

    $('#btn-file-upload').on('click', function(e) {
        var d = new FormData();
        $.each($('#btn-file-select')[0].files, function(i, file) {
            d.append('attach', file);
        });

        upload(d);
    });

    $('#attach-list').delegate('.write-attach-delete', 'click', function(e) {
        var $this = $(this);
        var path = $this.attr('data-path');
        $.ajax({
            type: 'POST',
            url: '/api/attach/delete/' + path,
            contentType: "application/json; charset=utf-8",
            xhrFields: {
                withCredentials: true
            }
        })
        .done(function(resp) {
            $this.parents('.write-attach-v').remove();
        })
        .fail(function(xhr, status) {
            alert(status);
        });
    });

    $('#attach-list').delegate('.write-attach-v img', 'dblclick', function(e) {
        var $this = $(this);
        var path = $this.attr('src');
        var md = '![](' + path + ')';

        pos = editor.codemirror.getCursor();
        editor.codemirror.setSelection(pos, pos);
        editor.codemirror.replaceSelection(md);
    });
});