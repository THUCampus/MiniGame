cc.Class({
    extends: cc.Component,

    properties: {
        data: [],

        content: {
            default: null,
            type: cc.Node,
        },
        button: {
            default: null,
            type: cc.Node,
        },
        nowIndex: 0,

        showTimes: 30,
        hideTimes: 15,
        singleTime: 0.05,
    },

    showButton: function(self, index) {
        if (index < self.showTimes && self.button) {
            index += 1;
            self.button.opacity = 255 * index / self.showTimes;
            setTimeout(()=>{self.showButton(self, index);}, self.singleTime * 1000);
        }
    },

    showContent: function(self, index) {
        if (index < self.showTimes && self.content) {
            index += 1;
            self.content.opacity = 255 * index / self.showTimes;
            setTimeout(()=>{self.showContent(self, index);}, self.singleTime * 1000);
        }
        else if (index >= self.showTimes && self.content) {
            self.hideContent(self, 0);
        }
    },

    hideContent: function(self, index) {
        if (index < self.hideTimes && self.content) {
            index += 1;
            self.content.opacity = 255 * (self.hideTimes - index) / self.hideTimes;
            setTimeout(()=>{self.hideContent(self, index);}, self.singleTime * 1000);
        }
        else if (index >= self.hideTimes && self.content) {
            self.nowIndex++;
            self.showSentence(self);
        }
    },

    showSentence: function(self) {
        if (self.nowIndex >= self.data.length) {
            self.button.active = true;
            self.button.opacity = 0;
            self.showButton(self, 0);
        }
        else {
            self.content.getComponent('cc.Label').string = self.data[self.nowIndex];
            self.showContent(self, 0);
        }
    },

    onLoad() {
        this.data = [
            '曾经，有一位勇士',
            '名叫圆圆',
            '和一位公主',
            '沉入爱河',
            '他们没日没夜',
            '聊着微信',
            '互发动图',
            '倾诉感情',
            '但是',
            '自从他沉迷表情包',
            '就再未正常聊天',
            '每日斗图为乐',
            '日渐变圆',
            '公主劝说无效',
            '只得以泪洗面',
            '有人带来了\n遥远东方的古老魔法',
            '公主沉思已久',
            '最终将圆圆封印',
            '成了一个真正的\n圆圆的球',
            '圆圆痛定思痛',
            '习得\n放冰术与碎冰术',
            '踏上了寻回公主真心的旅途',
            '但这一路上并不平坦',
            '他曾经发过的表情包\n仍然在诱惑着他',
            '一不留神他就会再次沉迷',
            '永远失去他的公主',
            '但还有好心人',
            '在他前行的道路上准备好了',
            '各种道具',
            '助他一臂之力',
            '准备好了吗',
            '游戏即将开始',
        ];
        this.button.active = false;
        this.showSentence(this);
    },

    loadSelector: function() {
        cc.director.loadScene('Selector');
    },

    loadStart: function() {
        cc.director.loadScene('Start');
    },
});

