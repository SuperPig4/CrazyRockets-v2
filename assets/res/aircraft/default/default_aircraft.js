const Cm = require('script_logic/common');
cc.Class({
    extends: cc.Component,

    properties: {
        // 子弹 预制资源
        bulletPrefab : cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.zIndex = 2;
        this.initBulletNodePool(30);
    },

    start () {
        this.bulletStart();
    },

    // 初始化子弹对象池
    initBulletNodePool(count) {
        this.bulletPool = new cc.NodePool();
        for(let i = 0; i < count; i++) {
            var enemy = cc.instantiate(this.bulletPrefab);
            this.bulletPool.put(enemy);
        }
    },

    // 取出对象池中的子弹
    getBulletNodePool() {
        if(this.bulletPool.size() > 0) {
            return this.bulletPool.get();
        } else {
            return cc.instantiate(this.bulletPrefab);
        }
    },

    // 开始生成子弹
    bulletStart () {
        cc.find('Canvas').getComponent('scenes_game').setInterval(() => {
            // 创建节点
            var node = this.getBulletNodePool();
            node.setPosition(this.node.x, this.node.y);
            node.zIndex = 1;
            node.active = true;
            node.getComponent('default_bullet').setAircraft(this);
            cc.find("Canvas/bullet_bg").addChild(node);
        }, 0.1);
    },

    // 释放
    release () {
        var bulletChildNum = cc.find("Canvas/bullet_bg").children.length;
        for(var i = 0; i < bulletChildNum; i++) {
            if(cc.find("Canvas/bullet_bg").children[0]) {
                cc.find("Canvas/bullet_bg").children[0].getComponent(cc.find("Canvas/bullet_bg").children[0].name).release();
            }
        }
    }
});
