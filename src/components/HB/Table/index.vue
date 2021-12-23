<template>
  <a-card>
    <a-table
      theme="light"
      :rowKey="(record,index)=>{return index}"
      :data-source="dataSource"
      :pagination="isPagination ? pagination : false"
      @change="handleTableChange"
      :loading="loading"
      :row-selection="rowSelection"
      :expand-row-by-click="true"
      :expand-icon-column-index=2
      style="background: #fff"
    >

      <a-table-column
          v-for="(col) in columnList"
          :key="col.dataIndex"
          :title="col.title"
          :data-index="col.dataIndex"
          :customRender="col.customRender"
          :align="col.align"
          >
          <template slot-scope="text, record, index">
      <!-- <div v-for="(col, index) in columnList" :key="col.dataIndex" :slot="col.dataIndex" slot-scope="text, record, index"> -->
            <template v-if="col.dataType == TYPE_ENUM.INPUT">
              <a-input :placeholder="col.placeholder || '请输入' + col.title" v-model="record[col.dataIndex]" />
            </template>

            <template v-else-if="col.dataType == TYPE_ENUM.INPUT_NUMBER">
              <a-input-number
                :placeholder="col.placeholder || '请输入' + col.title"
                :min="col.min"
                :max="col.max"
                style="width: 100%"
                v-model="record[col.dataIndex]"
              />
            </template>

            <template v-else-if="col.dataType == TYPE_ENUM.SELECT">
              <a-select :placeholder="col.placeholder || '请选择' + col.title" v-model="record[col.dataIndex]">
                <a-select-option v-for="selectItem in col.selectItems" :key="selectItem.value">
                  {{ selectItem.label }}
                </a-select-option>
              </a-select>
            </template>

            <template v-else-if="col.dataType == TYPE_ENUM.SELECT_FILTER">
              <a-select
                show-search
                :placeholder="col.placeholder || '请选择' + col.title"
                option-filter-prop="children"
                :filter-option="true"
                v-model="record[col.dataIndex]"
              >
                <a-select-option v-for="selectItem in item.selectItems" :key="selectItem.value">
                  {{ selectItem.label }}
                </a-select-option>
              </a-select>
            </template>

            <template v-else-if="col.dataType == TYPE_ENUM.DATEPICKER">
              <a-date-picker
                v-model="record[col.dataIndex]"
                show-time
                allowClear
                :placeholder="col.placeholder || '请选择' + col.title"
              />
            </template>

            <template v-else-if="col.dataType == TYPE_ENUM.INPUT_TEXT_AREA">
              <a-input type="textarea" v-model="record[col.dataIndex]" />
            </template>

            <template v-else-if="col.dataType == TYPE_ENUM.LINK">
              <a @click="handleClick(record, col)">{{ text }}</a>
            </template>

            <!-- 图片 -->
            <template v-else-if="col.dataType == TYPE_ENUM.IMG">
              <img :src="text"  :style="'width: ' + (col.imgW || '60px') + ';height: ' + (col.imgW || '60px') + ';object-fit: cover;'"/>
            </template>

            <!-- 需要转换的数据 -->
            <template v-else-if="col.dataType == TYPE_ENUM.CHANGE">
              {{ getLabel(col.selectItems, text)}}
            </template>

            <!-- 操作 -->
            <template v-else-if="col.dataType == TYPE_ENUM.OPERATION">
              <span v-for="(operation, opIndex) in col.selectItems" :key="operation.value">
                <a-divider type="vertical" v-if="opIndex > 0"></a-divider>
                <a-tooltip placement="top" :title="operation.label" :auto-adjust-overflow="true">
                  <a-icon :type="operation.icon" style="padding: 10px" @click="handleClick(record, operation)" v-if="operation.icon"/>
                  <a @click="handleClick(record, operation)" v-else>{{operation.label}}</a>
                </a-tooltip>
              </span>
            </template>

            <template v-else-if="col.dataType == TYPE_ENUM.BUTTON">
              <a-button type="primary"> <a-icon :type="col.icon"  @click="handleClick(record, col)"/> {{ col.title}} </a-button>
            </template>

            <template v-else-if="col.dataType == TYPE_ENUM.BUTTONGROUP">
              <span v-for="selectItem in col.selectItems" :key="selectItem.value">
                <a-button type="primary" @click="handleClick(record, searchItem)"> <a-icon :type="selectItem.icon"  /> {{ selectItem.label}} </a-button>
              </span>
            </template>

            <template v-else-if="col.dataType == TYPE_ENUM.DROPDOWN">
              <a-dropdown>
                <a-menu slot="overlay">
                  <a-menu-item v-for="selectItem in col.selectItems" :key="selectItem.value" @click="handleClick(record, selectItem)">
                    {{selectItem.label}}
                  </a-menu-item>
                </a-menu>
                <a-button> {{col.title}} <a-icon type="down" /> </a-button>
              </a-dropdown>
            </template>

            <template v-else-if="col.dataType == TYPE_ENUM.ACTION">
              <span v-for="selectItem in col.selectItems" :key="selectItem.value">
                <a-button :style="'margin-left: 10px; background:' + selectItem.background + '; color:' + selectItem.color" @click="handleClick(record, selectItem)" v-if="selectItem.selectItems  == null || selectItem.selectItems.length == 0"> <a-icon :type="selectItem.icon" v-if="selectItem.icon"/> {{ selectItem.label}} </a-button>
                
                <a-dropdown :style="'margin-left: 10px; background:' + selectItem.background + '; color:' + selectItem.color" v-else>
                <a-button> {{selectItem.label}} <a-icon type="down" /> </a-button>
                  <a-menu slot="overlay" >
                    <a-menu-item v-for="el in selectItem.selectItems" :key="el.value" @click="handleClick(record, el)">
                      <a-icon :type="el.icon" v-if="el.icon"/>
                      {{el.label}}
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
                </span>
            </template>

            <template v-else-if="col.dataType == TYPE_ENUM.SWITCH">
              <a-switch v-model="record[col.dataIndex]" @change="handleSwitchChange(record, el)" />
            </template>

            <template v-else-if="col.dataType == TYPE_ENUM.TIMESTAMP">
              {{text ? moment(text).format(col.format || 'YYYY-MM-DD HH:MM') : ''}}
            </template>

            <template v-else>
              {{ text }}
            </template>

      <!-- </div> -->
          </template>
        </a-table-column>
    

      <p :slot="(expandedRowItems && expandedRowItems.length > 0) ? 'expandedRowRender' : 'slot'" slot-scope="record" style="margin: 0; display: flex; justify-content: center;">
        <span v-for="item in expandedRowItems" :key="item.value">
            <a-tooltip placement="bottom" :title="item.label" :auto-adjust-overflow="true">
              <a-icon :type="item.icon" :style="'margin-left: 20px; color:' + item.color" @click="handleClick(record, item)"/>
            </a-tooltip>
        </span>
      </p>

      <p slot="expandIcon" slot-scope="record" style="margin: 0" v-if="expandedRowItems"></p>

    </a-table>
  </a-card>
