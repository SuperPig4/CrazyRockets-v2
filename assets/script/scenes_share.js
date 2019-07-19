const Cm = require('script_logic/common');

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.getChildByName('fraction').getComponent(cc.Label).string = Cm.lastGameFraction;

        // 再来一次
        this.node.getChildByName('button').getChildByName('again').on(cc.Node.EventType.TOUCH_START, () => {
            cc.director.loadScene('game');
        })

        // 分享
        this.node.getChildByName('button').getChildByName('again').on(cc.Node.EventType.TOUCH_START, () => {
            cc.director.loadScene('game');
        })
    },

});
