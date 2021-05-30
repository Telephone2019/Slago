window.SlagoModel={};
SlagoModel.FindPage={};
SlagoModel.UserPersonal={};
SlagoModel.UserPersonal.UserData={};//个人信息
SlagoModel.AboutPage={};
SlagoModel.PostUpPage={};
SlagoModel.PostSuspensionPage={};
//使用Hbuilder打包app，解决返回按键问题
document.addEventListener('plusready', function() {
    var webview = plus.webview.currentWebview();
    var first = null;
    plus.key.addEventListener('backbutton', function() {
        webview.canBack(function(e) {
            if (e.canBack) {
                webview.back();
            } else {
                //webview.close(); //hide,quit
                //plus.runtime.quit();
                //首页返回键处理
                //处理逻辑：1秒内，连续两次按返回键，则退出应用；
                //首次按键，提示‘再按一次退出应用’
                if (!first) {
                    first = new Date().getTime();
                    setTimeout(function() {
                        first = null;
                    }, 1000);
                } else {
                    if (new Date().getTime() - first < 1400) {
                        plus.runtime.quit();
                    }
                }
            }
        })
    }, false);
    /*沉浸式延伸的问题:状态栏的高度被忽略*/
    plus.webview.currentWebview().setStyle({
        statusbar:{background:'#ff0000'},top:0,bottom: 0
    });
});

/*!
 * Slago.js v0.0.1
 * (c) 2021-2021 Wanlu Gao
 * Released under the MIT License.
 * GitHub  https://github.com/gaowanlu/Slago.js
 */
if (window.Slagolib == undefined) {
    console.log("🍔HELLO Slago.js v0.0.1")
    window.Slagolib = (function () {
        //create namespace for build content of window.Slago
        let namespace = {};
        //模板引擎
        namespace.template = {
            /*Scanner is class for Scanner Object
             *constructor parameter:
             *   template: template String
             */
            Scanner: function (template) {
                this.template = template; //copy template

                this._pointer = 0; //location pointer

                this._tail = this.template; //string that is not scanned

                this.showTemplate = function () {
                    console.log(this.template); //print template string to console
                };

                this.scan = function (flag) { //flag is stop_flag of scan
                    if (this._tail.indexOf(flag) == 0) {
                        //the pointer moves the flag.length backward
                        this._pointer += flag.length;
                        //update _tail
                        this._tail = this.template.substr(this._pointer);
                    }
                };

                this.scanUntil = function (flag) {
                    let start_index = this._pointer;
                    while (this._tail.indexOf(flag) != 0 && !this._over()) {
                        this._pointer++; //move backforward
                        this._tail = this.template.substr(this._pointer);
                    }
                    //return start_index now:_pointer
                    return this.template.substr(start_index, this._pointer - start_index);
                };

                //judge this._tail is null?
                this._over = function () {
                    if (this._pointer >= this.template.length) {
                        return true;
                    } else {
                        return false;
                    }
                };
            }, //END-Scanner class

            /*parseTokens:get nest tokens array
             *build nesttokens
             *function prameter:
             *   template:template string
             */
            parseTokens: function (template) {
                let tokens = [];
                //create scanner
                let scanner = new this.Scanner(template);
                while (!scanner._over()) {
                    let before_flag_words = scanner.scanUntil("{{");
                    tokens.push(['text', before_flag_words]);
                    //step flag.length to _pointer
                    scanner.scan("{{");
                    //get key from {{key}}
                    let center_words = scanner.scanUntil("}}");
                    //delete center_words before and afterblanksapce
                    center_words.replace(/^\s+|\s+$/g, "");
                    switch (center_words[0]) {
                        case '/':
                            tokens.push(['/', center_words.substr(1)]);
                            break;
                        case '#':
                            tokens.push(['#', center_words.substr(1)]);
                            break;
                        case '^':
                            tokens.push(['^', center_words.substr(1)]);
                            break;
                        default:
                            if (center_words) {
                                tokens.push(['name', center_words]);
                            }
                    }
                    scanner.scan("}}");
                }
                //nest tokens  using this.nestTokens function
                return this.nestTokens(tokens);
            },

            /*nestTokens:to nest tokens
             *function parameter:
             *   tokens:tokens
             */
            nestTokens: function (tokens) {
                let nestToken = [];
                let operateStack = [];
                //all push stack
                operateStack.push(nestToken);
                for (let i = 0; i < tokens.length; i++) {
                    //stack is null
                    if (operateStack.length == 0) {
                        break;
                    }
                    switch (tokens[i][0]) {
                        case '#':
                        case '^':
                            operateStack[operateStack.length - 1].push(tokens[i]);
                            tokens[i].push([]);
                            operateStack.push(tokens[i][2]);
                            break;

                        case '/':
                            //出栈
                            operateStack.pop();
                            break;

                        default:
                            //text直接入栈
                            operateStack[operateStack.length - 1].push(tokens[i]);
                            break;
                    }
                }
                return nestToken;
            },

            /*lookup function
             *get object property using stirng to index
             */
            lookup: function (data, keyWords) {
                if (!data || !keyWords) return "";
                //delete before after blankspace
                let deleteBlank = keyWords.replace(/^\s+|\s+$/g, "");

                if (keyWords.indexOf(".") != -1 && keyWords != '.') {
                    let keyWordsArray = deleteBlank.split(".");

                    let temp = data;

                    for (let i = 0; i < keyWordsArray.length; i++) {
                        temp = temp[keyWordsArray[i]];
                    }

                    return temp;
                }

                return data[keyWords];
            },


            /*parseHTML
             *tokens transform HTMLString
             *function parameter:
             *   tokens:nest type tokens
             *   data:template data
             */
            parseHTML: function (tokens, data) {
                let domString = "";

                for (let i = 0; i < tokens.length; i++) {
                    let array = tokens[i];
                    switch (array[0]) {
                        case "text":
                            domString += array[1];
                            break;

                        case "name":
                            domString += this.lookup(data, array[1].toString());
                            break;

                        case "#":
                            domString += this.parseArray(array, data);
                            break;
                        case "^":
                            if (this.lookup(data, array[1].toString())) {
                                domString += this.parseHTML(array[2], data);
                            }
                            break;
                        default:
                            break;
                    }
                }

                return domString;
            },

            /*parseArray
            *process array data，recursion with parseHTML
            *   token such :["#",'student',[]]
            */
            parseArray:function(token,data){
                let resultString = ""; 
                //get the array you want to iterate over
                let circleArray = this.lookup(data, token[1]);

                for (let i = 0; i < circleArray.length; i++) {
                    //Object to merge,merge{'.':circleArray[i]} and circleArray[i]
                    let tempObj = {
                        '.': circleArray[i]
                    };
                    for (let key in circleArray[i]) {
                        tempObj[key] = circleArray[i][key];
                    }
                    resultString += this.parseHTML(token[2], tempObj);
                }
                //{...circleArray[i],'.': circleArray[i]}
                return resultString;
            },

            /*engin：it is interface about template object
             *function parameter:
             *   template:template string
             *   data:template data
             */
            engin: function (template, data) {
                //judge temp is null?
                if (!template || !data || typeof (template) != "string" || typeof (data) != "object") {
                    return ""; //reutrn blank string
                }
                //start engin work
                //get HTMLString nestTokens,data
                return this.parseHTML(this.parseTokens(template), data);
            }
        };//END-namespace.template

        return namespace; //namespace content into window.Slago
    })();
} else {
    console.log("🤣window.Slago already exists");
}

