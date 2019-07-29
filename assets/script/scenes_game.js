
const BlockLogic = require('script_logic/block_logic');
const Cm = require('script_logic/common');

cc.Class({
    extends: cc.Component,

    properties: {
        // 分数
        fraction : {
            type: cc.Integer,
            get : function() {
                return isNaN(this._fraction) ? 0 : this._fraction;
            },
            set : function (value) {
                this._fraction = value;
                this.node.getChildByName('scoring').getComponent(cc.Label).string  = value;
                this.node.getChildByName('scoring').setPosition(-(this.node.width - 60) / 2, (this.node.height - 100) / 2);
            }
        },
        // 障碍移动速度 - 会根据难度动态变动
        blockSpeed : 230,
        // 定时器
        setIntervalFunAr : []
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        Cm.stop = false;

        var playerType = 'default_aircraft';
        // var playerType = 'three_aircraft';

        // 加载飞机
        cc.loader.loadRes("aircraft/prefab/" + playerType, (err, prefab) => {
            this.player = cc.instantiate(prefab);
            this.player.name = 'aircraft';
            this.node.addChild(this.player);
            this.initAction();
        });

        // 加载障碍
        cc.loader.loadResDir("block/prefab", (err, prefab, urls) => {
            this.blockStart(prefab);
        });

        this.initEvent();
        this.loadAircraftSelectUi();
    },

    start () {
        this.fraction = 0;
    },


    // 初始化事件
    initEvent () {
        // 暂停按钮
        this.node.getChildByName('stop').on(cc.Node.EventType.TOUCH_START, (e) => {
            e.stopPropagation();
            Cm.stop = true;
            this.stopInterval();
            this.node.getChildByName('stop_action').active = true;
        })

        // 防止穿透
        this.node.getChildByName('stop_action').on(cc.Node.EventType.TOUCH_START, (e) => {
            e.stopPropagation();
            Cm.stop = false;
            this.restoreInterval();
            this.node.getChildByName('stop_action').active = false;
        })

        // 重来
        this.node.getChildByName('stop_action').getChildByName('rest').on(cc.Node.EventType.TOUCH_END, (e) => {
            e.stopPropagation();
            this.restart();
            this.node.getChildByName('stop_action').active = false;
        })

        // 退出
        this.node.getChildByName('stop_action').getChildByName('retreat').on(cc.Node.EventType.TOUCH_END, (e) => {
            e.stopPropagation();
            cc.director.loadScene('start')
        })

        // 选择子弹
        this.node.getChildByName('stop_action').getChildByName('select_aircraft').on(cc.Node.EventType.TOUCH_END, (e) => {
            e.stopPropagation();
            this.node.getChildByName('stop_action').active = false;
            this.node.getChildByName('select_aircraft').active = true;
        })
    },

    // 生成障碍
    blockStart (prefabs) {
        this.blockActObject = new BlockLogic(prefabs);
        var min = 10,max = 15;
        this.blockActObject.created(this.blockSpeed, min, max);
        this.setInterval(() => {

            // 调整障碍生命 共三个等级
            if(this.fraction > 300 && this.fraction < 400 && min != 20) {
                min += 10;
                max += 10;
            } else if(this.fraction > 600 && this.fraction < 700 && min != 30) {
                min += 10;
                max += 10;
            } else if(this.fraction > 1000 && this.fraction < 1100 && min != 40) {
                min += 10;
                max += 10;
            }

            this.blockActObject.created(this.blockSpeed, min, max);
        }, 2.5, 'block');
    }, 

    // 初始化控制
    initAction () {
        this.player.setPosition(0, parseInt('-'+((this.node.height - this.player.height)/2)));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (e) => {
            if(e.getID() == 0 && !Cm.stop) {
                var location = this.node.convertToNodeSpaceAR(e.getLocation()),
                lastLoaction = this.node.convertToNodeSpaceAR(e.getPreviousLocation()),
                width = ((this.node.width - this.player.width) / 2),
                height = ((this.node.height - this.player.height) / 2),
                num = {x:0,y:0};

                // x
                if(location.x > lastLoaction.x) {
                    num.x = this.player.x + (location.x - lastLoaction.x);
                    if(num.x >= width) {
                        return false;
                    }
                } else {
                    num.x = this.player.x - (lastLoaction.x - location.x);
                    if(num.x < parseInt('-'+width)) {
                        return false;
                    }
                }

                // y
                if(location.y > lastLoaction.y) {
                    num.y = this.player.y + (location.y - lastLoaction.y);
                    if(num.y >= height) {
                        return false;
                    }
                } else {
                    num.y = this.player.y - (lastLoaction.y - location.y);
                    if(num.y < parseInt('-'+height)) {
                        return false;
                    }
                }

                this.player.setPosition(num.x,num.y);
            }

        })
    },

    // 自增
    increase (n = 1) {
        this.fraction += n;
    },

    // 定时器
    setInterval (fun, interval, key) {
        this.setIntervalFunAr.push({
            fun : fun,
            interval : interval,
            key : key,
        });
        this.schedule(fun, interval);
    },

    // 暂停所有定时器
    stopInterval (key) {
        for(var i in this.setIntervalFunAr) {
            var item = this.setIntervalFunAr[i];
            this.unschedule(item.fun, item.interval);
        }
    },

    // 恢复暂停
    restoreInterval () {
        for(var i in this.setIntervalFunAr) {
            var item = this.setIntervalFunAr[i];
            this.schedule(item.fun, item.interval);
        }
    },

    // 删除某个定时器
    deleteInterval (key) {
        for(var i in this.setIntervalFunAr) {
            var item = this.setIntervalFunAr[i];
            if(item.key == key) {
                this.unschedule(item.fun, item.interval);
                this.setIntervalFunAr.splice(i, 1);
                break;
            }
        }
    },

    // 重来
    restart () {
        this.fraction = 0;
        // 释放所有块节点
        var blockChildNum = this.node.getChildByName('block_bg').children.length;
        for(var i = 0; i < blockChildNum; i++) {
            this.node.getChildByName('block_bg').children[i].getComponent('block_container').release();
        }

        // 释放所有子弹
        this.player.getComponent('default_aircraft').release();

        // 恢复定时器
        Cm.stop = false;
        this.restoreInterval();
    },

    // 飞机触碰到块
    dead () {
        Cm.stop = true;
        this.player.getComponent(cc.Animation).play();
        this.player.getComponent(cc.AudioSource).play();
        this.player.getComponent(cc.Animation).on('finished',() => {
            Cm.lastGameFraction = this.fraction;
            cc.director.loadScene('share');
        })
    },

    // 加载武器选择Ui
    loadAircraftSelectUi () {
        cc.find("Canvas/select_aircraft").zIndex = 10;
        var copyNode = cc.find("Canvas/select_aircraft/select/view/item_copy");
        cc.loader.loadResDir("aircraft/icon_list", cc.SpriteFrame, (err, SpriteFrame, urls) => {
            var ju = 30;
            for(var i in SpriteFrame) {
                var newNode = cc.instantiate(copyNode);
                newNode.name = SpriteFrame[i].name;
                newNode.getComponent(cc.Sprite).spriteFrame = SpriteFrame[i];
                newNode.getComponent(cc.Widget).left = ju;
                newNode.on(cc.Node.EventType.TOUCH_END, (e) => {
                    // 加载飞机
                    cc.loader.loadRes("aircraft/prefab/" + e.target.name, (err, prefab) => {
                        // 删除旧的
                        var position = this.node.getChildByName('aircraft').getPosition();
                        this.node.getChildByName('aircraft').removeFromParent(true);
                        this.deleteInterval('aircraft');
                        // 增加
                        this.player = cc.instantiate(prefab);
                        this.player.setPosition(position.x, position.y);
                        this.player.name = 'aircraft';
                        this.node.addChild(this.player);
                        // 启动
                        this.node.getChildByName('select_aircraft').active = false;
                        Cm.stop = false;
                        this.restoreInterval();
                    });
                })
                newNode.active = true;
                ju += 100;
                cc.find("Canvas/select_aircraft/select/view/content").addChild(newNode);
            }
            // 调整父节点宽度
            if(ju > this.node.width) {
                cc.find("Canvas/select_aircraft/select/view/content").width = ju;
            }
        });
    }
})
