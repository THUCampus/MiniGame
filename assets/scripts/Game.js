const EMPTY_CELL = 0, ICE_CELL = 1, WALL_CELL = 2, ENEMY_MOVE = 32, PLAYER_MOVE = 16;

cc.Class({
    extends: cc.Component,

    properties: {
        //// 这些是在界面里面设置的内容
        mainView: {
            default: null,
            type: cc.Node,
        },
        scrollView: {
            default: null,
            type: cc.Node,
        },

        IcePrefab: {
            default: null,
            type: cc.Prefab,
        },
        StarPrefab: {
            default: null,
            type: cc.Prefab,
        },
        WallPrefab1: {
            default: null,
            type: cc.Prefab,
        },
        HeroPrefab:{
            default: null,
            type: cc.Prefab,
        },
        PrincessPrefab: {
            default: null,
            type: cc.Prefab,
        },
        EnemyPrefab1:{
            default: null,
            type: cc.Prefab,
        },
        EnemyPrefab2:{
            default: null,
            type: cc.Prefab,
        },

        StarAudio:{
            default: null,
            url: cc.AudioClip
        },
        iceBreakAudio:{
            default: null,
            url: cc.AudioClip
        },
        iceAudio:{
            default: null,
            url: cc.AudioClip
        },


        emptyBackGround: {
            default: null,
            type: cc.Node,
        },

        spRoker: cc.Sprite,
        spSokerCenter: cc.Sprite,
        


        //// 这些是常数，*************切记要改的时候在cocos creator里面设置初始值！
        cellWidth: 60,
        cellHeight: 60,

        actionTimeMove: 0.2,
        actionTimeRotate: 0.4,
        actionTimeMoveScroll: 1.2,
        delayTimePressKey: 0.15,
        iceOperateTime: 0.3,

        // 消除冰块时显示多少帧，现在是每秒60帧，也就是在iceOperateTime这0.3秒里面有18帧
        opacityNums: 18,

        // 为了能够让星星在冰块前面，设置一个z的增加值
        starAdder: 0.2,

        // 这个是WallPrefab的数组，在onLoad里初始化
        WallPrefab: [],
        EnemyPrefab: [],
    


        //// 剩下的正常会修改的东西，在onload里面设置初始值
        starNum: 0,

        pressed: false,
        enableIceOperation: true,

        starInitNum: 4,

        // // 每个元素是一个结构体：一个实例NPC，一个info，info里面有当前位置和运动方向（其他东西都可以加的咯）
        // NPCList: [],

        // 每个cell对应的是什么状态
        cells: [],
        // 记录一共有多少个cell
        cellsNumW: 20,
        cellsNumH: 20,

        heroX: 0,
        heroY: 0,

        princessX: 9,
        princessY: 9,

        hero: null,
        direction: null,
        princess: null,
        enemies: [],

        enemiesData: [],
        enemiesNum: 0,

        scrollViewItself: null,

        nowZoom: 1,

        starPositions: [],

        // 成功之后设置为false避免继续移动
        controlable: true,

        // 防止在gameover之后调用星星的ondestroy导致回到start
        gameover: false,

        // 在摘到所有星星之后才能救公主，要不然公主会生气
        pickedAllStars: false,

        playerSecond: 0,
    },

    // initCells: function(self, width, height) {
    //     self.cellsNumW = width;
    //     self.cellsNumH = height;
    //     for (let i = 0; i < height; i++) {
    //         self.cells.push([]);
    //         for (let j = 0; j < width; j++) {
    //             self.cells[i].push(EMPTY_CELL);
    //         }
    //     }
    // },

    getCellPosition: function(self, i, j) {
        return cc.p(self.cellWidth * (j - (self.cellsNumW - 1) / 2), self.cellHeight * (i - (self.cellsNumH - 1) / 2));
    },

    pickedAll: function() {
        this.pickedAllStars = true;
    },

    savePricess: function() {
        if (this.pickedAllStars) {
            this.success();
        }
        else {
            Global.failInfo = "bingo~公主生气了不要你了~";
            this.gameOver();
        }
    },
    
    success: function() {
        this.controlable = false;
        this.gameover = true;
        cc.director.loadScene("Successed");
    },

    initWidthHeightLoadData: function(self) {
        if (Global.hNum > 0 && Global.wNum > 0) {
            self.cellsNumW = Global.wNum;
            self.cellsNumH = Global.hNum;
        }
        if (Global.heroX >= 0 && Global.heroY >= 0
             && Global.heroX < self.cellsNumW && Global.heroY < self.cellsNumH
        ) {
            self.heroX = Global.heroX;
            self.heroY = Global.heroY;
        }
        if (Global.princessX >= 0 && Global.princessY >= 0
            && Global.princessX < self.cellsNumW && Global.princessY < self.cellsNumH
        ) {
           self.princessX = Global.princessX;
           self.princessY = Global.princessY;
        }
        if (Global.enemyNum >= 0) {
            self.enemiesNum = Global.enemyNum;
        }
        for (let enemyData of Global.enemies) {
            if (enemyData.length >= 4 && enemyData[0] >= 0 && enemyData[1] >= 0
                && enemyData[1] < self.cellsNumW && enemyData[0] < self.cellsNumH
                && enemyData[2] >= 0 && enemyData[2] < self.EnemyPrefab.length
                && enemyData[1] !== self.heroX && enemyData[0] !== self.heroY
                && enemyData[3] > 0
                && self.enemiesData.length < self.enemiesNum
            ) {
                    self.enemiesData.push(enemyData);
            }
        }
        if (Global.starNum >= 0 && Global.starNum < self.cellsNumW * self.cellsNumH) {
            self.starInitNum = Global.starNum;
        }
        if (Global.starPosition.length <= self.starInitNum) {
            self.starPositions = Global.starPosition;
        }
        for (let i = 0; i < self.cellsNumH; i++) {
            self.cells.push([]);
            if (Global.cells[i]) {
                for (let j = 0; j < self.cellsNumW; j++) {
                    if (Global.cells[i][j] == ICE_CELL) {
                        self.cells[i].push({
                            'data': Global.cells[i][j],
                            'node': null,
                            // NPCnum是敌人的个数加上（可能的）公主的个数
                            'NPCnum': 0,
                        });
                        self.drawIce(self, i, j, false);
                    }
                    else if (Global.cells[i][j] > 0 && Global.cells[i][j] < self.WallPrefab.length + 2) {
                        self.cells[i].push({
                            'data': Global.cells[i][j],
                            'node': null,
                            'NPCnum': 0,
                        });
                        self.drawWall(self, i, j, Global.cells[i][j]);
                    }
                    else {
                        self.cells[i].push({
                            'data': EMPTY_CELL,
                            'node': null,
                            'NPCnum': 0,
                        });
                    }
                }
            }
            else {
                for (let j = 0; j < self.cellsNumW; j++) {
                    self.cells[i].push({
                        'data': EMPTY_CELL,
                        'node': null,
                        'NPCnum': 0,
                    });
                }
            }
        }
        self.setMainViewSize(self, 1);
        self.emptyBackGround.width = self.cellsNumW * self.cellWidth;
        self.emptyBackGround.height = self.cellsNumW * self.cellHeight;
    },

    setMainViewSize: function(self) {
        let size = self.nowZoom;
        // self.mainView.width = cc.view.getFrameSize().width / 3 + self.cellsNumW * self.cellWidth * size;
        // self.mainView.height = cc.view.getFrameSize().height / 3 + self.cellsNumH * self.cellHeight * size;
        self.mainView.width = cc.view.getVisibleSize().width / 2 + self.cellsNumW * self.cellWidth * size;
        self.mainView.height = cc.view.getVisibleSize().height / 2 + self.cellsNumH * self.cellHeight * size;
    },

    onLoad () {

        this.spRoker.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);


        this.WallPrefab = [this.WallPrefab1, ];
        this.EnemyPrefab = [this.EnemyPrefab1, this.EnemyPrefab2, ];
        this.enemies = [],
        this.enemiesData = [],

        this.pressed = false;
        this.enableIceOperation = true;

        this.cells = [];
        this.cellsNumW = 20;
        this.cellsNumH = 20;
        this.controlable = true;

        this.nowZoom = 1;
        this.starPositions = [];

        this.scrollViewItself = this.scrollView.getComponent('cc.ScrollView');

        this.initWidthHeightLoadData(this);
        this.showNPCs(this);
         
        this.setInputControl();
    },

    onTouchStart: function(event) {
        let touchPoint = event.getLocation();
        let pos = this.spRoker.node.convertToNodeSpaceAR(touchPoint);
        this.moveDir = this.getDirection(pos);
        this.updateRokerCenterPos(pos);
    },
    onTouchMove: function(event) {
        let touchPoint = event.getLocation();
        let pos = this.spRoker.node.convertToNodeSpaceAR(touchPoint);
        this.moveDir = this.getDirection(pos);
        this.updateRokerCenterPos(pos);
    },
    onTouchEnd: function(event) {
        this.updateRokerCenterPos(cc.v2(0, 0));
        this.moveDir = null;
    },
    onTouchCancel: function(event) {
        this.updateRokerCenterPos(cc.v2(0, 0));
        this.moveDir = null;
    },

    updateRokerCenterPos: function(pos){
        this.spSokerCenter.node.setPosition(pos);
    },

    updatePlayerPos: function(){
        // this.hero.NPC.x += dir.x;
        // this.hero.NPC.y += dir.y;
        this.tupdate(this);
    },

    getDirection: function(pos){
        let x = pos.x;
        let y = pos.y;
        if(y > Math.abs(x)){
            this.direction = 'w';
            return cc.v2(0,1);//上
        }else if(y < -Math.abs(x)){
            this.direction = 's';
            return cc.v2(0,-1);//下
        }else if(x > Math.abs(y)){
            this.direction = 'd';
            return cc.v2(1,0);//右
        }else{
            this.direction = 'a';
 
            return cc.v2(-1,0);//左
        }
    },

    showNPCs: function(self) {
        // show Hero
        self.hero = {
            NPC: cc.instantiate(self.HeroPrefab),
            x: self.heroX,
            y: self.heroY,
        };
        self.hero.NPC.getComponent('hero').game = self;
        self.node.addChild(self.hero.NPC);
        self.showHero(self, false);
        self.hero.NPC.setScale(self.cellWidth / self.hero.NPC.width);
        self.direction = 'w';

        // show Princess
        self.princess = {
            NPC: cc.instantiate(self.PrincessPrefab),
            x: self.princessX,
            y: self.princessY,
        };
        self.cells[self.princess.y][self.princess.x].NPCnum++;
        self.node.addChild(self.princess.NPC);
        self.princess.NPC.setScale(self.cellWidth / self.princess.NPC.width);
        self.showPlayer(self, self.princess);

        // showEnemies
        for (let enemy of self.enemiesData) {
            self.enemies.push({
                NPC: cc.instantiate(self.EnemyPrefab[enemy[2]]),
                x: enemy[1],
                y: enemy[0],
                seconds: 0,
                moveSeconds: enemy[3],
            })
        }
        for (let i = self.enemies.length; i < self.enemiesNum; i++) {
            self.enemies.push(self.createRandomNewEnemy(self));
        }

        for(let enemy of self.enemies) {
            self.cells[enemy.y][enemy.x].NPCnum++;
            self.node.addChild(enemy.NPC);
            enemy.NPC.setScale(self.cellWidth / enemy.NPC.width);
            self.showPlayer(self, enemy);
        }

        // showStars
        self.starNum = 0;

        for (let starPosition of self.starPositions) {
            self.createStar(self, starPosition[0], starPosition[1]);
        }
        for (let i = self.starPositions.length; i < self.starInitNum; i++) {
            self.createStar(self);
        }
    },

    start() {
        this.scrollViewItself.scrollToOffset(cc.v2(0, 0), 0);
        this.moveToCenter(this);
    },

    moveToCenter: function(self) {
        let NPCposition = self.getCellPosition(self, self.hero.y, self.hero.x);
        let newWorldPosition = self.node.convertToWorldSpace(NPCposition);
        let newOffset = self.scrollViewItself.getScrollOffset();
        if (newOffset.x < 0) {
            newOffset.x *= -1;
        }
        if (newOffset.y < 0) {
            newOffset.y *= -1;
        }
        newOffset.x -= cc.view.getVisibleSize().width / 2 - newWorldPosition.x;
        newOffset.y += cc.view.getVisibleSize().height / 2 - newWorldPosition.y;
        self.scrollViewItself.scrollToOffset(newOffset, 0);
        // 我不懂为啥不能一步到位，bug吗？
        setTimeout(function() {
            NPCposition = self.getCellPosition(self, self.hero.y, self.hero.x);
            newWorldPosition = self.node.convertToWorldSpace(NPCposition);
            // 我不懂为啥现在在cc.view.getVisibleSize().width / 2 - newWorldPosition.x === 0并且y也是一样的话，执行下面的部分会被移动？！！！！！！？
            // 什么玩意
            // 垃圾cocos毁我青春
            if (cc.view.getVisibleSize().width / 2 - newWorldPosition.x !== 0 || cc.view.getVisibleSize().height / 2 - newWorldPosition.y !== 0) {
                newOffset.x -= cc.view.getVisibleSize().width / 2 - newWorldPosition.x;
                newOffset.y += cc.view.getVisibleSize().height / 2 - newWorldPosition.y;
                self.scrollViewItself.scrollToOffset(newOffset, 0);
                console.log(newOffset);
            }
        }, 0);
    },

    createRandomNewEnemy: function(self) {
        let i = Math.floor(Math.random() * self.cellsNumH);
        let j = Math.floor(Math.random() * self.cellsNumW);
        let type = Math.floor(Math.random() * self.EnemyPrefab.length);
        // 不要和主人公重合！
        if (self.hero.x === j && self.hero.y === i) {
            return self.createRandomNewEnemy(self);
        }
        return {
            NPC: cc.instantiate(self.EnemyPrefab[type]),
            x: j,
            y: i,
            seconds: 0,
            moveSeconds: ENEMY_MOVE,
        };
    },

    randomStarPosition: function(self) {
        let i = Math.floor(Math.random() * self.cellsNumH);
        let j = Math.floor(Math.random() * self.cellsNumW);
        for (let data of self.starPositions) {
            if (data[0] === i && data[1] === j) {
                return self.randomStarPosition(self);
            }
        }
        // 不要和主人公重合！
        if ((self.hero.x === j && self.hero.y === i) || 
            (self.princessX === j && self.princessY === i)) {
            return self.randomStarPosition(self);
        }
        return [i, j];
    },

    deleteStar: function(self, i, j) {
        for (let index = 0; index < self.starPositions.length; index++) {
            if (self.starPositions[index][0] === i && self.starPositions[index][1] === j) {
                self.starPositions.splice(index, 1);
                break;
            }
        }
        cc.audioEngine.playEffect(self.StarAudio,false);
    },

    createStar: function(self, i = -1, j = -1) {
        let star = cc.instantiate(this.StarPrefab);
        this.node.addChild(star);
        let starComponent = star.getComponent('Star');
        starComponent.game = self;
        if (i < 0 || j < 0) {
            let position = self.randomStarPosition(self);
            i = position[0];
            j = position[1];
            self.starPositions.push([i, j]);
        }
        let newPosition = self.getCellPosition(self, i, j);
        starComponent.i = i;
        starComponent.j = j;
        star.setPosition(newPosition);
        star.setScale(self.cellHeight / star.height);
        star.zIndex = self.starAdder - newPosition.y;
        self.starNum++;
    },

    zoomBigger: function(self) {
        if (self.nowZoom < 3.3)
            self.nowZoom /= 0.75;
        self.mainView.setScale(self.nowZoom);
        self.setMainViewSize(self);
    },
    
    zoomSmaller: function(self) {
        if (self.nowZoom > 0.3)
            self.nowZoom *= 0.75;
        self.mainView.setScale(self.nowZoom);
        self.setMainViewSize(self);
    },

    zoomNormal: function(self) {
        self.nowZoom = 1;
        self.mainView.setScale(self.nowZoom);
        self.setMainViewSize(self);
    },
    
    moveToWhere: function(self, self_who, delta_y, delta_x) {
        self_who.NPC.stopAllActions();
        let enemyPosition = self.getCellPosition(self, self_who.y, self_who.x);
        if(0 <= self_who.x + delta_x && 0 <= self_who.y + delta_y && self_who.x + delta_x < self.cellsNumW && self_who.y + delta_y < self.cellsNumH
            && self.cells[self_who.y + delta_y][self_who.x + delta_x].data === EMPTY_CELL
        ) {
            self.cells[self_who.y][self_who.x].NPCnum--;
            self_who.y += delta_y;
            self_who.x += delta_x;
            enemyPosition = self.getCellPosition(self, self_who.y, self_who.x);
            // self_who.NPC.runAction(cc.moveTo(self.actionTimeMove*5,enemyPosition));
            self_who.NPC.setPosition(enemyPosition);
            self.cells[self_who.y][self_who.x].NPCnum++;
            return true;
        }
        return false;
    },
    enemyAutoOperate: function(self,self_who) {
        console.log("start move");
    
        let delta_y = self.hero.y - self_who.y;
        let delta_x = self.hero.x - self_who.x;
        if(delta_x < 0) {
            if(self.moveToWhere(self, self_who, 0, -1)) {//enemy向左移动
                return;
            }
            else {
               if(delta_y < 0) {
                   if(self.moveToWhere(self, self_who, -1, 0)) {//enemy向下移动
                       return;
                   }
                   else {
                       if(self.moveToWhere(self,self_who,0,1)) {//enemy向右移
                            return;
                       }
                       self.moveToWhere(self,self_who,1,0);//enemy向上移动
                   }
               }
               else if(delta_y === 0) {
                    if(self.moveToWhere(self, self_who, -1, 0)) {//enemy向下移动
                        return;
                    }
                    else {
                        if(self.moveToWhere(self,self_who,1,0)) {//enemy向上移
                            return;
                        }
                        self.moveToWhere(self,self_who,0,1);//enemy向右移动
                    }
               }
               else if(delta_y > 0) {
                   if(self.moveToWhere(self,self_who,1,0)) {//enemy向上移动
                       return;
                   }
                   else if(self.moveToWhere(self,self_who,0,1)) {//enemy向右移动
                       return;
                   }
                   self.moveToWhere(self,self_who,-1,0);//enemy向下移动
               }
            }
        }
        else if(delta_x === 0) {
            if(delta_y > 0) {
                if(self.moveToWhere(self,self_who,1,0)) {
                    return;
                }
                else if(self.moveToWhere(self,self_who,0,-1)) {
                    return;
                }
                else if(self.moveToWhere(self,self_who,0,1)) {
                    return;
                }
                self.moveToWhere(self,self_who,-1,0);
            }
            else if(delta_y === 0) {
                return;
            }
            else if(delta_y < 0) {
                if(self.moveToWhere(self,self_who,-1,0)) {
                    return;
                }
                else if(self.moveToWhere(self,self_who,0,-1)) {
                    return;
                }
                else if(self.moveToWhere(self,self_who,0,1)) {
                    return;
                }
                self.moveToWhere(self,self_who,1,0)
            }
        }
        else if(delta_x > 0) {
            if(self.moveToWhere(self, self_who, 0, 1)) {//enemy向you移动
                return;
            }
            else {
               if(delta_y < 0) {
                   if(self.moveToWhere(self, self_who, -1, 0)) {//enemy向下移动
                       return;
                   }
                   else {
                       if(self.moveToWhere(self,self_who,0,-1)) {//enemy向left移
                            return;
                       }
                       self.moveToWhere(self,self_who,1,0);//enemy向上移动
                   }
               }
               else if(delta_y === 0) {
                    if(self.moveToWhere(self, self_who, -1, 0)) {//enemy向下移动
                        return;
                    }
                    else {
                        if(self.moveToWhere(self,self_who,1,0)) {//enemy向上移
                            return;
                        }
                        self.moveToWhere(self,self_who,0,-1);//enemy向left移动
                    }
               }
               else if(delta_y > 0) {
                   if(self.moveToWhere(self,self_who,1,0)) {//enemy向上移动
                       return;
                   }
                   else if(self.moveToWhere(self,self_who,0,-1)) {//enemy向left移动
                       return;
                   }
                   self.moveToWhere(self,self_who,-1,0);//enemy向下移动
               }
            }
        }
    },

    showPlayer: function(self,self_who) {
        let NPCposition = self.getCellPosition(self, self_who.y, self_who.x);
        self_who.NPC.setPosition(NPCposition);
        self_who.NPC.zIndex = -NPCposition.y;
    },

    showHero: function(self, move = true) {
        let oldWorldPosition = self.node.convertToWorldSpace(self.hero.NPC.getPosition());
        let NPCposition = self.getCellPosition(self, self.hero.y, self.hero.x);
        let newWorldPosition = self.node.convertToWorldSpace(NPCposition);
        if (move) {
            self.hero.NPC.runAction(cc.moveTo(self.actionTimeMove, NPCposition));
        }
        else {
            self.hero.NPC.setPosition(NPCposition);
        }
        self.hero.NPC.zIndex = -NPCposition.y;
        if (!self.scrollViewItself.isScrolling() && move
        // 如果之前用户自己把小人拖出去了，就不要把它再拖进来了吧
        // 不能用cc.view.getFrameSize()！！！！！！！！！！！！！！！！！！！！！！！
         && oldWorldPosition.x < cc.view.getVisibleSize().width + self.cellWidth * self.nowZoom
         && oldWorldPosition.x > -self.cellWidth * self.nowZoom
         && oldWorldPosition.y < cc.view.getVisibleSize().height + self.cellHeight * self.nowZoom
         && oldWorldPosition.y > -self.cellHeight * self.nowZoom) {
            let newOffset = self.scrollViewItself.getScrollOffset();
            // 我觉得，这是bug！
            if (newOffset.x < 0) {
                newOffset.x *= -1;
            }
            if (newOffset.y < 0) {
                newOffset.y *= -1;
            }
            if (newWorldPosition.x > cc.view.getVisibleSize().width - self.cellWidth * self.nowZoom * 3) {
                newOffset.x += (newWorldPosition.x - (cc.view.getVisibleSize().width - self.cellWidth * self.nowZoom * 3));
            }
            else if (newWorldPosition.x < self.cellWidth * self.nowZoom * 3) {
                newOffset.x += (newWorldPosition.x - self.cellWidth * self.nowZoom * 3);
            }
            if (newWorldPosition.y > cc.view.getVisibleSize().height - self.cellHeight * self.nowZoom * 3) {
                // 滚动是相对于左上角，所以这里是-=……
                newOffset.y -= (newWorldPosition.y - (cc.view.getVisibleSize().height - self.cellHeight * self.nowZoom * 3));
            }
            else if (newWorldPosition.y < self.cellHeight * 3) {
                newOffset.y -= (newWorldPosition.y - self.cellHeight * self.nowZoom * 3);
            }
            self.scrollViewItself.scrollToOffset(newOffset, self.actionTimeMoveScroll);
        }
    },

    setButtonControl: function (event, data) {
        if (!this.controlable) {
            return;
        }
        let self = this;
        // 控制一下按键的速度！
        let move = true;
        if (!self.pressed) {
            self.pressed = true;
            switch(data) {
                case 'a':
                    self.direction = 'a';
                    break;
                case 'd':
                    self.direction = 'd';
                    break;
                case 's':
                    self.direction = 's';
                    break;
                case 'w':
                    self.direction = 'w';
                    break;
                default:
                    move = false;
            }
            if (move) {
                self.tupdate(self);
                setTimeout(()=>self.pressed = false, self.delayTimePressKey * 1000);
            }
            else {
                self.pressed = false;
            }
        }
        switch(data) {
            case '1':
                self.zoomSmaller(self);
                break;
            case '2':
                self.zoomNormal(self);
                break;
            case '3':
                self.zoomBigger(self);
                break;
            case '4':
                if (self.enableIceOperation) {
                    self.iceOperate(self);
                }
                break;
        }
    },

    setInputControl: function () {
        let self = this;
        // 添加键盘事件监听
        // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向加速
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            switch(event.keyCode) {
                case cc.KEY.a:
                case cc.KEY.left:
                    self.setButtonControl(self, 'a');
                    break;
                case cc.KEY.d:
                case cc.KEY.right:
                    self.setButtonControl(self, 'd');
                    break;
                case cc.KEY.s:
                case cc.KEY.down:
                    self.setButtonControl(self, 's');
                    break;
                case cc.KEY.w:
                case cc.KEY.up:
                    self.setButtonControl(self, 'w');
                    break;
                case cc.KEY.num1:
                    self.setButtonControl(self, '1');
                    break;
                case cc.KEY.num2:
                    self.setButtonControl(self, '2');
                    break;
                case cc.KEY.num3:
                    self.setButtonControl(self, '3');
                    break;
                case cc.KEY.num4:
                case cc.KEY.space:
                case cc.KEY.enter:
                    self.setButtonControl(self, '4');
                    break;
            }
        });
    },

    tupdate: function(self) {
        switch (self.direction) {
            case 's':
                if (self.hero.y > 0 && self.cells[self.hero.y - 1][self.hero.x].data <= 0) {
                    self.hero.y -= 1;
                }
                self.hero.NPC.runAction(cc.rotateTo(0, 180), self.actionTimeRotate);
                break;
            case 'w':
                if (self.hero.y < self.cellsNumH - 1 && self.cells[self.hero.y + 1][self.hero.x].data <= 0) {
                    self.hero.y += 1;
                }
                self.hero.NPC.runAction(cc.rotateTo(0, 0), self.actionTimeRotate);
                break;
            case 'a':
                if (self.hero.x > 0 && self.cells[self.hero.y][self.hero.x - 1].data <= 0) {
                    self.hero.x -= 1;
                }
                self.hero.NPC.runAction(cc.rotateTo(0, 270), self.actionTimeRotate);
                break;
            case 'd':
                if (self.hero.x < self.cellsNumW - 1 && self.cells[self.hero.y][self.hero.x + 1].data <= 0) {
                    self.hero.x += 1;
                }
                self.hero.NPC.runAction(cc.rotateTo(0, 90), self.actionTimeRotate);
                break;
        }
        self.showHero(self);
    },

    iceOperate: function(self) {
        self.enableIceOperation = false;
        let hero_x = self.hero.x;
        let hero_y = self.hero.y;
        let adder_x = 0, adder_y = 0;
        
        switch(self.direction) {
            case 'w':
                adder_y = 1;
                break;
            case 's':
                adder_y = -1;
                break;
            case 'a':
                adder_x = -1;
                break;
            case 'd':
                adder_x = 1;
                break;
        }
        hero_x += adder_x;
        hero_y += adder_y;
        if (0 <= hero_x && 0 <= hero_y && hero_x < self.cellsNumW && hero_y < self.cellsNumH) {
            if (self.cells[hero_y][hero_x].data === ICE_CELL) {
                function addCheck() {
                    if (0 <= hero_x && 0 <= hero_y && hero_x < self.cellsNumW && hero_y < self.cellsNumH &&
                        self.cells[hero_y][hero_x].data === ICE_CELL) {
                            self.deleteIce(self, hero_y, hero_x);
                            cc.audioEngine.playEffect(self.iceBreakAudio,false);
                            setTimeout(()=>{
                                hero_x += adder_x;
                                hero_y += adder_y;
                                addCheck();
                            }, self.iceOperateTime * 1000);
                        }
                    else {
                        self.enableIceOperation = true;
                    }
                }
                addCheck();
            }
            else if (self.cells[hero_y][hero_x].data === EMPTY_CELL && self.cells[hero_y][hero_x].NPCnum === 0) {
                let nowDirection = self.direction;
                function deleteCheck() {
                    if (0 <= hero_x && 0 <= hero_y && hero_x < self.cellsNumW && hero_y < self.cellsNumH &&
                        self.cells[hero_y][hero_x].data === EMPTY_CELL && self.cells[hero_y][hero_x].NPCnum === 0) {
                            self.drawIce(self, hero_y, hero_x, true, nowDirection);
                            cc.audioEngine.playEffect(self.iceAudio,false);
                            setTimeout(()=>{
                                hero_x += adder_x;
                                hero_y += adder_y;
                                deleteCheck();
                            }, self.iceOperateTime * 1000);
                        }
                    else {
                        self.enableIceOperation = true;
                    }
                }
                deleteCheck();
            }
            else {
                self.enableIceOperation = true;    
            }
        }
        else {
            self.enableIceOperation = true;
        }
    },

    drawIce: function(self, i, j, needShow = true, direction = 'w') {
        let newIce = cc.instantiate(self.IcePrefab);
        let newPosition = self.getCellPosition(self, i, j);
        self.node.addChild(newIce, -newPosition.y);
        if (needShow) {
            if (direction === 'w' || direction === 's') {
                newIce.setScale(self.cellWidth / newIce.width, 0);
                if (direction === 'w') {
                    newIce.setPosition(newPosition.x, newPosition.y - self.cellHeight / 2);
                }
                else {
                    newIce.setPosition(newPosition.x, newPosition.y + self.cellHeight / 2);
                }
            }
            else {
                newIce.setScale(0, self.cellWidth / newIce.width);
                if (direction === 'a') {
                    newIce.setPosition(newPosition.x + self.cellWidth / 2, newPosition.y);
                }
                else {
                    newIce.setPosition(newPosition.x - self.cellWidth / 2, newPosition.y);
                }
            }
            newIce.runAction(cc.scaleTo(self.iceOperateTime, self.cellWidth / newIce.width, self.cellWidth / newIce.width));
            newIce.runAction(cc.moveTo(self.iceOperateTime, newPosition.x, newPosition.y));
        }
        else {
            newIce.setScale(self.cellWidth / newIce.width);
            newIce.setPosition(newPosition);
        }
        self.cells[i][j].node = newIce;
        self.cells[i][j].data = ICE_CELL;
        
    },

    drawWall: function(self, i, j, type) {
        // 因为墙的编号从2开始
        console.log(self.WallPrefab);
        let newWall = cc.instantiate(self.WallPrefab[type - 2]);
        let newPosition = self.getCellPosition(self, i, j);
        self.node.addChild(newWall, -newPosition.y);
        newWall.setScale(self.cellWidth / newWall.width);
        newWall.setPosition(newPosition);
        self.cells[i][j].node = newWall;
        self.cells[i][j].data = WALL_CELL;
    },

    deleteIce: function(self, i, j, needShow = true) {
        if (self.cells[i][j]) {
            if (needShow && self.cells[i][j].node) {
                let startOpacity = self.cells[i][j].node.opacity;
                let m = self.opacityNums;
                let opacityAction = setInterval(function() {
                    m--;
                    self.cells[i][j].node.opacity = startOpacity * m / self.opacityNums;
                }, self.iceOperateTime * 1000 / self.opacityNums);
                setTimeout(()=>{
                    clearInterval(opacityAction);
                    self.node.removeChild(self.cells[i][j].node);
                    self.cells[i][j].node = null;
                    self.cells[i][j].data = EMPTY_CELL;
                }, self.iceOperateTime * 1000);
            }
            else {
                if (self.cells[i][j].node) {
                    self.node.removeChild(self.cells[i][j].node);
                    self.cells[i][j].node = null;
                }
                self.cells[i][j].data = EMPTY_CELL;
            }
        }
    },

    gameOver: function() {
        this.controlable = false;
        this.gameover = true;
        cc.director.loadScene("GameOver");
    },

    update(dt) {
        for (let enemy of this.enemies) {
            enemy.seconds += 1;
            if(enemy.seconds >= enemy.moveSeconds) {
                enemy.seconds = 0;
                this.enemyAutoOperate(this, enemy);
            }
        }

        this.playerSecond += 1;
        if(this.playerSecond >= PLAYER_MOVE){
            if(this.moveDir){
                this.updatePlayerPos();
            }
            this.playerSecond = 0;
        }

    },
});
