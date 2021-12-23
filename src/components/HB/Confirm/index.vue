<template>
  <a-modal
    v-model="visible"
    ok-text="确认"
    cancel-text="取消"
    centered
    :closable="false"
    :maskClosable="false"
    :destroyOnClose="true"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <template slot="title">
      <div class="title">{{title}}</div>
    </template>

    <!-- <template slot="footer">
      <div class="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
      </div>
    </template> -->
    <div class="content">
      <div class="delete">
        {{content}}
      </div>
    </div>
  </a-modal>
</template>

<script>

// import Vue from "vue";
// import 'ant-design-vue/dist/antd.css'
// import { Modal, Button } from 'ant-design-vue'
// Vue.use(Modal)
// Vue.use(Button)

// 定义一个返回的闭包函数
var callback = function(){}

export default {
  name: "hConfirm",
  components: {},
  data() {
    return {
      visible: false,
      loading: false,
      title: '',
      content: '',
      
    };
  },

  

  created() {},
  
  methods: {
    //---------------------------------公共方法-------------------------------------
    _show(title, content, cb) {
      this.visible = true;
      this.title = title;
      this.content = content;

      callback = cb
    },

    //-------------------------------------事件--------------------------------------
    // 取消
    handleCancel() {
      this.visible = false;
    },

    // 确认
    handleOk() {
      this.visible = false;
      callback()
    },

    //-------------------------------------私有方法--------------------------------------

    
    //-------------------------------------接口--------------------------------------

    

    //-------------------------------------通知--------------------------------------
  },
};
</script>

<style scoped lang="less">
.contain {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.title {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  display: flex;
  justify-content: center;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>