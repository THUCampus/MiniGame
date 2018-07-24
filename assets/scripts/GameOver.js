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
    },

    onLoad() {
        cc.audioEngine.playEffect(this.overAudio,false);
        this.label.getComponent('cc.Label').string = Global.failInfo;
    },

    loadNow: function(event, data) {
        cc.director.loadScene("Start");
    },
});
