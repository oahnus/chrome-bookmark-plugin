$(function() {

    // 加载设置
    var defaultConfig = { color: 'white' }; // 默认配置
    chrome.storage.sync.get(defaultConfig, function(items) {
        document.body.style.backgroundColor = items.color;
    });

    // 初始化国际化
    $('#test_i18n').html(chrome.i18n.getMessage("helloWorld"));

    $('#keyword').focus()
});

// 打开后台页
$('#open_background').click(e => {
    window.open(chrome.extension.getURL('background.html'));
});

// 调用后台JS
$('#invoke_background_js').click(e => {
    var bg = chrome.extension.getBackgroundPage();
    bg.testBackground();
});

// 获取后台页标题
$('#get_background_title').click(e => {
    var bg = chrome.extension.getBackgroundPage();
    alert(bg.document.title);
});

// 设置后台页标题
$('#set_background_title').click(e => {
    var title = prompt('请输入background的新标题：', '这是新标题');
    var bg = chrome.extension.getBackgroundPage();
    bg.document.title = title;
    alert('修改成功！');
});

// 自定义窗体大小
$('#custom_window_size').click(() => {
    chrome.windows.getCurrent({}, (currentWindow) => {
        var startLeft = 10;
        chrome.windows.update(currentWindow.id, {
            left: startLeft * 10,
            top: 100,
            width: 800,
            height: 600
        });
        var inteval = setInterval(() => {
            if (startLeft >= 40) clearInterval(inteval);
            chrome.windows.update(currentWindow.id, { left: (++startLeft) * 10 });
        }, 50);
    });
});

// 最大化窗口
$('#max_current_window').click(() => {
    chrome.windows.getCurrent({}, (currentWindow) => {
        // state: 可选 'minimized', 'maximized' and 'fullscreen' 
        chrome.windows.update(currentWindow.id, { state: 'maximized' });
    });
});


// 最小化窗口
$('#min_current_window').click(() => {
    chrome.windows.getCurrent({}, (currentWindow) => {
        // state: 可选 'minimized', 'maximized' and 'fullscreen' 
        chrome.windows.update(currentWindow.id, { state: 'minimized' });
    });
});

// 打开新窗口
$('#open_new_window').click(() => {
    chrome.windows.create({ state: 'maximized' });
});

// 关闭全部
$('#close_current_window').click(() => {
    chrome.windows.getCurrent({}, (currentWindow) => {
        chrome.windows.remove(currentWindow.id);
    });
});

// 新标签打开网页
$('#open_url_new_tab').click(() => {
    chrome.tabs.create({ url: 'https://www.baidu.com' });
});

// 当前标签打开网页
$('#open_url_current_tab').click(() => {
    getCurrentTabId(tabId => {
        chrome.tabs.update(tabId, { url: 'http://www.so.com' });
    });
});

// 获取当前标签ID
$('#get_current_tab_id').click(() => {
    getCurrentTabId(tabId => {
        alert('当前标签ID：' + tabId);
    });
});

// 高亮tab
$('#highlight_tab').click(() => {
    chrome.tabs.highlight({ tabs: 0 });
});

// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

// 这2个获取当前选项卡id的方法大部分时候效果都一致，只有少部分时候会不一样
function getCurrentTabId2() {
    chrome.windows.getCurrent(function(currentWindow) {
        chrome.tabs.query({ active: true, windowId: currentWindow.id }, function(tabs) {
            if (callback) callback(tabs.length ? tabs[0].id : null);
        });
    });
}

// 向content-script注入JS片段
function executeScriptToCurrentTab(code) {
    getCurrentTabId((tabId) => {
        chrome.tabs.executeScript(tabId, { code: code });
    });
}


// 演示2种方式操作DOM

// 修改背景色
$('#update_bg_color').click(() => {
    executeScriptToCurrentTab('document.body.style.backgroundColor="red";')
});

// 修改字体大小
$('#update_font_size').click(() => {
    sendMessageToContentScript({ cmd: 'update_font_size', size: 42 }, function(response) {});
});

// 显示badge
$('#show_badge').click(() => {
    chrome.browserAction.setBadgeText({ text: 'New' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
});

// 隐藏badge
$('#hide_badge').click(() => {
    chrome.browserAction.setBadgeText({ text: '' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
});

// 显示桌面通知
$('#show_notification').click(e => {
    chrome.notifications.create(null, {
        type: 'image',
        iconUrl: 'img/icon.png',
        title: '祝福',
        message: '骚年，祝你圣诞快乐！Merry christmas!',
        imageUrl: 'img/sds.png'
    });
});

$('#check_media').click(e => {
    alert('即将打开一个有视频的网站，届时将自动检测是否存在视频！');
    chrome.tabs.create({ url: 'http://www.w3school.com.cn/tiy/t.asp?f=html5_video' });
});