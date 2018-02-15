$('#keyword').bind('keypress', function(event) {
    if (event.keyCode == "13") $('#btn').click();
});

function hightlightKeyword(str, keyword) {
    let reg = new RegExp(`${keyword}`, 'gi')
    return str.replace(reg, `<span style="color: orange">${keyword}</span>`)
}

$('#btn').click(e => {
    let keyword = $("#keyword").val()
    let reg = new RegExp(`${keyword}`, 'gi')
    chrome.bookmarks.search(keyword, function(res) {
        let len = res.length
        if (len === 0) {
            $('#warning-msg').show()
            $("#bookmark-list").html('')
        } else {
            $('#warning-msg').hide()

            let names = res.reduce((str, node) => {
                let name = hightlightKeyword(node.title, keyword)
                return str + `<li><a href="${node.url}" target="_blank">${name}</a></li>`
            }, '')
            $("#bookmark-list").html(names)
        }
    })
});