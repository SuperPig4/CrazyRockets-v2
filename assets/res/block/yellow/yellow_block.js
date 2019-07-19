const Cm = require('script_logic/common');
cc.Class({
    extends: cc.Component,

    properties: {
        num : {
            type: cc.Integer,
            get : function() {
                return this._num;
            },
            set: function (value) {
                this._num = value;
                this.node.children[0].getComponent(cc.Label).string  = value;
                this.node.children[0].setPosition((this.node.width / 2), parseInt(-this.node.height / 2));
            }
        },
        //块声效
        blockBurstSound : {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    update (dt) {
        if(!Cm.stop) {
            if((this.node.parent.y + this.node.height) < parseInt(-(cc.view.getVisibleSize().height))) {
                this.pool.pool.put(this.node);
            }
        }
    },

    // 碰撞时回调
    onCollisionEnter (e, x) {
        switch(e.node.name) {
            case 'default_bullet' : 
                    // 子弹碰撞
                    this.node.color = new cc.Color(218, 131, 231);
                    cc.find('Canvas').getComponent('scenes_game').increase();
                    e.node.getComponent(e.node.name).release();
                    if(this.num <= 1) {
                        cc.audioEngine.play(this.blockBurstSound, false, 1);
                        this.release();
                    } else {
                        this.num--;
                    }

                    this.scheduleOnce(() => {
                        this.node.color = new cc.Color(255, 255, 255);
                    },0.1)
                break;
            case 'default_aircraft' :
                    // 主角碰撞
                    cc.find('Canvas').getComponent('scenes_game').dead();
                break;
        }
    },

    onCollisionExit () {
        
    },

    // 直接释放
    release () {
        this.pool.pool.put(this.node);
    },

    // 设置num
    setNum (num) {
        this.num = num;
        // this.node.getChildByName('num').getComponent(cc.Label).string = num;
    },

    // 块队列
    setPool(self) {
        this.pool = self;
    },


});
