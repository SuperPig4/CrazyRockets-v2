
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        // 监听返回事件
        this.node.getChildByName('button').getChildByName('back').on(cc.Node.EventType.TOUCH_END, () => {
            cc.director.loadScene('start');
        })

        var contentNode = cc.find("rankingBg/view/content", this.node);
        for(var i = 0; i < 5; i++) {
            var node = cc.instantiate(this.node.getChildByName('ranking_item_node'));
            // 重置参数
            node.getChildByName('sort').getComponent(cc.Label).string = (i + 1);
            // var url = 'https://tper.jungongfang.cn/CrossOrigin.php?url=' + (data.userInfo.avatar);
            // httpRequest({
            //     url: url,
            //     async: true,
            //     responseType: 'arraybuffer',
            //     callback: function (data) {
            //         //把请求回来的数据解析成图片的过程，图片的使用一定要在onload之后，如果不在onload之后，可能图片数据还没有解析出来，下面的代码就调用了，会报错。
            //         var blob = new Uint8Array(data.response);
            //         var img = new Image();
            //         img.src = "data:image/png;base64," + Base64.encode(blob);
            //         img.onload = function () {
            //             var texture = new cc.Texture2D();
            //             texture.generateMipmaps = false;
            //             texture.initWithElement(img);
            //             texture.handleLoadedTexture();
            //             prefab.getChildByName('userAvatar').getChildByName('userAvatar').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            //         }
            //     }.bind(this)
            // });
            //昵称
            // prefab.getChildByName('userName').getComponent(cc.Label).string = data.userInfo.nickname;
            
            if(i % 2) {
                node.color = new cc.Color(221, 235, 240);
            }
            node.active = true;
            node.getComponent(cc.Widget).isAlignTop = true;
            node.getComponent(cc.Widget).top = 100 * i;
            contentNode.addChild(node)
        }
    },

    start () {

    },

    // update (dt) {},
});