window.Slago = {
    //页面栈
    PageStack: {
        stack: [],
        push: function (div) {
            //如果Stack为空则更新scroll
            if(this.stack.length==0){
                console.log("<<"+parseInt(window.pageYOffset).toString());
                window.Slago.ThreeIndexPage[window.Slago.ThreeIndexPage.lastPage].scroll=parseInt(window.pageYOffset);
            }
            //栈为空，则将Footer不显示
            window.Slago.Footer.none();
            //将上一个页面进行display:none
            if (this.stack.length > 0) {
                this.stack[this.stack.length - 1].scroll = parseInt(window.pageYOffset); //更新浮层顶页scroll
                this.stack[this.stack.length - 1].dom.style.display = "none";
            }
            //入栈
            this.stack.push({
                dom: div,
                scroll: 0
            });
            //插入html
            document.getElementById("Slago.Containner").appendChild(div);
            //是否显示Containner
            if (this.stack.length > 0) {
                document.getElementById("Slago.Containner").style.display = "block";
                //关闭其他页面
                window.Slago.ThreeIndexPage.$closePage();
            }
        },
        pop: function () {
            /*页面返回上一级
             *返回值，上一级还有页面则返回true，否则返回false
             */
            if (this.stack.length > 0) {
                //向右划动动画效果
                window.Slago.PageSwitchAnimation.linearRight();
            } else { //关闭Containner
                this.clear();
                return false;
            }
        },
        clear: function () {
            //将containner全部页面删除
            while (window.Slago.PageStack.stack.length > 0) {
                window.Slago.PageStack.pop();
            }
            //关闭Containner
            document.getElementById("Slago.Containner").style.display = "none";
            //TO lastPage
            window.Slago.ThreeIndexPage.To(window.Slago.ThreeIndexPage.lastPage);
            //显示Footer
            window.Slago.Footer.block();
        },
    }, //End-PageStack
    //向页面栈创建新页面
    CreatePage: function (newnode) {
        let div = document.createElement("div");
        div.style.width = "640px";
        div.style.backgroundColor = "rgba(240, 248, 255, 0)";
        div.style.display = "block";
        div.style.marginLeft = "0px"; //设计页面贴换动画，必须设置为0px
        div.innerHTML = newnode;
        this.PageStack.push(div);
    }, //End-CreatePage

    //四个主界面
    ThreeIndexPage: {
        AboutPage: {
            dom: document.getElementById("Slago.AboutPage"),
            scroll: 0
        },
        FindPage: {
            dom: document.getElementById("Slago.FindPage"),
            scroll: 0
        },
        UserPage: {
            dom: document.getElementById("Slago.UserPage"),
            scroll: 0
        },
        Containner: {
            dom: document.getElementById("Slago.Containner"),
            scroll: 0
        },
        lastPage: "FindPage", //web进入默认页面,lastPage并不存储Containner,lastPage为了从Containner到其他三个容器的过渡
        To: function (Index) {
            this.$closePage();
            if (Index != "Containner") {
                this[Index].dom.style.display = "block";
                this.lastPage = Index;
                //更新页面滑动位置
                window.scrollTo(0, this[this.lastPage].scroll);
                //注意:此处设计To 与 window.Slago.PageStack.clear的递归
                if (window.Slago.PageStack.stack.length > 0) {
                    window.Slago.PageStack.clear();
                }
            }
        },
        $closePage: function () { //关闭现在页面并更新scroll等信息
            //更新scroll
            this[this.lastPage].dom.style.display = "none";
        }
    }, //End-ThreeIndexPage

    //加载悬浮页
    LoadPage:{
        hover:function(){
            this.move();
            //直接推进containner，以fixed形式呈现
            let template=""+
            '<!-- 单个资料信息设置页 -->'+
            '<div style="width:640px;height:100%;background-color: #ffffff00;display: flex;justify-content: center;align-items: center;">'+
            '    <img src="./img/load.gif" style="width:250px;height:200px;display:block;">'+
            '    <img src="./img/pineapple.png" style="width:100px;height:100px;display: none;">'+
            '</div>';
            //创建一个width:640 height：screen.height的div
            let pageNode=document.createElement("div");
            pageNode.style.width="640px";
            pageNode.style.height=window.screen.availHeight.toString()+"px";
            pageNode.style.backgroundColor="#ffffff00";
            pageNode.style.position="fixed";
            pageNode.style.top="0px";
            pageNode.style.zIndex="9999";
            pageNode.id="Slago.LoadHover";
            pageNode.innerHTML=template;
            //添加孩子节点
            document.getElementById("Slago.UI").children[0].appendChild(pageNode);
        },
        move:function(){
            let LoadNode=document.getElementById("Slago.LoadHover");
            if(LoadNode){
                LoadNode.parentNode.removeChild(LoadNode);
            }
        },
        trans:function(){
            let LoadNode=document.getElementById("Slago.LoadHover");
            if(LoadNode){
                LoadNode.children[0].children[0].style.display="none";
                LoadNode.children[0].children[1].style.display="block";
            }
        }
    },

    //框架初始化
    Init: function () {
        //为Footer三个按钮绑定事件
        let FooterIcons = document.getElementsByClassName("Slago.FooterIcon");
        FooterIcons[0].onclick = function () {
            window.Slago.ThreeIndexPage.To("AboutPage");
            document.getElementsByClassName("Slago.FooterIcon")[0].src = "./img/about_blue.png";
            document.getElementsByClassName("Slago.FooterIcon")[1].src = "./img/find_gray.png";
            document.getElementsByClassName("Slago.FooterIcon")[2].src = "./img/home_gray.png";
        };
        FooterIcons[1].onclick = function () {
            window.Slago.ThreeIndexPage.To("FindPage");
            document.getElementsByClassName("Slago.FooterIcon")[0].src = "./img/about_gray.png";
            document.getElementsByClassName("Slago.FooterIcon")[1].src = "./img/find_blue.png";
            document.getElementsByClassName("Slago.FooterIcon")[2].src = "./img/home_gray.png";
        };
        FooterIcons[2].onclick = function () {
            window.Slago.ThreeIndexPage.To("UserPage");
            document.getElementsByClassName("Slago.FooterIcon")[0].src = "./img/about_gray.png";
            document.getElementsByClassName("Slago.FooterIcon")[1].src = "./img/find_gray.png";
            document.getElementsByClassName("Slago.FooterIcon")[2].src = "./img/home_blue.png";
        };
        //劫持返回按键
        window.Slago.HijackReturnButton();
    },


    //footer显示控制
    Footer: {
        none: function () {
            document.getElementById("Slago.Footer").style.display = "none";
            document.getElementById("Slago.FooterBlankSpace").style.display = "none";
        },
        block: function () {
            document.getElementById("Slago.Footer").style.display = "flex";
            document.getElementById("Slago.FooterBlankSpace").style.display = "block";
        }
    },

    //页面切换动画
    PageSwitchAnimation: {
        //线性向右切动画，直接操纵Slago.PageStack
        linearRight: function () {
            let PageStack=Slago.PageStack;
            let nowLeft = parseInt(PageStack.stack[PageStack.stack.length - 1].dom.style.marginLeft);
            if (nowLeft >= 640) {
                //删除页面栈末尾节点
                PageStack.stack[PageStack.stack.length - 1].dom.parentNode.removeChild(PageStack.stack[PageStack.stack.length - 1].dom);
                PageStack.stack.pop(); //弹出数组最后一个元素
                //显示栈顶页面
                if (PageStack.stack.length > 0) {
                    PageStack.stack[PageStack.stack.length - 1].dom.style.display = "block";
                    window.scrollTo(0, PageStack.stack[PageStack.stack.length - 1].scroll);
                    if(PageStack.stack.length==0){//栈为空
                        PageStack.clear();
                    }
                } else { //弹栈后栈为空，则关闭Containner显示其他页面
                    PageStack.clear();
                }
            } else {
                nowLeft+=40;
                //console.log(nowLeft);
                PageStack.stack[PageStack.stack.length - 1].dom.style.marginLeft = nowLeft.toString() + "px";
                //递归
                setTimeout('Slago.PageSwitchAnimation.linearRight()',4);
            }
        }
    },

    //返回按键劫持
    HijackReturnButton:function(){
        window.history.pushState({title:"title",url:"#"},"title","#");
        window.addEventListener("popstate",function(){
            //加载浮层消失
            Slago.LoadPage.move();
            window.Slago.PageStack.pop();//返回上级
            //栈不为空
            if(window.Slago.PageStack.stack.length!=0){
                window.history.pushState({title:"title",url:"#"},"title","#");                
            }//否则应该退出本站了
        },false);
    }
};
//初始化
window.Slago.Init();

