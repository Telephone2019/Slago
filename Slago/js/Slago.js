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