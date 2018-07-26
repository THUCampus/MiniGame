cc.Class({
    extends: cc.Component,

    properties: {
        rankshow: {
            default: null,
            type: cc.Sprite,
        },
    },

    loadSelector: function(event, data) {
        cc.director.loadScene("Selector");
    },

    start() {
        // following is to show score list in final
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "x1"
            });
        }
    },

    submitScoreButtonFunc(gameScore){
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "x1",
                score: gameScore,
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