(function(){
    //建立命名空间
    let namespace={};
    //发现页
    namespace.template=[
    '<!--页面Header-->',
    '<div style="width:640px;height:150px;position:fixed;background-color:#ffffff;border-bottom:1px rgb(77, 160, 255) solid;">',
    '    <div style="width:640px;height:14px;background-color:#ffffff;"></div>',
    '    <!-- 标题与搜索栏 -->',
    '    <div style="width:640px;height:50%;display: flex;flex-wrap: wrap;">',
    '        <div style="width:140px;background-color:rgb(255, 255, 255);height:100%;',
    '                    font-size:45px;font-weight:bold;display:flex;justify-content: center;',
    '                    align-items: center;color:#11121b;">发现</div>',
    '        <!-- 搜索栏 -->',
    '        <div style="width:500px;height:100%;background-color: rgb(255, 255, 255);display: flex;align-items: center;flex-wrap: wrap;">',
    '            <input type="text" style="width:350px;height:50px;margin-left: 50px;outline:none;text-align: center;',
    '            border-radius: 25px;background-color: rgb(193, 227, 255);font-size: 27px;">',
    '            <img src="./img/搜索.png" class="hoverPointer" style="height:50px;border-top-right-radius: 25px;border-bottom-right-radius:25px ;margin-left: 10px;">',
    '        </div>',
    '    </div>',
    '    <!-- 页面内选择栏 -->',
    '    <div style="width:640px;height:40%;background-color: rgb(255, 255, 255);">',
    '        <!-- 字体栏 -->',
    '        <div style="width:640px;height:80%;background-color: #ffffff;">',
    '            <div style="font-size: 25px;height:100%;color:#0066cc;display: flex;align-items: center;',
    '            margin-left: 23px;">精选</div>',
    '        </div>',
    '        <!-- 滑动条栏 -->',
    '        <div style="width:640px;height:10px;background-color: #ffffff;">',
    '            <div style="width:50px;height:6px;background-color: #0066cc;',
    '            border-radius:3px;margin-left: 24px;"></div>',
    '        </div>',
    '    </div>',
    '</div>',
    '<!--空白-->',
    '<div style="height:150px;width:640px;"></div>'
    ].join("");
    namespace.getModel=function(){
       return Slagolib.template.engin(this.template,{});
    };
    //加入模块
    SlagoModel.FindPage.Header=namespace;
})();

(function(){
    //建立命名空间
    let namespace={};
    //帖子模块模板,瀑布流组件
    namespace.mediaStream=[
   '<!--基本容器-->',
   '<div style="width:100%;background-color:rgb((202, 248, 204))">',
   '    <!--作者信息栏-->',
   '    <div style="width:100%;height:80px;background-color:rgb(255,255, 255);display:flex;flex-wrap:wrap;">',
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
        likePic:"./img/heart_gray.png",
        messagePic:"./img/消 息.png",
        threedotPic:"./img/三个点.png",
        starPic:"./img/收 藏.png",
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
       //console.log(Slagolib.template.engin(this.mediaStream,this.data));
       return Slagolib.template.engin(this.mediaStream,this.data)+Slagolib.template.engin(this.mediaStream,this.data);
    };
    //加入模块
    SlagoModel.FindPage.post_model=namespace;
})();

(function(){
    //建立命名空间
    let namespace={};
    //发现页
    namespace.template=[
    '<!--页面容器-->',
    '<div style="width:640px;background-color:#ffffff;">',
    '    <!--页面Header-->',
    '    {{HeaderTemplate}}',
    '    <!--帖子流-->',
    '    {{PostStream}}',
    '</div>',
    ].join("");
    namespace.data={
        HeaderTemplate:SlagoModel.FindPage.Header.getModel(),//获得导航栏
        PostStream:SlagoModel.FindPage.post_model.getModel(),//获得帖子流
    }
    namespace.getModel=function(){
       return Slagolib.template.engin(this.template,this.data);
    };
    //加入模块
    SlagoModel.FindPage.findPage=namespace;
})();

(function(){
    //建立命名空间
    let namespace={};
    //帖子悬浮页
    namespace.Page=[
    '<div style="width:640px;background-color: rgb(255, 255, 255);">',
    '<!-- 导航栏 -->',
    '<div style="width:640px;height:80px;background-color: rgb(255, 255, 255);align-items: center;display: flex;position: fixed;top:0px;border-bottom: 1px solid rgb(240, 240, 240);">',
    '    <!-- 返回按键 -->',
    '    <div class="hoverPointer" onclick="Slago.PageStack.pop()" style="display: flex;height:100%;align-items: center;margin-left: 10px;">',
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
        //console.log(Slagolib.template.engin(this.Page,{}));
        return Slagolib.template.engin(this.Page,{});
    }
    //加入模块
    SlagoModel.PostSuspensionPage.postPage=namespace;
})();

(function(){
    //建立命名空间
    let namespace={};
    //渲染页
    namespace.Page=[
        '<!-- 用户主页选项栏 -->',
        '<div style="width:640px;height:500px;background-color: rgb(255, 255, 255);">',
        '    <!-- 个人资料设置 -->',
        '    <div class="hoverPointer" style="width:640px;height:100px;background-color: #ffffff;margin-top: 30px;display: flex;',
        '    border-bottom:1px solid #dfdfdf ;" onclick="SlagoModel.UserPersonal.UserData.userDataPage.show()">',//点击显示资料设置页面
        '        <!-- icon -->',
        '        <div style="width:120px;height:100%;background-color: rgb(255, 255, 255);display: flex;align-items: center;">',
        '            <img src="./img/展示信息设置.png" style="height:50%;margin-left: 30px;">',
        '        </div>',
        '        <!-- 字体 -->',
        '        <div style="width:200px;background-color: rgb(255, 255, 255);',
        '        display: flex;align-items:center;font-size: 26px;font-weight:700;color: rgb(68, 68, 68);',
        '        margin-left: 20px;',
        '        ">',
        '            个人信息',
        '        </div>',
        '        <!-- 右箭头icon -->',
        '        <div style="width:120px;height:100%;background-color: rgb(255, 255, 255);margin-left: 175px;">',
        '            <img src="./img/箭头_右.png" style="height:50%;margin-top: 20%;margin-left: 60px;">',
        '        </div>',
        '    </div>',
        '    <!-- 帖子 -->',
        '    <div class="hoverPointer" style="width:640px;height:100px;background-color: #ffffff;margin-top: 30px;display: flex;',
        '    border-top: 1px solid #dfdfdf;border-bottom:1px solid #dfdfdf ;" onclick="SlagoModel.UserPersonal.PersonalPostPage.show()">',//点击显示帖子页面
        '        <!-- icon -->',
        '        <div style="width:120px;height:100%;background-color: rgb(255, 255, 255);display: flex;align-items: center;">',
        '            <img src="./img/ts-picture.png" style="height:42%;margin-left: 34px;">',
        '        </div>',
        '        <!-- 字体 -->',
        '        <div style="width:200px;background-color: rgb(255, 255, 255);',
        '        display: flex;align-items:center;font-size: 26px;font-weight:700;color: rgb(68, 68, 68);',
        '        margin-left: 20px;',
        '        ">',
        '            帖子',
        '        </div>',
        '        <!-- 右箭头icon -->',
        '        <div style="width:120px;height:100%;background-color: rgb(255, 255, 255);margin-left: 175px;">',
        '            <img src="./img/箭头_右.png" style="height:50%;margin-top: 20%;margin-left: 60px;">',
        '        </div>',
        '    </div>',
        '    <!-- 成就 -->',
        '    <div class="hoverPointer" style="width:640px;height:100px;background-color: #ffffff;margin-top: 10px;display: flex;',
        '    border-bottom:1px solid #dfdfdf ;" onclick="SlagoModel.UserPersonal.PersonalAchievementPage.show()">',//点击显示个人成就页面
        '        <!-- icon -->',
        '        <div style="width:120px;height:100%;background-color: rgb(255, 255, 255);display: flex;align-items: center;">',
        '            <img src="./img/ts-planet.png" style="height:40%;margin-left: 30px;">',
        '        </div>',
        '        <!-- 字体 -->',
        '        <div style="width:200px;background-color: rgb(255, 255, 255);',
        '        display: flex;align-items:center;font-size: 26px;font-weight:700;color: rgb(68, 68, 68);',
        '        margin-left: 20px;',
        '        ">',
        '            成就',
        '        </div>',
        '        <!-- 右箭头icon -->',
        '        <div style="width:120px;height:100%;background-color: rgb(255, 255, 255);margin-left: 175px;">',
        '            <img src="./img/箭头_右.png" style="height:50%;margin-top: 20%;margin-left: 60px;">',
        '        </div>',
        '    </div>',
        '    <!-- 更多 -->',
        '    <div class="hoverPointer" style="width:640px;height:100px;background-color: #ffffff;margin-top: 10px;display: flex;" onclick="SlagoModel.UserPersonal.MorePage.show()">',//点击显示更多页面
        '        <!-- icon -->',
        '        <div style="width:120px;height:100%;background-color: rgb(255, 255, 255);display: flex;align-items: center;">',
        '            <img src="./img/ts-star-2.png" style="height:45%;margin-left: 33px;">',
        '        </div>',
        '        <!-- 字体 -->',
        '        <div style="width:200px;background-color: rgb(255, 255, 255);',
        '        display: flex;align-items:center;font-size: 26px;font-weight:700;color: rgb(68, 68, 68);',
        '        margin-left: 20px;',
        '        ">',
        '            更多',
        '        </div>',
        '        <!-- 右箭头icon -->',
        '        <div style="width:120px;height:100%;background-color: rgb(255, 255, 255);margin-left: 175px;">',
        '            <img src="./img/箭头_右.png" style="height:50%;margin-top: 20%;margin-left: 60px;">',
        '        </div>',
        '    </div>',
        '</div>',
    ].join("");
    namespace.getModel=function(){
        return Slagolib.template.engin(this.Page,{});
    }
    //加入模块
    SlagoModel.UserPersonal.PersonalPageOptionsComponent=namespace;
})();

