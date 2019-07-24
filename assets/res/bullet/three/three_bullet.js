
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

    // 重置位置信息
    setPositionType(type) {
        this.positionType = type;
    },

    update (dt) {
        if(!Cm.stop) {
            if(this.node.y > (this.node.parent.parent.height / 2)) {
                this.release();
            } else {
                if(this.positionType) {
                    var y = this.node.y + (600 * dt);
                    switch(this.positionType) {
                        case 'left' :
                                this.node.setPosition(this.node.x + (200 * dt), y);
                            break;
                        case 'center' :
                                this.node.setPosition(this.node.x, y);
                            break;
                        case 'right' :
                                this.node.setPosition(this.node.x - (200 * dt), y);
                            break;
                    }
                }
            }
        }
    },

    // 直接释放
    release () {
        this.aircraft.bulletPool.put(this.node);
    },
});
