cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Node,
        },
        overAudio: {
            default: null,
            url: cc.AudioClip
        },
        display: {
            default: null,
            type: cc.Sprite,
        },
    },

    onLoad() {
        cc.audioEngine.playEffect(this.overAudio,false);
        this.label.getComponent('cc.Label').string = Global.failInfo;
    },

    loadNow: function(event, data) {
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

    _updateSubDomainCanvas () {
        if (this.display) {
            console.log("Have")
        }
        else {
            console.log("Error!")
        }
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

});