(function(){
    //建立命名空间
    let namespace={};
    //渲染页
    namespace.Page=[
    '<!-- 用户个人页面 -->',
    '<div style="width:640px;background-color: rgb(255, 255, 255);">',
    '    <!-- 用户信息块\昵称\关注\粉丝\头像等元素 -->',
    '    <div style="width:620px;',
    '                height:200px;margin-left: 10px;',
    '                display: flex;flex-wrap: wrap;justify-content: space-around;',
    '                align-items: center;margin-top: 30px;',
    '                ">',
    '        <!-- 头像 -->',
    '        <div style="width:140px;height:140px;',
    '                    background-color:rgb(255, 255, 255);',
    '                    border-radius:80px;">',
    '            <img src="https://weiliicimg9.pstatp.com/weili/l/907007723288002647.webp"',
    '                style="width:100%;height:100%;border-radius:50%;">',
    '        </div>',
    '        <!-- 个人成就 -->',
    '        <div style="width:440px;height:140px;">',
    '            <!-- 用户名 -->',
    '            <div style="width:100%;',
    '                        height:70px;',
    '                        background-color:rgb(255, 255, 255);',
    '                        display:flex;',
    '                        justify-content:center;',
    '                        align-items:center;',
    '                        font-size: 27px;',
    '                        color:rgb(68,68,68);">',
    '                <p>高万禄</p>',
    '            </div>',
    '            <!-- 成就栏 -->',
    '            <div style="width:100%;',
    '                        height:70px;',
    '                        background-color:rgb(255, 255, 255);',
    '                        display: flex;',
    '                        justify-content:center;',
    '                        align-items: center;',
    '                        font-size: 24px;',
    '                        color:rgb(68,68,68);">',
    '                <p>12 关注 3k 粉丝 5w 喜欢</p>',
    '            </div>',
    '        </div>',
    '    </div>',
    '{{PersonalPageOptionsComponent}}',//选项组件
    '</div>'
    ].join("");
    namespace.getModel=function(){
        let data={
            PersonalPageOptionsComponent:SlagoModel.UserPersonal.PersonalPageOptionsComponent.getModel(),
        }
        return Slagolib.template.engin(this.Page,data);
    }
    //加入模块
    SlagoModel.UserPersonal.my_page=namespace;
})();

(function(){
    //建立命名空间
    let namespace={};
    //渲染页
    namespace.Page=[
        '<!-- 个人帖子页组件 -->',
        '<div style="width:640px;background-color: #ffffff;height:500px;">',
        '    <!-- 导航栏 -->',
        '    <div',
        '        style="width:640px;height:80px;background-color: rgb(255, 255, 255);align-items: center;display: flex;position: fixed;top:0px;border-bottom: 1px solid rgb(77, 160, 255);">',
        '        <!-- 返回按键 -->',
        '        <div class="hoverPointer" onclick="Slago.PageStack.pop()"',
        '            style="display: flex;height:100%;align-items: center;margin-left: 10px;">',
        '            <img src="./img/页面栈返回左箭头.png" style="height:40px;width:40px;">',
        '            <div style="height:100%;display: flex;align-items: center;margin-left: 3px;">',
        '                <span style="font-size: 27px;color:#0066cc;">返回</span>',
        '            </div>',
        '        </div>',
        '        <!--导航栏字体栏-->',
        '        <div style="width:300px;height:100%;background-color:#ffffff;margin-left:66px;display:flex;align-items:center;justify-content: center;font-size:27px;">',
        '           帖子',
        '        </div>',
        '    </div>',
        '    <div style="height:80px;"></div>',
        '</div>',
    ].join("");
    namespace.getModel=function(){
        return Slagolib.template.engin(this.Page,{});
    }
    namespace.show=function(){
        //创建页面,推入页面栈
        Slago.CreatePage(this.getModel());
    }
    //加入模块
    SlagoModel.UserPersonal.PersonalPostPage=namespace;
})();

(function(){
    //建立命名空间
    let namespace={};
    //渲染页
    namespace.Page=[
        '<!-- 个人成就页组件 -->',
        '<div style="width:640px;background-color: #ffffff;height:500px;">',
        '    <!-- 导航栏 -->',
        '    <div',
        '        style="width:640px;height:80px;background-color: rgb(255, 255, 255);align-items: center;display: flex;position: fixed;top:0px;border-bottom: 1px solid rgb(77, 160, 255);">',
        '        <!-- 返回按键 -->',
        '        <div class="hoverPointer" onclick="Slago.PageStack.pop()"',
        '            style="display: flex;height:100%;align-items: center;margin-left: 10px;">',
        '            <img src="./img/页面栈返回左箭头.png" style="height:40px;width:40px;">',
        '            <div style="height:100%;display: flex;align-items: center;margin-left: 3px;">',
        '                <span style="font-size: 27px;color:#0066cc;">返回</span>',
        '            </div>',
        '        </div>',
        '        <!--导航栏字体栏-->',
        '        <div style="width:300px;height:100%;background-color:#ffffff;margin-left:66px;display:flex;align-items:center;justify-content: center;font-size:27px;">',
        '           成就',
        '        </div>',
        '    </div>',
        '    <div style="height:80px;"></div>',
        '</div>',
    ].join("");
    namespace.getModel=function(){
        return Slagolib.template.engin(this.Page,{});
    }
    namespace.show=function(){
        //创建页面,推入页面栈
        Slago.CreatePage(this.getModel());
    }
    //加入模块
    SlagoModel.UserPersonal.PersonalAchievementPage=namespace;
})();

