<template>
  <a-card>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h3 style="margin: 0;">{{title}}</h3>
        <h5 style="color: gray">{{subTitle}}</h5>
      </div>
      <span></span>
      <div>
        <template v-for="item in items">
          <a-button style="margin: 3px" @click="btnClick(item)" :key="item.value" :icon="item.icon">{{ item.title }}</a-button>
        </template>
      </div>
    </div>
    <!-- <span >共搜索到{{ searchNum }}条数据</span> -->
    <div
      v-if="selectNum"
      style="border: 1px solid white;margin-top: 10px;background-color: #E6F3FC;display: flex;align-items: center;border-radius:5px;height: 40px">
      <a-icon type="info-circle" style="margin-left: 10px;color: #00A0E9"/>
      <span style="margin-left: 15px;height: 21px">已选择<span style="color: #00A0E9">{{ selectNum }}</span>项数据</span>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'hHeader',
  components: {},
  props: {
    title: { // 标题
      type: String,
    },
    subTitle: { // 副标题
      type: String,
    },
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    searchNum: {
      type: Number,
    },
    selectNum: {
      type: Number,
    }
  },
  data () {
    return {}
  },

  methods: {
    //  --------------------------事件----------------------------
    btnClick (item) {
      this.$emit('btnClick', item)
    }
  }
}
</script>

<style scoped>
</style>
