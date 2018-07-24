cc.Class({
    extends: cc.Component,

    properties: {
        num: 0,
        levelSelectorPrefab: {
            default: null,
            type: cc.Prefab,
        },
        content: {
            default: null,
            type: cc.Node,
        },
        singleHeight: 80,
        heightAdderFirst: -20,
    },

    onLoad() {
        this.num = Global.gamedata.length;
        this.content.height = this.singleHeight * Math.ceil(this.num / 3 + 1);
        for (let i = 0; i < this.num; i++) {
            let levelSelector = cc.instantiate(this.levelSelectorPrefab);
            this.node.addChild(levelSelector);
            levelSelector.on("click", ()=>{
                this.loadData(i);
            });
            let x = 0;
            if (i % 3 === 0) {
                x = -this.content.width / 4;
            }
            else if (i % 3 === 2) {
                x = this.content.width / 4;
            }
            levelSelector.setPosition(x, this.heightAdderFirst - this.singleHeight * Math.ceil((i + 1) / 3));
            levelSelector.children[0].getComponent('cc.Label').string = '第' + (i + 1).toString() + '关';
        };
    },

    loadData(data) {
        let nowData = Global.gamedata[data];
        for (let temp in nowData) {
            Global[temp] = nowData[temp];
        }
        cc.director.loadScene("Main");
    }
});
