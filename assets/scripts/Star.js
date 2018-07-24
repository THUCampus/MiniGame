cc.Class({
    extends: cc.Component,

    properties: {
        game: null,
        i: -1,
        j: -1,
    },

    onDestroy() {
        if (!this.game.gameover) {
            this.game.starNum--;
            this.game.deleteStar(this.game, this.i, this.j);
            if (this.game.starNum <= 0) {
                this.game.pickedAll();
            };
        }
    },
});
