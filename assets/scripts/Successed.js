cc.Class({
    extends: cc.Component,

    properties: {
        rankshow: {
            default: null,
            type: cc.Sprite,
        },
        opacityNums: 100,
        opacityTime: 4,
    },

    loadSelector: function(event, data) {
        cc.director.loadScene("Selector");
    },

    start() {
        Global.gameScore = Math.ceil(Global.gameScore);
        // following is to show score list in final
        this.rankshow.node.opacity = 0;
        let m = 0;
        let self = this;
        let opacityAction = setInterval(function() {
            m++;
            if (m > self.opacityNums) {
                m = self.opacityNums;
                clearInterval(opacityAction);
            }
            self.rankshow.node.opacity = 255 * m / self.opacityNums;
        }, this.opacityTime * 1000 / this.opacityNums);
        function tempClearOpacity(itself, mopacityAction) {
            setTimeout(()=>{
                if (m < itself.opacityNums) {
                    tempClearOpacity(itself, mopacityAction);
                }
                else {
                    clearInterval(mopacityAction);
                }
            }, itself.opacityTime * 1000);
        }
        tempClearOpacity(self, opacityAction);
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "x1",
                score: Global.gameScore,
            });
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "x1"
            });
        }
    },

    loadRank: function() {
        cc.director.loadScene("Ranking");
    },

    update () {
        // if (this.rankshow) {
        //     console.log("Have")
        // }
        // else {
        //     console.log("Error!")
        // }
        if (!this.tex) {
            return;
        }
        this.tex.initWithElement(window.sharedCanvas);
        this.tex.handleLoadedTexture();
        this.rankshow.spriteFrame = new cc.SpriteFrame(this.tex);
    },

});
