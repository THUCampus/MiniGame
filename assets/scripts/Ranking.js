cc.Class({
    extends: cc.Component,

    properties: {
        display: {
            default: null,
            type: cc.Sprite,
        },
        shown: false,
    },

    loadRankingList: function() {
        if (!this.shown) {
            wx.postMessage({
                message: 'Show',
            });
        }
        else {
            wx.postMessage({
                message: 'Hide',
            });
        }
        this.shown = !this.shown;
    },

    onLoad() {
        this.tex = new cc.Texture2D();
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
