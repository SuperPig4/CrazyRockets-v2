// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 开始
        this.node.getChildByName('button').getChildByName('start_game').on(cc.Node.EventType.TOUCH_END, (e) => {
            cc.director.preloadScene("game", function () {
                cc.director.loadScene('game')
            });
        })

        // 排行榜
        this.node.getChildByName('button').getChildByName('ranking').on(cc.Node.EventType.TOUCH_END, () => {
            cc.director.loadScene('ranking');
        })

    },

    // update (dt) {},
});