(function(){
    //建立命名空间
    let namespace={};
    //渲染页
    namespace.Page=[
    '    <!-- 更多页面 -->',
    '    <div style="width:640px;height:{{screenHeight}}px;background-image: linear-gradient(#0066cc, #ffffff);">',
    '    <!-- 导航栏 -->',
    '    <div',
    '        style="width:640px;height:80px;background-color: rgb(255, 255, 255);align-items: center;display: flex;position: fixed;top:0px;border-bottom: 1px solid rgb(77, 160, 255);">',
    '        <!-- 返回按键 -->',
    '        <div class="hoverPointer" onclick="Slago.PageStack.pop()"',
    '            style="display: flex;height:100%;align-items: center;margin-left: 10px;">',
    '            <img src="./img/页面栈返回左箭头.png" style="height:40px;width:40px;">',
    '            <div style="height:100%;display: flex;align-items: center;margin-left: 3px;">',
    '                <span style="font-size: 27px;color:#0066cc;">返回</span>',
    '            </div>',
    '        </div>',
    '        <!--导航栏字体栏-->',
    '        <div style="width:300px;height:100%;background-color:#ffffff;margin-left:66px;display:flex;align-items:center;justify-content: center;font-size:27px;">',
    '           更多',
    '        </div>',
    '    </div>',
    '    <div style="height:80px;"></div>',
    '         <div style="width: 640px;height:150px;color:#ffffff;font-size: 50px;font-weight: lighter;',
    '         display: flex;justify-content: center;align-items: center;">',
    '            图享',
    '         </div>',
    '         <div style="width:640px;display: flex;justify-content: center;',
    '         font-size: 25px;color: #ffffff;flex-wrap: wrap;">',
    '            <div style="width:100%;display: flex;justify-content: center;">分享生活乐趣</div>',
    '            <ul style="margin-top: 50px;">',
    '                <li>版权:<a href="https://github.com/gaowanlu/Slago" style="color:black;" target="_blank">GitHub开源项目</a></li>',
    '                <li style="margin-top: 20px;">关于我们:图享起始于2021年个人开源前端项目</li>',
    '                <li style="margin-top: 20px;">开发者:高万禄</li>',
    '                <li style="margin-top: 20px;">联系我们:heizuboriyo@gmail</li>',
    '                <li style="margin-top: 20px;">地址:桂林电子科技大学(花江校区)</li>',
    '                <li style="margin-top: 20px;">版本:v0.0.1</li>',
    '            </ul>',
    '         </div>',
    '    </div>',
    ].join("");
    namespace.getModel=function(){
        return Slagolib.template.engin(this.Page,{screenHeight:screen.availHeight});
    }
    namespace.show=function(){
        //创建页面,推入页面栈
        Slago.CreatePage(this.getModel());
    }
    //加入模块
    SlagoModel.UserPersonal.MorePage=namespace;
})();

(function(){
    //建立命名空间
    let namespace={};
    //渲染页
    namespace.Page=[
    '    <!-- 个人资料页 -->',
    '    <div style="width:640px;background-color: rgb(255, 255, 255);">',
    '       <!-- 导航栏 -->',
    '       <div',
    '           style="width:640px;height:80px;background-color: rgb(255, 255, 255);align-items: center;display: flex;position: fixed;top:0px;border-bottom: 1px solid rgb(77, 160, 255);">',
    '           <!-- 返回按键 -->',
    '           <div class="hoverPointer" onclick="Slago.PageStack.pop()"',
    '               style="display: flex;height:100%;align-items: center;margin-left: 10px;">',
    '               <img src="./img/页面栈返回左箭头.png" style="height:40px;width:40px;">',
    '               <div style="height:100%;display: flex;align-items: center;margin-left: 3px;">',
    '                   <span style="font-size: 27px;color:#0066cc;">返回</span>',
    '               </div>',
    '           </div>',
    '           <!--导航栏字体栏-->',
    '           <div style="width:300px;height:100%;background-color:#ffffff;margin-left:66px;display:flex;align-items:center;justify-content: center;font-size:27px;">',
    '           个人信息',
    '           </div>',
    '       </div>',
    '       <div style="height:80px;width:100%;"></div>',
    '        <!-- 头像栏 -->',
    '        <div class="hoverPointer" onclick="SlagoModel.UserPersonal.UserData.userDataPage.HeadImgSeting(this)" style="width:640px;height:130px;background-color:#ffffff ;display: flex;">',
    '            <!-- 字体提示栏 -->',
    '            <div style="width:150px;height:130px;background-color: rgb(255, 255, 255);',
    '            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
    '                头像',
    '            </div>',
    '            <!-- 主题内容 -->',
    '            <div style="width:420px;height:100%;background-color: rgb(255, 255, 255);">',
    '                <!-- 头像图片 -->',
    '                <img style="width:100px;height:100px;border-radius: 5px;margin-top: 15px;margin-left: 315px;" src="https://weiliicimg9.pstatp.com/weili/l/907007723288002647.webp">',
    '            </div>',
    '            <!-- 右箭头 -->',
    '            <div style="height: 100%;width:40px;background-color: rgb(255, 255, 255);display: flex;justify-content: center;align-items: center;">',
    '                <img src="./img/箭头_右.png" style="width:40px;">',
    '            </div>',
    '            <input type="file" accept="image/*" style="display: none;">',
    '        </div>',

    '        <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
    '        <!-- 昵称栏 -->',
    '        <div onclick="SlagoModel.UserPersonal.UserData.nameSetingPage.show()" class="hoverPointer" style="width:640px;height:100px;background-color: #ffffff;display: flex;">',
    '            <!-- 字体提示栏 -->',
    '            <div style="width:150px;height:100px;background-color: rgb(255, 255, 255);',
    '            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
    '                昵称',
    '            </div>',
    '            <!-- 主题内容 -->',
    '            <div style="width:420px;height:100%;background-color: rgb(255, 255, 255);">',
    '                <div style="height:100%;width:400px;margin-left: 15px;display: flex;align-items: center;justify-content: flex-end;font-size: 20px;color:#707070;overflow: hidden;">',
    '                    高万禄',
    '                </div>',
    '            </div>',
    '            <!-- 右箭头 -->',
    '            <div style="height: 100%;width:40px;background-color: rgb(255, 255, 255);display: flex;justify-content: center;align-items: center;">',
    '                <img src="./img/箭头_右.png" style="width:40px;">',
    '            </div>',
    '        </div>',
    '        <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
    '        <!-- 账号栏 -->',
    '        <div class="hoverPointer" style="width:640px;height:100px;background-color: #ffffff;display: flex;">',
    '            <!-- 字体提示栏 -->',
    '            <div style="width:150px;height:100px;background-color: rgb(255, 255, 255);',
    '            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
    '                图享号',
    '            </div>',
    '            <!-- 主题内容 -->',
    '            <div style="width:420px;height:100%;background-color: rgb(255, 255, 255);">',
    '                <div style="height:100%;width:400px;margin-left: 15px;display: flex;align-items: center;justify-content: flex-end;font-size: 20px;color:#707070;overflow: hidden;">',
    '                    00001',
    '                </div>',
    '            </div>',
    '            <!-- 右箭头 -->',
    '            <div style="height: 100%;width:40px;background-color: rgb(255, 255, 255);display: flex;justify-content: center;align-items: center;">',
    '                <img src="./img/箭头_右.png" style="width:40px;">',
    '            </div>',
    '        </div>',
    '        <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
    '        <!-- 性别 -->',
    '        <div class="hoverPointer" onclick="SlagoModel.UserPersonal.UserData.sexSetingPage.show()" style="width:640px;height:100px;background-color: #ffffff;display: flex;">',
    '            <!-- 字体提示栏 -->',
    '            <div style="width:150px;height:100px;background-color: rgb(255, 255, 255);',
    '            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
    '                性别',
    '            </div>',
    '            <!-- 主题内容 -->',
    '            <div style="width:420px;height:100%;background-color: rgb(255, 255, 255);">',
    '                <div style="height:100%;width:400px;margin-left: 15px;display: flex;align-items: center;justify-content: flex-end;font-size: 20px;color:#707070;overflow: hidden;">',
    '                    男',
    '                </div>',
    '            </div>',
    '            <!-- 右箭头 -->',
    '            <div style="height: 100%;width:40px;background-color: rgb(255, 255, 255);display: flex;justify-content: center;align-items: center;">',
    '                <img src="./img/箭头_右.png" style="width:40px;">',
    '            </div>',
    '        </div>',
    '        <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
    '        <!-- 个性签名 -->',
    '        <div class="hoverPointer"  style="width:640px;height:100px;background-color: #ffffff;display: flex;">',
    '            <!-- 字体提示栏 -->',
    '            <div style="width:150px;height:100px;background-color: rgb(255, 255, 255);',
    '            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
    '                个性签名',
    '            </div>',
    '            <!-- 主题内容 -->',
    '            <div style="width:420px;height:100%;background-color: rgb(255, 255, 255);">',
    '                <div style="height:100%;width:400px;margin-left: 15px;display: flex;align-items: center;justify-content: flex-end;font-size: 20px;color:#707070;overflow: hidden;">',
    '                    你好生活需要努力，加油!',
    '                </div>',
    '            </div>',
    '            <!-- 右箭头 -->',
    '            <div style="height: 100%;width:40px;background-color: rgb(255, 255, 255);display: flex;justify-content: center;align-items: center;">',
    '                <img src="./img/箭头_右.png" style="width:40px;">',
    '            </div>',
    '        </div>',
    '    </div>',
    ].join("");

    //头像设置
    namespace.HeadImgSeting=function(dom){
        let input=dom.children[dom.children.length-1];
        //input添加状态改变事件
        input.onchange=function(){
            //获得input下面的头像img节点
            let imgNode=this.parentNode.children[1].children[0];
            //检测图像文件是否选择
            if(this.files!=undefined&&this.files.length>0&&this.files&&this.files[0]){
                if(this.files[0].getAsDataURL){
                    imgNode.src=this.files[0].getAsDataURL;
                    Slago.LoadPage.hover();//进行悬浮层
                }else{
                    imgNode.src=window.URL.createObjectURL(this.files[0]);
                    Slago.LoadPage.hover();//进行悬浮层
                }
            }else if(input_file.value){
                imgNode.src=input_file.value;
                Slago.LoadPage.hover();//进行悬浮层
            }
        }
        //点击表单
        input.click();
    };
    namespace.getModel = function () {
        return Slagolib.template.engin(this.Page, {});
    }
    namespace.show = function () {
        //创建页面,推入页面栈
        Slago.CreatePage(namespace.getModel());
    }
    //加入模块
    SlagoModel.UserPersonal.UserData.userDataPage=namespace;
})();

