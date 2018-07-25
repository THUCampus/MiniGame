cc.Class({
    extends: cc.Component,

    properties: {
        display: {
            default: null,
            type: cc.Sprite,
        },
    },

    loadStart: function() {
        cc.director.loadScene("Start");
    },

    start() {
        // following is to show score list in ranking
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "x1"
            });
        }
    },

    _updateSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        this.tex.initWithElement(window.sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },

    update () {
        this._updateSubDomainCanvas();
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

    friendButtonFunc(event) {
        if (CC_WECHATGAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取好友排行榜数据。x1");
        }
    },

    groupFriendButtonFunc: function (event) {
        if (CC_WECHATGAME) {
            window.wx.shareAppMessage({
                success: (res) => {
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window.wx.postMessage({
                            messageType: 5,
                            MAIN_MENU_NUM: "x1",
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        } else {
            cc.log("获取群排行榜数据。x1");
        }
    },

    gameOverButtonFunc: function (event) {
        if (CC_WECHATGAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取横向展示排行榜数据。x1");
        }
    },

});
