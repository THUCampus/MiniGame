// 全局变量！
window.Global = {
    test: 'hello world!',
    hNum: 20,
    wNum: 20,
    cells: [
        [1, 1, 1, 1, 0, 0, 0, 1, 1, 0,],
        [1, 1, 1, 1, 0, 0, 0, 1, 1, 0,],
        [1, 1, 1, 1, 0, 0, 0, 1, 1, 0,],
        [1, 1, 1, 1, 0, 0, 0, 1, 1, 0,],
        [1, 1, 1, 1, 0, 0, 0, 1, 1, 0,],
        [1, 1, 1, 1, 0, 0, 0, 1, 1, 0,],
        [1, 1, 1, 1, 0, 0, 0, 1, 1, 0,],
        [1, 1, 1, 1, 0, 0, 0, 1, 1, 0,],
        [1, 1, 1, 1, 0, 0, 0, 1, 1, 0,],
        [1, 1, 1, 1, 0, 0, 0, 1, 1, 0,],
    ],
    gamedata: null,
    heroX: 0,
    heroY: 0,
    starNum: 4,
    starPosition: [],
    failInfo: "哈哈哈哈哈哈哈哈哈哈哈哈你输了吧",
    princessX: 9,
    princessY: 9,
    enemyNum: 2,
    enemies: [
        [0, 4, 0],
        [3, 11, 0]
    ],
    gameScore: 0,
    gameBaseScore: 2000,
    gameNo: 1,
};

cc.Class({
    extends: cc.Component,
    properties: { },
    onLoad() {
        cc.loader.loadRes('games', function (err, object) {
            if (err) {
                cc.log(err);
                return;
            }
            Global.gamedata = object;
        });
    },
});