(function(){
    //建立命名空间
    let namespace={};
    //渲染页
    namespace.Page=[
    '    <!-- 单个资料信息设置页 -->',
    '    <div style="width:640px;height:600px;background-color: #ffffff;">',
    '        <!-- 导航栏 -->',
    '        <div',
    '            style="width:640px;height:80px;background-color: rgb(255, 255, 255);align-items: center;display: flex;position: fixed;top:0px;border-bottom: 1px solid rgb(77, 160, 255);">',
    '            <!-- 返回按键 -->',
    '            <div class="hoverPointer" onclick="Slago.PageStack.pop()"',
    '                style="display: flex;height:100%;align-items: center;margin-left: 10px;">',
    '                <img src="./img/页面栈返回左箭头.png" style="height:40px;width:40px;">',
    '                <div style="height:100%;display: flex;align-items: center;margin-left: 3px;">',
    '                    <span style="font-size: 27px;color:#0066cc;">返回</span>',
    '                </div>',
    '            </div>',
    '            <!--导航栏字体栏-->',
    '            <div',
    '                style="width:300px;height:100%;background-color:#ffffff;margin-left:66px;display:flex;align-items:center;justify-content: center;font-size:27px;">',
    '                昵称',
    '            </div>',
    '        </div>',
    '        <div style="height:80px;width:100%;"></div>',
    '        <!-- 昵称设置栏 -->',
    '                <!-- 昵称栏 -->',
    '                <div onclick="SlagoModel.UserPersonal.UserData.nameSetingPage.inputClick(this)" class="hoverPointer" style="width:640px;height:100px;background-color: #ffffff;display: flex;">',
    '                    <!-- 字体提示栏 -->',
    '                    <div style="width:150px;height:100px;background-color: rgb(255, 255, 255);',
    '                    display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
    '                        昵称',
    '                    </div>',
    '                    <!-- 主题内容 -->',
    '                    <div style="width:420px;height:100%;background-color: rgb(255, 255, 255);">',
    '                        <div style="background-color:rgb(255, 255, 255);height:100%;width:400px;margin-left: 15px;display: flex;align-items: center;justify-content: flex-end;font-size: 20px;color:#707070;overflow: hidden;">',
    '                            <!-- 输入框 -->',
    '                            <input type="text" style="width:100%;height:80%;',
    '                            outline: none;text-align: right;font-size: 25px;color:#1f1f1f;',
    '                            caret-color: #0066cc;" value="高万禄">',
    '                        </div>',
    '                    </div>',
    '                    <!-- 右箭头 -->',
    '                    <div style="height: 100%;width:40px;background-color: rgb(255, 255, 255);display: flex;justify-content: center;align-items: center;">',
    '                        <img src="./img/箭头_右.png" style="width:40px;">',
    '                    </div>',
    '                </div>',
    '            <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
    '            <!-- 保存按钮栏 -->',
    '            <div style="width:640px;height:100px;background-color: #ffffff;margin-top: 40px;">',
    '               <div class="hoverPointer" onclick="SlagoModel.UserPersonal.UserData.nameSetingPage.submit(this)" style="width:120px;height:60px;border-radius:30px;',
    '                            background-color: #0066cc;color: #ffffff;display: flex;',
    '                            justify-content: center;align-items: center;font-size: 24px;margin-left: 505px;">',
    '               保存',
    '               </div>',
    '            </div>',
    '    </div>',
    ].join("");
    namespace.inputClick=function(dom){
        let input=dom.children[1].children[0].children[0];
        input.click();
    }
    namespace.getModel=function(){
        return Slagolib.template.engin(this.Page,{});
    }
    namespace.show=function(){
        //创建页面,推入页面栈
        Slago.CreatePage(this.getModel());
    }
    namespace.submit=function(dom){
        Slago.LoadPage.hover();
    }
    //加入模块
    SlagoModel.UserPersonal.UserData.nameSetingPage=namespace;
})();

