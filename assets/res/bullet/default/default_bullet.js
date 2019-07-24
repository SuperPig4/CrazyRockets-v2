
const Cm = require('script_logic/common');
cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:
    onLoad() {},

    onEnable () {
        this.node.getComponent(cc.AudioSource).play();
    },

    // 重置飞机节点
    setAircraft(self) {
        this.aircraft = self;
    },

    update (dt) {
        if(!Cm.stop) {
            if(this.node.y > (this.node.parent.parent.height / 2)) {
                this.release();
            } else {
                this.node.setPosition(this.node.x, (this.node.y + (700 * dt)));
            }
        }
    },


    // 直接释放
    release () {
        this.aircraft.bulletPool.put(this.node);
    },
});
