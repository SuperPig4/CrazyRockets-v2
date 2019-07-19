const Cm = require('script_logic/common');
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    update (dt) {
        if(!Cm.stop) {
            if((this.node.y + 100) < parseInt(-cc.view.getVisibleSize().height)) {
                this.node.destroy();
            } else {
                this.node.y = (this.node.y - (this.speed * dt));
            }
        }
    },


    // 设置移动速度
    setSpeed (speed) {
        this.speed = speed;
    },

    // 释放
    release () {
        var num = this.node.children.length;
        for(var i = 0; i < num; i++) {
            this.node.children[0].getComponent(this.node.children[0].name).release();
        }
        this.node.destroy();
    }
});