(function () {
    //建立命名空间
    let namespace = {};
    //渲染页
    namespace.Page = [
        '    <!-- 性别设置界面 -->',
        '    <div style="width:640px;background-color: rgb(255, 255, 255);">',
        '        <!-- 单个资料信息设置页 -->',
        '        <div style="width:640px;background-color: #ffffff;">',
        '            <!-- 导航栏 -->',
        '            <div',
        '                style="width:640px;height:80px;background-color: rgb(255, 255, 255);align-items: center;display: flex;position: fixed;top:0px;border-bottom: 1px solid rgb(77, 160, 255);">',
        '                <!-- 返回按键 -->',
        '                <div class="hoverPointer" onclick="Slago.PageStack.pop()"',
        '                    style="display: flex;height:100%;align-items: center;margin-left: 10px;">',
        '                    <img src="./img/页面栈返回左箭头.png" style="height:40px;width:40px;">',
        '                    <div style="height:100%;display: flex;align-items: center;margin-left: 3px;">',
        '                        <span style="font-size: 27px;color:#0066cc;">返回</span>',
        '                    </div>',
        '                </div>',
        '                <!--导航栏字体栏-->',
        '                <div',
        '                    style="width:300px;height:100%;background-color:#ffffff;margin-left:66px;display:flex;align-items:center;justify-content: center;font-size:27px;">',
        '                    性别',
        '                </div>',
        '            </div>',
        '            <div style="height:80px;width:100%;"></div>',
        '            <!-- 性别设置栏 -->',
        '',
        '',
        '            <!-- 男 -->',
        '            <div id="SlagoModel.UserPersonal.UserData.sexSetingPage.man" ',
        'onclick = "SlagoModel.UserPersonal.UserData.sexSetingPage.choose(this)" class= "hoverPointer"',
        '                style="width:640px;height:100px;background-color: #b4dafd;display: flex;">',
        '                <!-- 字体提示栏 -->',
        '                <div style="width:150px;height:100px;',
        '                            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
        '                    男',
        '                </div>',
        '                <!-- 右箭头 -->',
        '                <div',
        '                    style="margin-left:420px;height: 100%;width:40px;display: flex;justify-content: center;align-items: center;">',
        '                    <img src="./img/箭头_右.png" style="width:40px;">',
        '                </div>',
        '            </div>',
        '            <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
        '            <!-- 女 -->',
        '            <div  class="hoverPointer" id="SlagoModel.UserPersonal.UserData.sexSetingPage.woman" ',
        '   onclick = "SlagoModel.UserPersonal.UserData.sexSetingPage.choose(this)"          ',
        '   style="width:640px;height:100px;background-color: #ffffff;display: flex;">',
        '                <!-- 字体提示栏 -->',
        '                <div style="width:150px;height:100px;',
        '                            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
        '                    女',
        '                </div>',
        '                <!-- 右箭头 -->',
        '                <div',
        '                    style="margin-left:420px;height: 100%;width:40px;display: flex;justify-content: center;align-items: center;">',
        '                    <img src="./img/箭头_右.png" style="width:40px;">',
        '                </div>',
        '            </div>',
        '            <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
        '            <!-- 其他 -->',
        '            <div  class="hoverPointer"',
        ' id="SlagoModel.UserPersonal.UserData.sexSetingPage.other" onclick = "SlagoModel.UserPersonal.UserData.sexSetingPage.choose(this)" ',
        '                style="width:640px;height:100px;background-color: #ffffff;display: flex;">',
        '                <!-- 字体提示栏 -->',
        '                <div style="width:150px;height:100px;',
        '                            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
        '                    其他',
        '                </div>',
        '                <!-- 右箭头 -->',
        '                <div',
        '                    style="margin-left:420px;height: 100%;width:40px;display: flex;justify-content: center;align-items: center;">',
        '                    <img src="./img/箭头_右.png" style="width:40px;">',
        '                </div>',
        '            </div>',
        '            <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
        '            <!-- 保存按钮栏 -->',
        '            <div style="width:640px;height:100px;background-color: #ffffff;margin-top: 40px;">',
        '                <div onclick="Slago.LoadPage.hover()" class="hoverPointer" style="width:120px;height:60px;border-radius:30px;',
        '                                    background-color: #0066cc;color: #ffffff;display: flex;',
        '                                    justify-content: center;align-items: center;font-size: 24px;margin-left: 505px;">',
        '                    保存',
        '                </div>',
        '            </div>',
        '        </div>',
        '    </div>',
    ].join("");
    namespace.getModel = function () {
        return Slagolib.template.engin(this.Page, {});
    }
    namespace.show = function () {
        //创建页面,推入页面栈
        Slago.CreatePage(this.getModel());
    }
    //加入模块
    SlagoModel.UserPersonal.UserData.sexSetingPage = namespace;

    //创建方法

    //选择按钮
    SlagoModel.UserPersonal.UserData.sexSetingPage.choose = function (dom) {
        //获得选择按钮的三个节点
        let list = [];
        let ids = [
            "SlagoModel.UserPersonal.UserData.sexSetingPage.man",
            "SlagoModel.UserPersonal.UserData.sexSetingPage.woman",
            "SlagoModel.UserPersonal.UserData.sexSetingPage.other"
        ];
        for (let i = 0; i < ids.length; i++) {
            let obj = {};
            obj.id = ids[i];
            obj.node = document.getElementById(ids[i]);
            list.push(obj);
        }
        for (let i = 0; i < list.length; i++) {
            if (dom.id != list[i].id) {
                list[i].node.style.backgroundColor = "#ffffff";
            } else {
                list[i].node.style.backgroundColor = "#b4dafd";
            }
        }
    }
})();

(function(){
    //建立命名空间
    let namespace={};
    //发现页
    namespace.template=[
    '<!--页面Header-->',
    '<div style="width:640px;height:150px;position:fixed;background-color:#ffffff;border-bottom:1px rgb(77, 160, 255) solid;">',
    '    <div style="width:640px;height:14px;background-color:#ffffff;"></div>',
    '    <!-- 标题与搜索栏 -->',
    '    <div style="width:640px;height:50%;display: flex;flex-wrap: wrap;">',
    '        <div style="width:140px;background-color:rgb(255, 255, 255);height:100%;',
    '                    font-size:45px;font-weight:bold;display:flex;justify-content: center;',
    '                    align-items: center;color:#11121b;">关注</div>',
    '        <!-- 帖子上传栏 -->',
    '        <div style="width:500px;height:100%;background-color: #ffffff;display: flex;align-items: center;flex-wrap: wrap;">',
    '           <img src="./img/312.png" style="height:40px;margin-left: 415px;" class="hoverPointer" onclick="SlagoModel.PostUpPage.postupPage.show();">',//点击显示帖子上传界面
    '        </div>',
    '    </div>',
    '    <!-- 页面内选择栏 -->',
    '    <div style="width:640px;height:40%;background-color: rgb(255, 255, 255);">',
    '        <!-- 字体栏 -->',
    '        <div style="width:640px;height:80%;background-color: #ffffff;">',
    '            <div style="font-size: 25px;height:100%;color:#0066cc;display: flex;align-items: center;',
    '            margin-left: 23px;">关注</div>',
    '        </div>',
    '        <!-- 滑动条栏 -->',
    '        <div style="width:640px;height:10px;background-color: #ffffff;">',
    '            <div style="width:50px;height:6px;background-color: #0066cc;',
    '            border-radius:3px;margin-left: 24px;"></div>',
    '        </div>',
    '    </div>',
    '</div>',
    '<!--空白-->',
    '<div style="height:150px;width:640px;"></div>'
    ].join("");
    namespace.getModel=function(){
       return Slagolib.template.engin(this.template,{});
    };
    //加入模块
    SlagoModel.AboutPage.Header=namespace;
})();

(function(){
    //建立命名空间
    let namespace={};
    //发现页
    namespace.template=[
    '<!--页面容器-->',
    '<div style="width:640px;background-color:#ffffff;">',
    '    <!--页面Header-->',
    '    {{HeaderTemplate}}',
    '    <!--帖子流-->',
    '    {{PostStream}}',
    '</div>',
    ].join("");
    namespace.data={
        HeaderTemplate:SlagoModel.AboutPage.Header.getModel(),//获得导航栏
        PostStream:SlagoModel.FindPage.post_model.getModel(),//获得帖子流
    }
    namespace.getModel=function(){
       return Slagolib.template.engin(this.template,this.data);
    };
    //加入模块
    SlagoModel.AboutPage.aboutPage=namespace;
})();