</template>

<script>
import { TYPE_ENUM } from "../const.js";
import moment from 'moment';
// import Vue from "vue";
// import 'ant-design-vue/dist/antd.css'
// import { Table, Button, Input, Select, Radio, Checkbox, DatePicker, InputNumber, Icon, Tooltip, Dropdown, Menu } from 'ant-design-vue'
// Vue.use(Table)
// Vue.use(Button)
// Vue.use(Input)
// Vue.use(Select)
// Vue.use(Radio)
// Vue.use(Checkbox)
// Vue.use(DatePicker)
// Vue.use(InputNumber)
// Vue.use(Icon)
// Vue.use(Tooltip)
// Vue.use(Dropdown)
// Vue.use(Menu)

export default {
  name: 'Table',
  props: {
    columns: {
      type: Array,
      default: () => {
        return []
      },
    },
    current: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 10,
    },
    isPagination: {
      type: Boolean,
      default: true,
    },
    list: {
      type: Array,
      default: () => {
        return []
      },
    },
    rowSelection: {
      type: Object,
      default: () => {
        return null
      }
    },
    expandedRowItems: {
      type: Array,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      TYPE_ENUM,
      loading: false,
      pagination: { current: 1, pageSize: 1, total: 10 },
      dataSource: [],
    }
  },

  watch: {
    current(value) {
      this.$set(this.pagination, 'current', value)
    },

    pageSize(value) {
      this.$set(this.pagination, 'pageSize', value)
    },

    total(value) {
      this.$set(this.pagination, 'total', value)
    },

    list(value) {
      this.dataSource = value
    },
  },

  computed: {
    // 自定义渲染头部数据
    columnList() {
      this.columns.forEach((item) => {
        item.align = item.align || 'center'
        item.scopedSlots = { customRender: item.dataIndex }

        if (item.dataIndex == 'index' && !item.customRender) {
          item.customRender = (text, record, index) => index + 1
        }
      })
      return this.columns
    },
  },

  mounted() {
    this.$set(this.pagination, 'pageSize', this.pageSize)
    this.$set(this.pagination, 'total', this.total)
    this.dataSource = this.list
  },

  methods: {
    moment,
    //---------------------------------公共方法-------------------------------------
    // 开始加载
    _startLoading() {
      this.loading = true
    },

    // 停止加载
    _stopLoading() {
      this.loading = false
    },

    //---------------------------------私有方法-------------------------------------
   

    //-----------------------------------事件---------------------------------------

    handleTableChange(pagination, filters, sorter) {
      if (pagination) {
         this.pagination = { ...pagination }
        this.$emit('pageChange', this.pagination)
      }
    },

    // 操作事件
    handleClick(info, val) {
      var params = {
        info,
        val,
      }
      this.$emit('buttonClick', params)

    },

    handleSwitchChange(info, val) {
      var params = {
        info,
        val,
      }
      this.$emit('switchChange',params)
    },

    //---------------------------------私有方法-------------------------------------
    getLabel(selectItems, value) {
      var item = selectItems.find(e => e.value == value)

      if (item) {
        return item.label
      } else {
        return ""
      }
    }
  },
}
</script>

