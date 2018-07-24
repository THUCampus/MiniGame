cc.Class({
    extends: cc.Component,

    properties: {
        BackAudio:{
            default: null,
            url: cc.AudioClip
        },
     },

    onLoad(){
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this.BackAudio,true);
    },

    loadSelector: function(event, data) {
        cc.director.loadScene("Selector");
    },

    loadHelp: function(event, data) {
        cc.director.loadScene("Help");
    },
});
