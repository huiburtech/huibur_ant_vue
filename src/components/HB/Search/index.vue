<template>
  <a-card>
    <h1>该组件已废弃，请使用 h-form </h1>
    <!-- <a-form-model ref="ruleForm" :model="form" :rules="rules" layout="inline">

      <template v-for="(item, index) in items">
        <a-form-model-item
          :label="item.title"
          :prop="item.key"
          :key="item.key"
          :label-col="{ span: item.labelCol || 8 }"
          :wrapper-col="{ span: item.wrapperCol || 12 }"
          :style="'margin: 0; width: ' + 100 / columnNum + '%;'"
        >
          <template v-if="item.type == TYPE_ENUM.INPUT">
            <a-input :placeholder="item.placeholder || '请输入' + item.title" v-model="form[item.key]" :allowClear="item.allowClear" >
              <template v-if="item.before" slot="addonBefore">
                <a-icon :type="item.before.icon" v-if="item.before.icon" @click="handleBtnClick(item.before)"/>
                <label v-if="item.before.title">{{item.before.title}}</label>
                <a-select 
                  v-if="item.before.selectItems"
                  v-model="form[item.before.key]"
                  :default-value="item.before.defaultValue" 
                  :style="'width: ' + item.before.width">
                    <a-select-option
                      v-for="selectItem in item.before.selectItems"
                      :key="selectItem.value"
                      allow-clear
                    >
                      {{ selectItem.label }}
                    </a-select-option>
                  </a-select>
              </template>
              <template v-if="item.after" slot="addonAfter">
                <a-icon :type="item.after.icon" v-if="item.after.icon" @click="handleBtnClick(item.after)"/>
                <label v-if="item.after.title">{{item.after.title}}</label>
                <a-select 
                  v-if="item.after.selectItems"
                  v-model="form[item.after.key]"
                  :default-value="item.after.defaultValue" 
                  :style="'width: ' + item.after.width">
                    <a-select-option
                      v-for="selectItem in item.after.selectItems"
                      :key="selectItem.value"
                      allow-clear
                    >
                      {{ selectItem.label }}
                    </a-select-option>
                  </a-select>
              </template>
            </a-input>
          </template>

          <template v-else-if="item.type == TYPE_ENUM.INPUT_NUMBER">
            <a-input-number
              :placeholder="item.placeholder || '请输入' + item.title"
              :min="item.min"
              style="width: 100%"
              v-model="form[item.key]"
              :allowClear="item.allowClear"
            />
          </template>

          <template v-else-if="item.type == TYPE_ENUM.SELECT">
            <a-select :placeholder="item.placeholder || '请选择' + item.title" v-model="form[item.key]" :allowClear="item.allowClear">
              <a-select-option v-for="selectItem in item.selectItems" :key="selectItem.value">
                {{ selectItem.label }}
              </a-select-option>
            </a-select>
          </template>

          <template v-else-if="item.type == TYPE_ENUM.SELECT_FILTER">
            <a-select
              show-search
              :placeholder="item.placeholder || '请选择' + item.title"
              option-filter-prop="children"
              :filter-option="true"
              v-model="form[item.key]"
              :allowClear="item.allowClear"
            >
              <a-select-option v-for="selectItem in item.selectItems" :key="selectItem.value">
                {{ selectItem.label }}
              </a-select-option>
            </a-select>
          </template>

          <template v-else-if="item.type == TYPE_ENUM.SELECT_SEARCH">
            <a-select
              show-search
              :allowClear="item.allowClear"
              :filter-option="false"
              all
              @search="(e) => handleSelectSearch(e, item, index)"
              @select="(e) => handleSelectChange(e, item, index)"
              :placeholder="item.placeholder || '请选择' + item.title"
              v-model="form[item.key]"
            >
              <a-select-option v-for="selectItem in item.selectItems" :key="selectItem.value">
                {{ selectItem.label }}
              </a-select-option>
            </a-select>
          </template>

          <template v-else-if="item.type == TYPE_ENUM.DATEPICKER">
            <a-date-picker
              v-model="form.date"
              show-time
              :allowClear="item.allowClear"
              :type="item.key"
              :format="item.format"
              :placeholder="item.placeholder || '请选择' + item.title"
              style="width: 100%"
              :disabled="item.disabled"
              :defaultValue="item.defaultValue"
            />
          </template>

          <template v-else-if="item.type == TYPE_ENUM.MONTHPICKER">
            <a-month-picker
              :allowClear="item.allowClear"
              :type="item.key"
              :format="item.format"
              :placeholder="item.placeholder || '请选择' + item.title"
              style="width: 100%"
              :disabled="item.disabled"
              :defaultValue="item.defaultValue"
              @change="(date, dateString) => {form[item.key] = dateString}"
            />
          </template>

          <template v-else-if="item.type == TYPE_ENUM.CHECKBOX_GROUP">
            <a-checkbox-group v-model="form[item.key]">
              <a-checkbox
                v-for="checkItem in item.selectItems"
                :value="checkItem.value"
                :key="checkItem.value"
                :disabled="item.disabled"
                name="type"
              >
                {{ checkItem.label }}
              </a-checkbox>
            </a-checkbox-group>
          </template>

          <template v-else-if="item.type == TYPE_ENUM.CHECKBOX">
             <a-checkbox
                v-model="form[item.key]"
                :disabled="item.disabled"
              >
              </a-checkbox>
          </template>

          <template v-else-if="item.type == TYPE_ENUM.SWITCH">
            <a-switch v-model="form[item.key]" @change="e => handleSwitchChange(e, item)" />
          </template>

        </a-form-model-item>
      </template>

      <a-form-model-item>
        <template v-for="item in buttonItems">
          <a-button @click="handleBtnClick(item)" :key="item.value" :style="'margin-left: 10px; background:' + item.background + '; color: ' + item.color"> 
            <a-icon :type="item.icon" />
            {{ item.title }} 
          </a-button>
        </template>
      </a-form-model-item>
    </a-form-model> -->
  </a-card>
