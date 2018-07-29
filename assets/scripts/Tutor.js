let IMAGE_WIDTH = 80, IMAGE_HEIGHT = 80;

cc.Class({
    extends: cc.Component,

    properties: {
        stepIndex: 0,
        showingTutorText: true,
        infos: [],
        label: {
            default: null,
            type: cc.Label,
        },
        imageContainer: {
            default: null,
            type: cc.Sprite,
        },
        starSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        enemyOneSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        enemyTwoSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        rockerSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        rockerInnerSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        changeSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        fearlessSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        speedUpSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        slowDownSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        pauseSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        randomSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        iceSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        wallSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        princessSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        heroSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
    },

    onLoad() {
        this.stepIndex = -1;
        this.infos = [
            ['欢迎你进入圆圆的世界！\n想必你已经看过了游戏背景咯', this.heroSpriteFrame],
            ['让我现在给你介绍更多\n你可以边听边操作', this.heroSpriteFrame],
            ['左侧这个就是我们的主人公圆圆', this.heroSpriteFrame],
            ['圆圆为了获取公主芳心\n需要摘到所有星星后再去找公主', this.heroSpriteFrame],
            ['喏，公主就是她', this.princessSpriteFrame],
            ['因为公主很高，而图像是立体的', this.princessSpriteFrame],
            ['所以圆圆必须到达\n公主站立的砖块才是找到了公主', this.princessSpriteFrame],
            ['但如果没有把所有星星都摘走\n公主是不会原谅圆圆的', this.princessSpriteFrame],
            ['你可以在场地上看到许多星星', this.starSpriteFrame],
            ['但他们可能会冻在冰块中\n你需要打碎冰块才能拿到', this.starSpriteFrame],
            ['在游戏界面左上角灰色背景上\n你可以看到这些信息：', this.starSpriteFrame],
            ['剩余星星数、当前分数\n以及当前是否可以对冰进行操作', this.starSpriteFrame],
            ['随着时间流逝\n分数会不断减少', this.starSpriteFrame],
            ['在对冰操作过程中\n分数减少会更快', this.starSpriteFrame],
            ['而每次行走\n即使被挡住', this.starSpriteFrame],
            ['也会减少分数', this.starSpriteFrame],
            ['但吃到星星可以获得分数', this.starSpriteFrame],
            ['要注意，如果分数小于0\n你会被公主嘲讽', this.starSpriteFrame],
            ['因此就失败咯', this.starSpriteFrame],
            ['我们的圆圆具有\n能够操作冰块的超能力', this.iceSpriteFrame],
            ['他能操作的冰是它面前的一列', this.heroSpriteFrame],
            ['你可以通过它的朝向来判断\n喏，也就是那片白色反光朝向', this.heroSpriteFrame],
            ['当它面前直接是冰块的时候\n就可以击碎面前所有连续的冰块', this.iceSpriteFrame],
            ['否则\n会向面前的方向放出连续的一列冰块', this.iceSpriteFrame],
            ['放出冰块时，如果前面有：\n墙、表情包、公主时，会停止', this.iceSpriteFrame],
            ['放出冰块和消除冰块时\n如果没有停下来，就不能再次操作', this.iceSpriteFrame],
            ['所以你需要考虑全局\n决定是否放冰、怎样放冰', this.iceSpriteFrame],
            ['冰块可以阻挡表情包和圆圆\n所以危急时可以救命', this.iceSpriteFrame],
            ['你可以在场上看到表情包', this.enemyOneSpriteFrame],
            ['以及这一个', this.enemyTwoSpriteFrame],
            ['如果碰到表情包\n圆圆会再次伤害公主的心灵', this.enemyOneSpriteFrame],
            ['所以千万要小心！', this.enemyTwoSpriteFrame],
            ['表情包的速度有差异\n路线也可能不同', this.enemyOneSpriteFrame],
            ['但不要过分紧张\n表情包没有那么聪明', this.enemyTwoSpriteFrame],
            ['只要在横向或者纵向用冰挡住他们\n就可以获得喘息的机会', this.enemyOneSpriteFrame],
            ['具体需要用哪个方向\n就看你的观察咯', this.enemyTwoSpriteFrame],
            ['圆圆可以碎冰，但不能碎掉墙', this.wallSpriteFrame],
            ['所以需要找个合适的路径绕过去', this.wallSpriteFrame],
            ['游戏可以使用左下角的模拟摇杆', this.rockerSpriteFrame],
            ['但不要把中心小球划得太远', this.rockerInnerSpriteFrame],
            ['否则你是很难转弯的', this.rockerSpriteFrame],
            ['如果更喜欢按键操作\n可以点击这个按钮进行切换', this.changeSpriteFrame],
            ['他就在摇杆或者方向按键旁边', this.changeSpriteFrame],
            ['整个场景是可以移动的\n手指拖动界面即可', null],
            ['你可以一只手拖动\n另一只手控制移动或者放冰', null],
            ['右下角最大的哪个按钮就是放冰用的', null],
            ['而它左侧三个按钮\n分别用来缩小、恢复、放大场景', null],
            ['在你上方一行有四个礼包\n你们可以吃掉他们', null],
            ['这个可以\n暂停表情包移动一段时间', this.pauseSpriteFrame],
            ['但是你要随时注意\n小心他们突然开始移动', this.pauseSpriteFrame],
            ['这个可以\n让你变为无敌状态一段时间', this.fearlessSpriteFrame],
            ['无敌状态下\n你会变成半透明', this.fearlessSpriteFrame],
            ['碰到表情包时不会立即死亡\n而是减少分数', this.fearlessSpriteFrame],
            ['但分数减少到小于0时\n公主还是会嫌弃你', this.fearlessSpriteFrame],
            ['这个蜗牛一样的图标\n会让你在一段时间内减速', this.slowDownSpriteFrame],
            ['这样会让你更难逃开表情包', this.slowDownSpriteFrame],
            ['这个会让你\n永久加速', this.speedUpSpriteFrame],
            ['但你如果之前正在减速\n不久后你会恢复减速前的速度', this.speedUpSpriteFrame],
            ['这个看起来像钱箱的\n其实是随机礼包', this.randomSpriteFrame],
            ['你会获得上述四个礼包之一', this.randomSpriteFrame],
            ['就介绍到这里', this.heroSpriteFrame],
            ['点击继续去帮圆圆哄回公主吧！', this.heroSpriteFrame],
        ];
        this.next();
    },

    next: function() {
        this.stepIndex = Math.floor(this.stepIndex + 1);
        if (this.stepIndex < 0) {
            this.stepIndex = 0;
        }
        if (this.stepIndex >= this.infos.length) {
            cc.director.loadScene('Selector');
        }
        else {
            this.label.string = this.infos[this.stepIndex][0];
            this.imageContainer.spriteFrame = this.infos[this.stepIndex][1];
            if (this.infos[this.stepIndex][1]) {
                let zoomRate = IMAGE_WIDTH / this.imageContainer.node.width;
                if (zoomRate > IMAGE_HEIGHT / this.imageContainer.node.height) {
                    zoomRate = IMAGE_HEIGHT / this.imageContainer.node.height;
                }
                this.imageContainer.node.width *= zoomRate;
                this.imageContainer.node.height *= zoomRate;
            }
        }
    },

});