(function(){
    //建立命名空间
    let namespace={};
    //渲染页
    namespace.Page=[
    '    <!-- 个人成就页组件 -->',
    '    <div style="width:640px;background-color: #ffffff;">',
    '        <!-- 导航栏 -->',
    '        <div style="width:640px;height:80px;background-color: rgb(255, 255, 255);align-items: center;display: flex;position: fixed;top:0px;border-bottom: 1px solid rgb(77, 160, 255);">',
    '            <!-- 返回按键 -->',
    '            <div class="hoverPointer" onclick="Slago.PageStack.pop()"',
    '                style="display: flex;height:100%;align-items: center;margin-left: 10px;">',
    '                <img src="./img/页面栈返回左箭头.png" style="height:40px;width:40px;">',
    '                <div style="height:100%;display: flex;align-items: center;margin-left: 3px;">',
    '                    <span style="font-size: 27px;color:#0066cc;">返回</span>',
    '                </div>',
    '            </div>',
    '            <!--导航栏字体栏-->',
    '            <div style="width:300px;height:100%;background-color:#ffffff;margin-left:66px;display:flex;align-items:center;justify-content: center;font-size:27px;">',
    '                发帖',
    '            </div>',
    '        </div>',
    '        <div style="height:80px;"></div>',
    '        <!-- 文字区域栏 -->',
    '        <div style="width:640px;margin-top: 10px;">',
    '            <textarea style="width: 600px;height:200px;outline: none;resize: none;color:rgb(36, 36, 36);padding: 10px;',
    '            background-color: #ffffff;font-size: 26px;margin-left: 10px;" placeholder="分享生活美好..."></textarea>',
    '        </div>',
    '        <!-- 图片添加与显示栏 -->',
    '        <div style="width:600px;margin-left: 20px;background-color: #ffffff;margin-top: 20px;">',
    '            <!-- 第一行 -->',
    '            <div style="height:220px;width:600px;background-color: rgb(255, 255, 255);display: flex;align-items: center;justify-content: space-around;">',
    '                <!-- 第一张 -->',
    '                <div onclick="SlagoModel.PostUpPage.PostUpModel.click(this)" class="hoverPointer" style="width:180px;height:180px;background-color: #fafafa;border-radius: 10px;',
    '                display: flex;justify-content: center;align-items: center;overflow: hidden;">',
    '                    <img src="./img/67.png" style="width:60px;height:60px;">',
    '                    <input type="file" accept="image/*" style="display: none;">',
    '                </div>',
    '                <!-- 第二张 -->',
    '                <div onclick="SlagoModel.PostUpPage.PostUpModel.click(this)"  class="hoverPointer" style="width:180px;height:180px;background-color: #fafafa;border-radius: 10px;',
    '                display: flex;justify-content: center;align-items: center;overflow: hidden;">',
    '                    <img src="./img/67.png" style="width:60px;height:60px;">',
    '                    <input type="file" accept="image/*" style="display: none;">',
    '                </div>',
    '                <!-- 第三张 -->',
    '                <div onclick="SlagoModel.PostUpPage.PostUpModel.click(this)"  class="hoverPointer" style="width:180px;height:180px;background-color: #fafafa;border-radius: 10px;',
    '                display: flex;justify-content: center;align-items: center;overflow: hidden;">',
    '                    <img src="./img/67.png" style="width:60px;height:60px;">',
    '                    <input type="file" accept="image/*" style="display: none;">',
    '                </div>',
    '            </div>',
    '            <!-- 第二行 -->',
    '            <div style="height:220px;width:600px;background-color: rgb(255, 255, 255);display: flex;align-items: center;justify-content: space-around;">',
    '                <!-- 第四张 -->',
    '                <div onclick="SlagoModel.PostUpPage.PostUpModel.click(this)"  class="hoverPointer" style="width:180px;height:180px;background-color: #fafafa;border-radius: 10px;',
    '                display: flex;justify-content: center;align-items: center;overflow: hidden;">',
    '                    <img src="./img/67.png" style="width:60px;height:60px;">',
    '                    <input type="file" accept="image/*" style="display: none;">',
    '                </div>',
    '                <!-- 第五张 -->',
    '                <div onclick="SlagoModel.PostUpPage.PostUpModel.click(this)"  class="hoverPointer" style="width:180px;height:180px;background-color: #fafafa;border-radius: 10px;',
    '                display: flex;justify-content: center;align-items: center;overflow: hidden;">',
    '                    <img src="./img/67.png" style="width:60px;height:60px;">',
    '                    <input type="file" accept="image/*" style="display: none;">',
    '                </div>',
    '                <!-- 第六张 -->',
    '                <div onclick="SlagoModel.PostUpPage.PostUpModel.click(this)"  class="hoverPointer" style="width:180px;height:180px;background-color: #fafafa;border-radius: 10px;',
    '                display: flex;justify-content: center;align-items: center;overflow: hidden;">',
    '                    <img src="./img/67.png" style="width:60px;height:60px;">',
    '                    <input type="file" accept="image/*" style="display: none;">',
    '                </div>',
    '            </div>',
    '        </div>',
    '        <!-- 提交按钮 -->',
    '        <div  style="width:640px;height:100px;background-color: rgb(255, 255, 255);margin-top: 40px;display: flex;align-items: center;">',
    '            <div onclick="SlagoModel.PostUpPage.PostUpModel.dataPost(this)" class="hoverPointer" style="width:120px;height:60px;background-color: #0066cc;',
    '            border-radius: 30px;margin-left: 455px;display: flex;',
    '            justify-content: center;align-items: center;',
    '            font-size: 24px;color:#ffffff;">',
    '                发布',
    '            </div>',
    '        </div>',
    '    </div>',
    ].join("");
    namespace.getModel=function(){
        return Slagolib.template.engin(this.Page,{});
    }
    namespace.show=function(){
        //创建页面,推入页面栈
        Slago.CreatePage(this.getModel());
    }
    //加入模块
    SlagoModel.PostUpPage.postupPage=namespace;
})();

(function(){
    //建立命名空间
    let namespace={};
    //图片添加点击事件
namespace.click=function(addDivNode){
    //获得此节点下的input-file
    let input_file=addDivNode.children[1];
    //为input_file监听文件上传事件
    input_file.onchange=function(){
        //获得img标签节点
        let img_node=this.parentNode.children[0];
        if(this.files!=undefined&&this.files.length>0&&this.files&&this.files[0]){
            if(this.files[0].getAsDataURL){
                img_node.src=this.files[0].getAsDataURL;
            }else{
                img_node.src=window.URL.createObjectURL(this.files[0]);
            }
            //更新输入图片style
            //获得真实图片高度与宽度
            let imgSize={
                width:img_node.naturalWidth,
                height:img_node.naturalHeight
            };
            //决策
            if(imgSize.width>=imgSize.height){//横长
                img_node.style.height="100%";
                img_node.style.width="auto";
            }else{//竖长
                img_node.style.width="100%";
                img_node.style.height="auto";
            }


        }else if(input_file.value){
            img_node.src=input_file.value;
        }else{
            //将图片还原为加号
            img_node.src="./img/67.png";
            //还原style
            img_node.style.width="60px";
            img_node.style.height="60px";
        }
    }
    input_file.click();
};
//数据上传事件,发布按钮点击事件
namespace.dataPost=function(dom){
    dom=dom.parentNode;//dom为按钮的父节点
    let img_file_list=[];
    let rows=[dom.parentNode.children[3].children[0],
    dom.parentNode.children[3].children[1] ];
    for(let i=0;i<2;i++){
        let row=rows[i];
        for(let i=0;i<row.children.length;i++){
            img_file_list.push(row.children[i].children[1]);
        }
    }
    //得到6个input标签,到img_file_list
    //遍历input标签
    //创建formData
    let formData=new FormData();
    let now_index=0;
    for(let i=0;i<img_file_list.length;i++){
        //判断是否有文件
        let status=(img_file_list[i].files&&img_file_list[i].files.length>0)||img_file_list[i].value;
        if(status){
            //推进formData
            formData.append("img"+now_index.toString(),img_file_list[i]);
            now_index++;
        }
    }
    
    //获取textarea内容
    let textarea_node=dom.parentNode.children[2].children[0];
    //textarea.value 加入formData
    formData.append("textarea",textarea_node.value);
    //调用上传属性
    this.ajax(formData);

};
namespace.ajax=function(formData){
    console.log("帖子内容ajax上传");
    console.log(formData);
    //获得浮层dom
    //添加上传进行可视化
    //显示加载浮层
    Slago.LoadPage.hover();
};
    //加入模块
    SlagoModel.PostUpPage.PostUpModel=namespace;
})();