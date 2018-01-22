$('#input').bind('keypress', function(event) {
    if (event.keyCode == "13") $('#btn').click();
});

// 输入框内容修改时，获取书签

// $('#input').on('input propertychange', () => {
//     $('#btn').click();
// });

$('#btn').click(e => {
    let input = $("#input").val()
    chrome.bookmarks.search(input, function(res) {
        let len = res.length
        if (len === 0) {
            $('#warning-msg').show()
            $("#bookmark-list").html('')
        } else {
            $('#warning-msg').hide()
            let names = res.reduce((str, node) => { return str + `<li><a href="${node.url}" target="_blank">${node.title}</a></li>` }, '')
            $("#bookmark-list").html(names)
        }
    })
});