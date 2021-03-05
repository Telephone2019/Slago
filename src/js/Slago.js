window.Slago = {
    //页面栈
    PageStack: {
        stack: [],
        push: function (div) {
            //将上一个页面进行display:none
            if (this.stack.length > 0) {
                this.stack[this.stack.length-1].scroll=parseInt(window.pageYOffset);//scroll更新
                this.stack[this.stack.length-1].dom.style.display="none";
            }
            //入栈
            this.stack.push({dom:div,scroll:0});
            //插入html
            document.getElementById("Slago.Containner").appendChild(div);
            //是否显示Containner
            if(this.stack.length>0){
                document.getElementById("Slago.Containner").style.display="block";
                //关闭其他页面
                window.Slago.ThreeIndexPage.$closePage();
            }
        },
        pop: function () {
            /*页面返回上一级
             *返回值，上一级还有页面则返回true，否则返回false
             */
            if (this.stack.length > 0) {
                //删除页面栈末尾节点
                this.stack[this.stack.length - 1].dom.parentNode.removeChild(this.stack[this.stack.length - 1].dom);
                //出栈
                this.stack.pop();
                //显示栈顶页面
                if (this.stack.length > 0) {
                    this.stack[this.stack.length - 1].dom.style.display = "block";
                    window.scrollTo(0,this.stack[this.stack.length - 1].scroll);
                }else{//弹栈后栈为空，则关闭Containner显示其他页面
                    this.clear();
                }
                return true;
            } else {//关闭Containner
                this.clear();
                return false;
            }
        },
        clear:function(){
            while(window.Slago.PageStack.stack.length>0){
                window.Slago.PageStack.pop();
            }
            //关闭Containner
            document.getElementById("Slago.Containner").style.display="none";
            //TO lastPage
            window.Slago.ThreeIndexPage.To(window.Slago.ThreeIndexPage.lastPage);
        }
    }, //End-PageStack
    //向页面栈创建新页面
    CreatePage: function (newnode) {
        let div = document.createElement("div");
        div.style.width = "640px";
        div.style.backgroundColor = "rgba(240, 248, 255, 0)";
        div.style.display="block";
        div.innerHTML=newnode;
        this.PageStack.push(div);
    }, //End-CreatePage

    //四个主界面
    ThreeIndexPage:{
        AboutPage:{dom:document.getElementById("Slago.AboutPage"),scroll:0},
        FindPage:{dom:document.getElementById("Slago.FindPage"),scroll:0},
        UserPage:{dom:document.getElementById("Slago.UserPage"),scroll:0},
        Containner:{dom:document.getElementById("Slago.Containner"),scroll:0},
        lastPage:"FindPage",//web进入默认页面,lastPage并不存储Containner,lastPage为了从Containner到其他三个容器的过渡
        To:function(Index){
            this.$closePage();
            if(Index!="Containner"){
                this[Index].dom.style.display="block";
                this.lastPage=Index;
                //注意:此处设计To 与 window.Slago.PageStack.clear的递归
                if(window.Slago.PageStack.stack.length>0){
                    window.Slago.PageStack.clear();                    
                }
            }
            //更新页面滑动位置
            window.scrollTo(0,this[this.lastPage].scroll);
        },
        $closePage:function(){//关闭现在页面并更新scroll等信息
            //更新scroll
            this[this.lastPage].scroll=parseInt(window.pageYOffset);
            this[this.lastPage].dom.style.display="none";
        }
    },//End-ThreeIndexPage


    //框架初始化
    Init:function(){
        //为Footer三个按钮绑定事件
        let FooterIcons=document.getElementsByClassName("Slago.FooterIcon");
        FooterIcons[0].onclick=function(){
            window.Slago.ThreeIndexPage.To("AboutPage");
            document.getElementsByClassName("Slago.FooterIcon")[0].src="http://119.3.180.71/app/img/about_blue.png";
            document.getElementsByClassName("Slago.FooterIcon")[1].src="http://119.3.180.71/app/img/find_gray.png";
            document.getElementsByClassName("Slago.FooterIcon")[2].src="http://119.3.180.71/app/img/home_gray.png";
        };
        FooterIcons[1].onclick=function(){
            window.Slago.ThreeIndexPage.To("FindPage");
            document.getElementsByClassName("Slago.FooterIcon")[0].src="http://119.3.180.71/app/img/about_gray.png";
            document.getElementsByClassName("Slago.FooterIcon")[1].src="http://119.3.180.71/app/img/find_blue.png";
            document.getElementsByClassName("Slago.FooterIcon")[2].src="http://119.3.180.71/app/img/home_gray.png";
        };
        FooterIcons[2].onclick=function(){
            window.Slago.ThreeIndexPage.To("UserPage");
            document.getElementsByClassName("Slago.FooterIcon")[0].src="http://119.3.180.71/app/img/about_gray.png";
            document.getElementsByClassName("Slago.FooterIcon")[1].src="http://119.3.180.71/app/img/find_gray.png";
            document.getElementsByClassName("Slago.FooterIcon")[2].src="http://119.3.180.71/app/img/home_blue.png";
        };
    },


    //footer显示控制
    Footer:{
        none:function(){
            document.getElementById("Slago.Footer").style.display="none";
            document.getElementById("Slago.FooterBlankSpace").style.display="none";
        },
        block:function(){
            document.getElementById("Slago.Footer").style.display="flex";
            document.getElementById("Slago.FooterBlankSpace").style.display="block";
        }
    },

    //header显示设置
    Header:{
        none:function(){
            document.getElementById("Slago.Header").style.display="none";
            document.getElementById("Slago.HeaderBlankSpace").style.display="none";
        },
        block:function(){
            document.getElementById("Slago.Header").style.display="block";
            document.getElementById("Slago.HeaderBlankSpace").style.display="block";
        }
    }
};
//初始化
window.Slago.Init();
