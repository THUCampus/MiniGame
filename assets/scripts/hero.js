cc.Class({
    extends: cc.Component,

    properties: {
        game: null,
    },

    start () {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },

    onCollisionEnter: function (other, self) {
        console.log("enter");
        switch(other.tag) {
        case 5:
            // 星星：
            other.node.destroy();
            break;
        case 18:
            // 小怪
            Global.failInfo = "哈哈哈哈哈哈哈哈哈你输了吧~";
            this.game.gameOver();
            break;
        case 46:
            // 公主
            this.game.savePricess();
            break;
        }
    },
});
