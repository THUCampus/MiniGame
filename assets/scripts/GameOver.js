cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Node,
        },
        display: {
            default: null,
            type: cc.Sprite,
        },
        opacityNums: 60,
        opacityTime: 4,
    },

    onLoad() {
        if (this.label) {
            this.label.getComponent('cc.Label').string = Global.failInfo;
        }
    },

    loadNow: function(event, data) {
        cc.director.loadScene('Selector');
    },

    
    start() {
        Global.gameScore = Math.ceil(Global.gameScore);
        // following is to show score list in final
        this.display.node.opacity = 0;
        let m = 0;
        let self = this;
        let opacityAction = setInterval(function() {
            m++;
            if (m > self.opacityNums || !(self.display)) {
                m = self.opacityNums;
                clearInterval(opacityAction);
            }
            if (self.display) {
                self.display.node.opacity = 255 * m / self.opacityNums;
            }
        }, this.opacityTime * 1000 / this.opacityNums);
        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D();
            window.wx.postMessage({
                messageType: 'post',
                gameNo: Global.gameNo.toString(),
                score: Global.gameScore,
                levelNums: Global.gamedata.length,
            });
        }
    },

    loadRank: function() {
        cc.director.loadScene('Ranking');
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

});
