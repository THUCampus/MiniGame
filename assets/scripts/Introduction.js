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

        showTimes: 10,
        hideTimes: 3,
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
            '和一位公主',
            '成为眷侣',
            '他们没日没夜',
            '聊着微信',
            '互发动图',
            '倾诉感情',
            '但是',
            '自从他沉迷表情包',
            '就再未正常聊天',
            '每日斗图为乐',
            '日渐消瘦',
            '......',
            '剩下的你来写吧',
            '我先睡了',
            '早安',
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

