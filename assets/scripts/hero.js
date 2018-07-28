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
        switch(other.tag) {
        case 5:
            // 星星：
            other.node.destroy();
            break;
        case 18:
            // 小怪
            if (this.game.heroFearless) {
                Global.gameScore -= 100;
            }
            else {
                Global.failInfo = "哈哈哈哈哈哈哈哈哈你输了吧~";
                this.game.gameOver();
            }
            break;
        case 46:
            // 公主
            this.game.savePricess();
            break;
        case 36:
            // 暂停彩蛋
            this.game.setButtonControl(null, '5');
            other.node.destroy();
            break;
        case 37:
            // 无敌彩蛋
            this.game.setButtonControl(null, '6');
            other.node.destroy();
            break;
        case 38:
            // 减速彩蛋
            this.game.setButtonControl(null, '7');
            other.node.destroy();
            break;
        case 39:
            // 加速彩蛋
            this.game.setButtonControl(null, '8');
            other.node.destroy();
            break;
        case 40:
            // 任意彩蛋
            this.game.setButtonControl(null, (5 + Math.floor(Math.random() * 4)).toString());
            other.node.destroy();
            break;
        }
    },
});
