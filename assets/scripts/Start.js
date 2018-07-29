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
        cc.director.loadScene('Selector');
    },

    loadHelp: function(event, data) {
        cc.director.loadScene('Help');
    },
    
    // 深复制，数组和对象的情况
    deepCopy: function(data) {
        let ans = null;
        if (data instanceof Array) {
            ans = [];
            for (let i = 0; i < data.length; i++) {
                ans[i] = this.deepCopy(data[i]);
            }
        }
        else if (data instanceof Object) {
            ans = {};
            for (var i in data) {
                ans[i] = this.deepCopy(data[i]);
            }
        }
        else {
            ans = data;
        }
        return ans;
    },

    loadTutor: function(event, data) {
        let nowData = {
            "hNum": 15,
            "wNum": 15,
            "cells": [
                [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0, 0, 0],
                [0, 0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0, 0, 0],
                [0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0, 0, 0],
                [0, 0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0, 0, 0],
                [0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0]
            ],
            "heroX": 7,
            "heroY": 0,
            "starNum": 12,
            "starPosition": [
                [4,4],[4,5],[4,6],
                [7,4],[7,5],[7,6],
                [4,8],[4,9],[4,10],
                [7,8],[7,9],[7,10]
            ],
            "princessX": 14,
            "princessY": 0,
            "enemyNum": 2,
            "enemies": [
                [0, 14, 0, 65],
                [0, 2, 1, 15]
            ],
            "bonusNum": 5,
            "bonusInfos": [
                [1, 4, 0],
                [1, 5, 1],
                [1, 9, 2],
                [1, 10, 3],
                [5, 4, 4],
            ],
            "gameNo": 0,
        };
        for (let temp in nowData) {
            Global[temp] = this.deepCopy(nowData[temp]);
        }
        cc.director.loadScene('Tutor');
    },

    loadIntroduction: function(event, data) {
        cc.director.loadScene('Introduction');
    },
});
