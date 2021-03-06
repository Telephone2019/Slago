(function(){
    //建立命名空间
    let namespace={};
    //帖子悬浮页
    namespace.Page=[
    '<div style="width:640px;background-color: rgb(255, 255, 255);">',
    '<!-- 导航栏 -->',
    '<div style="width:640px;height:80px;background-color: rgb(255, 255, 255);align-items: center;display: flex;position: fixed;top:0px;border-bottom: 1px solid rgb(240, 240, 240);">',
    '    <!-- 返回按键 -->',
    '    <div onclick="Slago.PageStack.pop()" style="display: flex;height:100%;align-items: center;margin-left: 10px;">',
    '        <img src="./img/页面栈返回左箭头.png" style="height:40px;width:40px;">',
    '        <div style="height:100%;display: flex;align-items: center;margin-left: 3px;">',
    '            <span style="font-size: 27px;color:#0066cc;">返回</span>',
    '        </div>',
    '    </div>',
    '    <!-- 点赞按钮 -->',
    '    <div style="height:100%;display: flex;align-items: center;margin-left: 330px;">',
    '        <img src="./img/heart_gray.png" style="width:50px;height:50px;">',
    '    </div>',
    '    <!-- 用户头像 -->',
    '    <div style="height:100%;display: flex;align-items: center;">',
    '        <img src="https://weiliicimg9.pstatp.com/weili/l/907007723288002647.webp" ',
    '        style="width:60px;height:60px;border-radius: 30px;margin-left: 60px;"> ',
    '    </div>',
    '</div>',
    '<div style="height:80px;"></div>',
    '<!-- 内容主题 -->',
    '<div style="width:640px;background-color: #ffffff;">',
    '    <!-- 图片瀑布 -->',
    '    <img src="https://icweiliimg1.pstatp.com/weili/l/903716068942282770.webp" style="width:100%;">',
    '    <img src="https://weiliicimg9.pstatp.com/weili/l/919963990356394030.webp" style="width:100%;">',
    '    <img src="https://weiliicimg6.pstatp.com/weili/l/920147325325672571.webp" style="width:100%;">',
    '    <img src="https://icweiliimg1.pstatp.com/weili/l/921007487020695583.webp" style="width:100%;">',
    '    <img src="https://weiliicimg1.pstatp.com/weili/l/919857475167846458.webp" style="width:100%;">',
    '</div>',
    '<!-- 发帖日期 -->',
    '<div style="width:100%;height:30px;background-color: rgb(255, 255, 255);display: flex;align-items: center;border-bottom: 1px #e6e6e6 solid;">',
    '    <span style="height:100%;font-size: 18px;color:#525252;margin-left: 20px;display: flex;align-items: center;">0&nbsp喜欢</span>',
    '    <span style="height:100%;font-size: 18px;color:#525252;margin-left: 400px;display: flex;align-items: center;">2020年12月21日</span>',
    '</div>',
    '<!-- 用户名及描述栏 -->',
    '<div style="width:640px;background-color: #ffffff;display: flex;flex-wrap: wrap;border-bottom: 1px #e6e6e6 solid;">',
    '    <div style="width:100%;display: flex;align-items: center;padding: 10px;flex-wrap: wrap;font-size: 21px;">',
    '        <a href="#" style="text-decoration: none;">高万禄:</a>',
    '        &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp差别比尔别本次恶补比不鄂毕本次，热比八不欸金额不考虑北京河北不承认可比口径',
    '        地方发动机财务科保存文件就不，曾看见外部接口编辑出版科比尽快。',
    '    </div>',
    '</div>',
    '<!-- 评论系统 -->',
    '<div style="width:640px;height:200px;background-color: #ffffff;">',
    '    ',
    '</div>',
    '</div>',
    ].join("");
    namespace.getModel=function(){
        console.log(Slagolib.template.engin(this.Page,{}));
        return Slagolib.template.engin(this.Page,{});
    }
    //加入模块
    SlagoModel.PostSuspensionPage.postPage=namespace;
})();