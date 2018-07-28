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

    loadSelector: function() {
        cc.director.loadScene("Selector");
    },

    start() {
        // following is to show score list in ranking
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            window.wx.postMessage({
                messageType: 'rank',
                gameNo: Global.gameNo.toString(),
                levelNums: Global.gamedata.length,
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

});
