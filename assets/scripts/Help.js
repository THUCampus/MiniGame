cc.Class({
    extends: cc.Component,

    properties: { },

    loadStart: function(event, data) {
        cc.director.loadScene('Start');
    },
});
