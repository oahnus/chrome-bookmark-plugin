console.log('这是content script!');

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function() {
    // 注入自定义JS
    injectCustomJs();
    // 页面搜索结果的超链接增加 _target="blank"
    var objs = document.querySelectorAll('h3.r a');
    for (var i = 0; i < objs.length; i++) {
        objs[i].setAttribute('_target', 'blank');
    }
    console.log('已处理页面超链接！');
    if (location.host == 'www.baidu.com') {
        function fuckBaiduAD() {
            if (document.getElementById('my_custom_css')) return;
            var temp = document.createElement('style');
            temp.id = 'my_custom_css';
            (document.head || document.body).appendChild(temp);
            var css = `
			/* 移除百度右侧广告 */
			#content_right{display:none;}
			/* 覆盖整个屏幕的相关推荐 */
			.rrecom-btn-parent{display:none;}'
			/* 难看的按钮 */
			.result-op.xpath-log{display:none !important;}`;
            temp.innerHTML = css;
            console.log('已注入自定义CSS！');
            // 屏蔽百度推广信息
            removeAdByJs();
            // 这种必须用JS移除的广告一般会有延迟，干脆每隔一段时间清楚一次
            interval = setInterval(removeAdByJs, 2000);

            // 重新搜索时页面不会刷新，但是被注入的style会被移除，所以需要重新执行
            temp.addEventListener('DOMNodeRemoved', function(e) {
                console.log('自定义CSS被移除，重新注入！');
                if (interval) clearInterval(interval);
                fuckBaiduAD();
            });
        }
        let interval = 0;

        function removeAdByJs() {
            $('[data-tuiguang]').parents('[data-click]').remove();
        }
        fuckBaiduAD();
        // initCustomPanel();
    }
});