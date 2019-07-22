// 障碍生成逻辑

const Privatex = {

    // 获得块信息
    getBlockInfo : function() {
        var viewSize = cc.view.getVisibleSize() , res = {};
        if(Math.round(Math.random())) {
            res.num = 4; 
            res.w = parseInt((viewSize.width - 10) / 4); 
            res.fx = (viewSize.width - (res.w * 4)) / 6; 
        } else {
            res.num = 3; 
            res.w = parseInt((viewSize.width - 40) / 3);
            res.fx = (viewSize.width - (res.w * 3)) / 4; 
        }
        return res;
    },

    // 创建对象池
    createdNodePools : function(prefabs) {
        this.blockPools = [];
        for(var ix in prefabs) {
            this.blockPools[ix] = {
                key : ix,
                pool : new cc.NodePool(),
                prefab : prefabs[ix]
            };

            for(let i = 0; i < 20; i++) {
                this.blockPools[ix]['pool'].put(cc.instantiate(prefabs[ix]));
            }
        }
    },

    // 获得对象池对象
    getNodePool (key) {
        if(this.blockPools[key]['pool'].size() > 0) {
            return this.blockPools[key]['pool'].get();
        } else {
            return cc.instantiate(this.blockPools[key].prefab);
        }
    },

    // 获得某个对象池对象
    getNodePoolObject (key) {
        return this.blockPools[key];
    },

    // 一个数和另一个数之间的随机数
    rnd(n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
    },

}

module.exports = function(prefabs) {

    Privatex.createdNodePools.call(this, prefabs)

    // 创造
    this.created = function(speed) {
        var container = new cc.Node(),
        blockInfo = Privatex.getBlockInfo(),
        // 块最小生命值key
        blockMinLifeValKey = Math.floor(Math.random() * blockInfo.num + 1),
        // 节点对象池key
        // nodePoolKey = (blockInfo.num == 4) ? 1 : 0;
        nodePoolKey = 0;

        // 增加脚本
        container.setAnchorPoint(0, 1);
        container.addComponent('block_container');
        container.getComponent('block_container').setSpeed(speed);
        for(var i = 0; i < blockInfo.num; i++) {
            // 坐标
            var x = (cc.view.getVisibleSize().width / 2) - ((blockInfo.w + blockInfo.fx) * (i + 1)),
            node = Privatex.getNodePool.call(this, nodePoolKey),
            // 生命值
            blockLife = (i == blockMinLifeValKey) ? Privatex.rnd(15,20) : Math.floor(Math.random()*60+1) ;

            node.active = true;
            // node.setPosition(x, (cc.view.getVisibleSize().height / 2) + 100);
            node.setPosition(x, (cc.view.getVisibleSize().height / 2));
            node.setContentSize(blockInfo.w, 100);
            node.getComponent(node._name).setNum(blockLife);
            node.getComponent(node._name).setPool(Privatex.getNodePoolObject.call(this, nodePoolKey));
            node.getComponent(cc.BoxCollider).size = {width:node.width, height:node.height}
            node.getComponent(cc.BoxCollider).offset = {x:(node.width / 2),y:-(node.height / 2)}
            // node.getChildByName('num').getComponent(cc.Widget).updateAlignment();
            container.addChild(node);
        }
        container.active = true;
        cc.find("Canvas/block_bg").addChild(container);
    }

}