</template>

<script>
import { TYPE_ENUM } from "../const.js";

export default {
  name: 'Search',
  props: {
    columnNum: {
      type: Number,
      default: 4,
    },

    // btnIcon: {
    //   // 按钮ICON
    //   type: String,
    //   default: 'search',
    // },
    // btnTitle: {
    //   // 按钮标题
    //   type: String,
    //   default: '搜索',
    // },
    items: {
      //接收父组件参数
      type: Array,
      default: () => {
        return []
      },
    },
    buttonItems: {
      //接收父组件参数
      type: Array,
      default: () => {
        return []
      },
    } 
  },

  data() {
    return {
      TYPE_ENUM,
      rules: {},
      form: {},
    }
  },

  created() {
    this.initRules()
  },

  methods: {
    //---------------------------------公共方法-------------------------------------
    // 校验
    _validate(callback = function(valid, form) {}) {
      this.$refs.ruleForm.validate((valid) => {
        callback(valid, this.form)
      })
    },

    // 清空某个字段值（public）
    _setFormItem(key, value) {
      this.$set(this.form, key, value)
    },

    //-----------------------------------事件--------------------------------------
    // //统计回调-废弃
    // handleSearchClick() {
    //   this.$refs.ruleForm.validate((valid) => {
    //     if (!valid) {
    //       return
    //     }
    //     this.$emit('searchClick', this.form)
    //   })
    // },

    // 按钮点击
    handleBtnClick(item) {
      var info = {
        val: this.form,
        item: item
      }
      this.$emit('btnClick', info)
    },

    handleSelectSearch(e, item) {
      var info = {
        kw: e,
        item: item,
        form: this.form,
      }

      this.$emit('selectSearch', info)
    },
    // handleChange(e, item) {
    //   var info = {
    //     item: item,
    //     form: this.form,
    //   }
    //   this.$emit('selectFormChange', info)
    // },

    handleSelectChange(e, item) {
      var info = {
        item: item,
        form: this.form,
      }

      this.$emit('selectChange', info)
    },

     handleSwitchChange(e, item) {
      let info = {
        text: e.target.value,
        item,
      };
      this.$emit('switchChange',info)
    },

    //---------------------------------私有方法-------------------------------------
    // 初始化RULES
    initRules() {
      var rules = {}
      this.items.map((item) => {
        var message = item.placeholder
        if (message) {
          message = '请选择' + item.title
          if (item.type == TYPE_ENUM.INPUT || item.type == TYPE_ENUM.INPUT_NUMBER) {
            message = '请输入' + item.title
          }
        }
        rules[item.key] = [{ required: item.required, message: message, trigger: ['change', 'blur'] }]
      })

      this.rules = rules
    },
  },
}
</script>

:action="uploadURL + '&formatType=' + formatType + '&securityLevel=' + fileSecretLevel"
 :beforeUpload="handleBeforeUpload"




handleBeforeUpload(file, fileList) {   
  return new Promise((resolve, reject) => {
    this.$refs.secretLevel._show(res => {
      if (res) {
        this.fileSecretLevel = res

        return resolve(true)
      } else {
        return resolve(false)
      }
    }) 
  })
},

<secret-level ref="secretLevel"></secret-level>


import SecretLevel from '@/components/SecretLevel'

components: {
  SecretLevel
},


fileSecretLevel: null,