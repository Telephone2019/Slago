(function(){
    //建立命名空间
    let namespace={};
    //帖子模块模板,瀑布流组件
    namespace.mediaStream=[
   '<!--基本容器-->',
   '<div style="width:100%;background-color:rgb((202, 248, 204))">',
   '    <!--作者信息栏-->',
   '    <div style="width:100%;height:80px;background-color:rgb(252,252, 252);display:flex;flex-wrap:wrap;">',
   '        <!--头像框-->',
   '        <div style=" width:70px;height:70px;background-color: rgb(255, 255, 255);margin-left: 15px;border-radius:40px;margin-top: 5px;">',
   '            <!--头像-->',
   '            <img src="{{UserHeadPic}}" style="width:100%;height:100%;border-radius:50%;">',
   '        </div>',
   '        <!--昵称栏-->',
   '        <div style="width:445px;height:80px;background-color:rgb(255, 255, 255);display: flex;align-items: center;margin-left: 10px;">',
   '            <!--昵称文字-->',
   '            <span style="color: #585858;font-size:26px;font-weight: bold;">{{Username}}</span>',
   '        </div>',
   '        <!--关注按钮-->',
   '        <div style="width:70px;height:80px;background-color: rgb(255, 255, 255);display: flex;justify-content: center;align-items: center;">',
   '            <!--是否关注文字-->',
   '            <span style="color:rgb(247, 122, 122);font-size: 24px;">{{aboutlike}}</span>',
   '        </div>',
   '    </div>',
   '    <!--九宫格图片-->',
   '    <div style="width:100%;">',
   '        <!--行-->',
   '        {{#Image}}',
   '            <div style="width:640px;height:230px;background-color: rgb(255, 255, 255);display: flex;justify-content: space-around;align-items: center;">',
   '                <!--图片容器-->',
   '                {{#ImageList}}',
   '                    <div style="width:200px;height:200px;overflow: hidden;display: flex;align-items: center;border-radius: 10px;">',
   '                        <img src="{{.}}" style="width:100%;border-radius:10px;" onclick="IMageClick()" >',
   '                    </div>',
   '                {{/ImageList}}',
   '            </div>',
   '        {{/Image}}',
   '    </div>',
   '    <!--交互栏-->',
   '    <div style="width:100%;height:70px;background-color:rgb(255, 255, 255);display: flex;align-items: center;flex-wrap: wrap;">',
   '        <!--点赞按钮-->',
   '        <div style="width:50px;height:50px;background-color: #ffffff;margin-left: 25px;">',
   '            <img src="{{likePic}}" style="width:100%;height:100%;">',
   '        </div>',
   '        <!--评论按钮-->',
   '        <div style="width:50px;height:50px;background-color:#ffffff;margin-left:40px;">',
   '            <img src="{{messagePic}}" style="width:100%;height:100%;">',
   '        </div>',
   '        <!--收藏按钮-->',
   '        <div style="width:44px;height:44px;background-color: #ffffff;margin-left: 40px;">',
   '            <img src="{{starPic}}" style="width:100%;height:100%;">',
   '        </div>',
   '        <!--三个点-->',
   '        <div style="width:50px;height:50px;background-color: #ffffff;margin-left: 330px;">',
   '            <img src="{{threedotPic}}" style="width:100%;height:100%;">',
   '        </div>',
   '    </div>',
   '</div>',
    ].join("");
    namespace.data={
        UserHeadPic:"https://weiliicimg9.pstatp.com/weili/l/907007723288002647.webp",
        likePic:"http://119.3.180.71/app/img/heart_gray.png",
        messagePic:"http://119.3.180.71/app/img/%E6%B6%88%20%E6%81%AF.png",
        threedotPic:"http://119.3.180.71/app/img/%E4%B8%89%E4%B8%AA%E7%82%B9.png",
        starPic:"http://119.3.180.71/app/img/%E6%94%B6%20%E8%97%8F.png",
        Username:"高万禄",
        aboutlike:"关注",
        Image:[
            {
                ImageList:[
                    "http://119.3.180.71/DataBase/123/img/55.jpg",
                    "http://119.3.180.71/DataBase/123/img/56.jpg",
                    "http://119.3.180.71/DataBase/123/img/57.png"
                ]
            },
            {
                ImageList:[
                    "http://119.3.180.71/DataBase/123/img/55.jpg",
                    "",
                    ""
                ]
            },
        ]
    };
    namespace.getModel=function(){
       console.log(Slagolib.template.engin(this.mediaStream,this.data));
       return Slagolib.template.engin(this.mediaStream,this.data)+Slagolib.template.engin(this.mediaStream,this.data);
    };
    //加入模块
    SlagoModel.FindPage.post_model=namespace;
})();