<template>
  <div>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" layout="inline">
      <!-- 遍历二级内容 -->
      <template v-for="item in options" >
        <a-form-model-item :label="item.title" :prop="item.key.replace(/\./g, '_')" :key="item.key.replace(/\./g, '_')" :label-col="{ span: item.labelCol || 8 }" :wrapper-col="{ span: item.wrapperCol || 12 }" :style="'margin: 0; width: ' + 100 / columnNum + '%;'">
          <template v-if="item.type == TYPE_ENUM.INPUT">
            <a-input
              @change="(e) => handleInputChange(e, item)"
              :placeholder="item.placeholder || '请输入' + item.title"
              v-model="form[item.key.replace(/\./g, '_')]"
              :maxLength="item.length"
              :disabled="item.disabled"
              :allowClear="item.allowClear"
              :default-value="item.defaultValue" 
            >
              <template v-if="item.before" slot="addonBefore">
                <a-icon :type="item.before.icon" v-if="item.before.icon" @click="handleBtnClick(item.before)"/>
                <label v-if="item.before.title" @click="handleBtnClick(item.before)">{{item.before.title}}</label>
                <a-select 
                  :placeholder="item.before.placeholder || '请选择' + item.before.title"
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
                <label v-if="item.after.title" @click="handleBtnClick(item.after)">{{item.after.title}}</label>
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
              :max="item.max"
              style="width: 100%"
              v-model="form[item.key.replace(/\./g, '_')]"
              @change="(e) => handleInputNumChange(e, item)"
              :disabled="item.disabled"
              :allowClear="item.allowClear"
              :default-value="item.defaultValue" 
            />
          </template>

          <template v-else-if="item.type == TYPE_ENUM.SELECT">
            <a-select
              :placeholder="item.placeholder || '请选择' + item.title"
              v-model="form[item.key.replace(/\./g, '_')]"
              :disabled="item.disabled"
              :allowClear="item.allowClear"
              :default-value="item.defaultValue" 
              @search="(e) => handleSelectSearch(e, item)"
              @select="(e) => handleSelectSelect(e, item)"
              @change="(e) => handleSelectChange(e, item)"
            >
              <a-select-option
                v-for="selectItem in item.selectItems"
                :key="selectItem.value"
                allow-clear
              >
                {{ selectItem.label }}
              </a-select-option>
            </a-select>
          </template>

          <template v-else-if="item.type == TYPE_ENUM.SELECT_FILTER">
            <a-select
              show-search
              @search="(e) => handleSelectSearch(e, item)"
              @select="(e) => handleSelectSelect(e, item)"
              @change="(e) => handleSelectChange(e, item)"
              :placeholder="item.placeholder || '请选择' + item.title"
              option-filter-prop="children"
              :filter-option="true"
              v-model="form[item.key.replace(/\./g, '_')]"
              :disabled="item.disabled"
              :allowClear="item.allowClear"
              :default-value="item.defaultValue" 
            >
              <a-select-option v-for="selectItem in item.selectItems" :key="selectItem.value">
                {{ selectItem.label }}
              </a-select-option>
            </a-select>
          </template>

          <template v-else-if="item.type == TYPE_ENUM.SELECT_SEARCH">
            <a-select
              show-search
              :disabled="item.disabled"
              :allowClear="item.allowClear"
              :filter-option="false"
              @search="(e) => handleSelectSearch(e, item)"
              @select="(e) => handleSelectSelect(e, item)"
              @change="(e) => handleSelectChange(e, item)"
              :placeholder="item.placeholder || '请选择' + item.title"
              :default-value="item.defaultValue" 
              v-model="form[item.key.replace(/\./g, '_')]"
            >
              <a-select-option v-for="selectItem in item.selectItems" :key="selectItem.value">
                {{ selectItem.label }}
              </a-select-option>
            </a-select>
          </template>
          <template v-else-if="item.type == TYPE_ENUM.SELECT_MULTI">
            <a-select
              mode="multiple"
              show-search
              :disabled="item.disabled"
              :allowClear="item.allowClear"
              :filter-option="false"
              @search="(e) => handleSelectSearch(e, item)"
              @select="(e) => handleSelectSelect(e, item)"
              @change="(e) => handleSelectChange(e, item)"
              :placeholder="item.placeholder || '请选择' + item.title"
              :default-value="item.defaultValue" 
              v-model="form[item.key.replace(/\./g, '_')]"
            >
              <a-select-option v-for="selectItem in item.selectItems" :key="selectItem.value">
                {{ selectItem.label }}
              </a-select-option>
            </a-select>
          </template>
          <template v-else-if="item.type == TYPE_ENUM.DATEPICKER">
            <a-date-picker
              :value="form[item.key.replace(/\./g, '_')] ? moment(form[item.key.replace(/\./g, '_')]).format() : null"
              :show-time="item.showTime"
              :type="item.key.replace(/\./g, '_')"
              :format="item.format"
              :disabled="item.disabled"
              :placeholder="item.placeholder || '请选择' + item.title"
              style="width: 100%;"
              :allowClear="item.allowClear"
              :default-value="item.defaultValue" 
              @change="(date, dateString) => { $set(form, item.key.replace(/\./g, '_'), moment(date).unix() * 1000) }"
            />
          </template>

          <template v-else-if="item.type == TYPE_ENUM.MONTHPICKER">
            <a-month-picker
              :value="form[item.key.replace(/\./g, '_')] ? moment(form[item.key.replace(/\./g, '_')]).format() : null"
              :allowClear="item.allowClear"
              :type="item.key.replace(/\./g, '_')"
              :format="item.format"
              :placeholder="item.placeholder || '请选择' + item.title"
              style="width: 100%"
              :disabled="item.disabled"
              :defaultValue="item.defaultValue"
              @change="(date, dateString) => { $set(form, item.key.replace(/\./g, '_'), moment(date).unix() * 1000) }"
            />
          </template>

          <template v-else-if="item.type == TYPE_ENUM.DATERANGEPICKER">
            <a-range-picker
              :value="item.startKey && item.endKey ? ((form[item.startKey] && form[item.endKey]) ? [moment(form[item.startKey]).format(), moment(form[item.endKey]).format()] : null ) : (form[item.key.replace(/\./g, '_')] ? [moment(form[item.key.replace(/\./g, '_')].split(',')[0]).format(), moment(form[item.key.replace(/\./g, '_')].split(',')[1]).format()] : null)"
              :show-time="item.showTime"
              :type="item.key.replace(/\./g, '_')"
              :format="item.format"
              :disabled="item.disabled"
              style="width: 100%;"
              :allowClear="item.allowClear"
              :default-value="item.defaultValue" 
              @change="(date, dateString) => handleRangeChange(date, item)"
            />
    
          </template>

          <template v-else-if="item.type == TYPE_ENUM.CHECKBOX_GROUP">
            <a-checkbox-group v-model="form[item.key.replace(/\./g, '_')]">
              <a-checkbox
                v-for="checkItem in item.selectItems"
                :value="checkItem.value"
                :key="checkItem.value"
                :disabled="item.disabled"
                :default-value="item.defaultValue"
                name="type"
              >
                {{ checkItem.label }}
              </a-checkbox>
            </a-checkbox-group>
          </template>

          <template v-else-if="item.type == TYPE_ENUM.CHECKBOX">
             <a-checkbox
                v-model="form[item.key.replace(/\./g, '_')]"
                :disabled="item.disabled"
                :defaultChecked="item.defaultValue"
              >
              </a-checkbox>
          </template>

          <template v-else-if="item.type == TYPE_ENUM.INPUT_TEXT_AREA">
            <a-input
              :placeholder="item.placeholder || '请选择' + item.title"
              type="textarea"
              :disabled="item.disabled"
              :default-value="item.defaultValue"
              @change="(e) => handleTextAreaChange(e, item)"
              v-model="form[item.key.replace(/\./g, '_')]"
              :maxLength="item.length"
              :allowClear="item.allowClear"
            />
          </template>

          <template v-else-if="item.type == TYPE_ENUM.RADIO">
            <a-radio-group
              @change="(e) => handleRadioChange(e, item)"
              v-model="form[item.key.replace(/\./g, '_')]"
              :default-value="item.defaultValue"
              :disabled="item.disabled"
            >
              <a-radio
                v-for="checkItem in item.selectItems"
                :key="checkItem.value"
                :value="checkItem.value"
              >
                {{ checkItem.label }}
              </a-radio>
            </a-radio-group>
          </template>

          <template v-else-if="item.type == TYPE_ENUM.RADIO_GROUP">
            <a-radio-group
              @change="(e) => handleRadioChange(e, item)"
              v-model="form[item.key.replace(/\./g, '_')]"
              :default-value="item.defaultValue"
              :disabled="item.disabled"
            >
              <a-radio
                v-for="checkItem in item.selectItems"
                :key="checkItem.value"
                :value="checkItem.value"
              >
                {{ checkItem.label }}
              </a-radio>
            </a-radio-group>
          </template>

          <template v-else-if="item.type == TYPE_ENUM.SWITCH">
            <a-switch 
              v-model="form[item.key.replace(/\./g, '_')]"
              :default-value="item.defaultValue"
              :disabled="item.disabled"
             @change="e => handleSwitchChange(e, item)" />
          </template>

          <template v-else-if="item.type == TYPE_ENUM.IMG">
            <h-upload 
            listType="picture-card" 
            :fileData="form[item.key.replace(/\./g, '_')]"
            :action="item.action"
            accept="image/png,image/jpeg,image/jpg"
            :formData="item.formData"
            :qnTokenApi="item.qnTokenApi"
            :headers="item.headers"
            @change="e => handleUploadChange(e, item)"
            ></h-upload>
          </template>

          <template v-else-if="item.type == TYPE_ENUM.IMG_MULTI">
            <h-upload 
            listType="picture-card" 
            :fileData="form[item.key.replace(/\./g, '_')]"
            :action="item.action"
            accept="image/png,image/jpeg,image/jpg"
            :formData="item.formData"
            :qnTokenApi="item.qnTokenApi"
            :headers="item.headers"
            :fileNum="item.fileNum || 0"
            @change="e => handleUploadChange(e, item)"
            ></h-upload>
          </template>
        </a-form-model-item>
      </template>

       <a-form-model-item :style="'margin: 0; width: ' + 100 / columnNum + '%;'" :wrapper-col="{span: 24}">
        <div style="width: 100%; height: 100% display: flex; justify-content: center; align-items: center;">
          <template v-for="item in buttonItems">
            <a-button @click="handleBtnClick(item)" :key="item.value" :style="'margin-left: 10px; background:' + item.background + '; color: ' + item.color"> 
              <a-icon :type="item.icon" />
              {{ item.title }} 
            </a-button>
          </template>
        </div>
      </a-form-model-item>

    </a-form-model>
  </div>
</template>

<script>
import moment from 'moment';
import { TYPE_ENUM } from "../const.js";
import hUpload from '../Upload/index.vue'

export default {
  name: 'hForm',
  components: {
    hUpload
  },

  props: {
    columnNum: {
      type: Number,
      default: 1,
    },
    items: {
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
    },
    form: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },

  data() {
    return {
      TYPE_ENUM,
      options: [], // 用于构造的数据
      rules: {},
      uploadLoading: false
    }
  },
  watch:{
    items:function(val){
      this.refreshItems()
      // this.initRules()
    },

    form: function(val) {
      this.objectToString(this.form)
    }
  },

  created() {
    this.refreshItems()
    // this.initRules()
    
    this.objectToString(this.form)
  },

  methods: {
    moment,
    
    //---------公共方法-----------
    // 校验
    _validate(callback = function(valid, form) {}) {
      this.$refs.ruleForm.validate((valid) => {
        this._getFormObject()      

        if (!valid) {
          callback(valid, this.form)
        } else {
          callback(valid, this.form)
        }
      })
    },

    // 清空某个字段值（public）
    _setFormItem(key, value) {
      this.$set(this.form, key.replace(/\./g, '_'), value)
    },

    // 刷新
    _refresh() {
      this.refreshItems()
    },

    //  // 联动项刷新
    // _refreshLinkage(item) {

    //   console.log('该方法已废弃，统一使用 refresh()')
    // //   // console.log(source)
    // //   // console.log("sourcesourcesourcesourcesourcesourcesourcesource")
    // //   // var options = []
    // //   // source.forEach(element => {
    // //   //   if (element.parent == null) {
    // //   //     options.push(element)
    // //   //   }
    // //   // })
    // //   // if (item.selectItems != null && item.selectItems.length > 0) {
    // //   //   item.selectItems.forEach(element => {
    // //   //     if (element.value === this.form[item.key.replace(/\./g, '_')]) {
    // //   //       if (element.selectItems != null && element.selectItems.length > 0) {
    // //   //         element.selectItems.forEach(el => {
    // //   //           options.push(el)
    // //   //         })
    // //   //       }
    // //   //     }
    // //   //   })
    // //   // }

    // //   this.linkageItems(item)
    
    // },

    // 为selectItems赋值
    _assignSelectItems(target, key, selectItems) {
      target.forEach(el => {
          if (el.key == key) {
              el.selectItems = selectItems
          }
      })
      this.$forceUpdate()
    },

    // 将单体对象转换为嵌套对象
    _getFormObject() {
        var keys = Object.keys(this.form)
        keys.forEach(key => {
          if (key.indexOf('_') > -1) {
            var result = this.stringToObject({key: key, value: this.form[key]})
            this.$set(this.form, result.key, result.value)
          }
        })   
    },
    
   
    //-----------事件-----------
    // 按钮点击
    handleBtnClick(item) {
      var info = {
        val: this.form,
        item: item
      }
      this.$emit('btnClick', info)
    },

    // input change事件
    handleInputChange(e, item) {
      let text = e.target.value;
      let info = {
        text,
        item,
      };
      this.$emit("inputChange", info);
    },

    // input Number 事件
    handleInputNumChange(e, item) {
      let info = {
        text: e,
        item,
      };
      this.$emit("inputNumChange", info);
    },

    // select search事件
    handleSelectSearch(e, item) {
      var info = {
        kw: e,
        item: item,
        form: this.form,
      };
      this.$emit("selectSearch", info);
    },

    // select select事件
    handleSelectSelect(e, item) {
      
      var info = {
        text: e,
        item: item
      };
      this.refreshItems()
      this.$emit("selectSelect", info);

   
    },

    // select change事件
    handleSelectChange(e, item) {
      var info = {
        text: e,
        item: item
      };
      this.refreshItems()
      this.$emit("selectChange", info);
    },

    handleDateChange(e, item) {
      let info = {
        text: e,
        item,
      };
      this.$emit("dateChange", info);
    },

    handleCheckboxChange(e, item) {
      console.log(e);
      let info = {
        text: e.target.value,
        item,
      };
      this.$emit("checkboxChange", info);
    },

    handleTextAreaChange(e, item) {
      let info = {
        text: e.target.value,
        item,
      };
      this.$emit('textareaChange',info)
    },

    handleRadioChange(e, item) {
      let info = {
        text: e.target.value,
        item
      };
      this.refreshItems()
      this.$emit('radioChange',info)
    },

    handleSwitchChange(e, item) {
      let info = {
        text: e,
        item
      };
      this.refreshItems()
      this.$emit('switchChange',info)
    },

    handleUploadChange(info, item) {
        if (item.type == TYPE_ENUM.IMG) {
          this.$set(this.form, item.key.replace(/\./g, '_'), info.length > 0 ? (info[0].url || info[0].response.data) : "")
        } else if (item.type == TYPE_ENUM.IMG_MULTI) {
          var options = []
          info.forEach(el => {
            options.push(el.url || el.response.data)
          })
          this.$set(this.form, item.key.replace(/\./g, '_'), options)
        } else if (item.type == TYPE_ENUM.FILE) {
          this.$set(this.form, item.key.replace(/\./g, '_'), info.length > 0 ? info[0] : null)
        } else if (item.type == TYPE_ENUM.FILE_MULTI) {
          this.$set(this.form, item.key.replace(/\./g, '_'), info)
        }
    },

    handleRangeChange(date, item) {
      if (item.startKey && item.endKey) {
        this.$set(this.form, item.startKey, moment(date[0]).unix() * 1000)
        this.$set(this.form, item.endKey, moment(date[1]).unix() * 1000)
      } else {
        this.$set(this.form, item.key.replace(/\./g, '_'), String(moment(date[0]).unix() * 1000) + ',' + moment(date[1]).unix() * 1000) 
      }
    },

    //---------------私有方法--------------
    refreshItems() {
      var items = []
      this.items.forEach(element => {

        items.push(element)

        this.restructureItems(items, element)

      })
      
      // 排序
      items.sort(function(a, b) {
        return (a.sort || 0) - (b.sort || 0)
      })


      this.options = items
      this.initRules()
    },

    // 重构Items
    restructureItems(items, element) {
      if (element.selectItems != null && element.selectItems.length > 0) {
        var selectItem = element.selectItems.find(el => el.value == this.form[element.key.replace(/\./g, '_')]) // element的被选中项
            
        // 将子项插入
        if (selectItem && selectItem.selectItems && selectItem.selectItems.length > 0) {
            selectItem.selectItems.forEach(elEl => {
              // 对被插入的子集做标记，以便于识别
              elEl.parent = element.key.replace(/\./g, '_')
              items.push(elEl)

              this.restructureItems(items, elEl)
            })
        }
      }
    },

    // 初始化RULES
    initRules() {
  
      var rules = {}
      this.options.map((item) => {
        var message = item.placeholder
        if (!message) {
          message = "请选择" + item.title;
          if (
            item.type == TYPE_ENUM.INPUT ||
            item.type == TYPE_ENUM.INPUT_NUMBER ||
            item.type == TYPE_ENUM.INPUT_TEXT_AREA
          ) {
            message = "请输入" + item.title;
          }
        }

        rules[item.key.replace(/\./g, '_')] = [
          {
            required: item.required,
            message: message,
            trigger: ['change', 'blur'],
          },
        ]

        // 添加自定义规则
        if (item.rules) {
          rules[item.key.replace(/\./g, '_')] = rules[item.key.replace(/\./g, '_')].concat(item.rules)
        }
      })
      this.rules = rules
    },

    
    // // 重组联动options(item: 联动项， value， 选中项)(已废弃)
    // linkageItems(item) {

    //   console.log('该方法已废弃，统一使用 refreshItems()')
    //   // console.log('===========')
    //   // if (item.linkage == true) {
    //   //   var items = []
    //   //   this.items.forEach(element => {
    //   //     if (element.parent != item.key.replace(/\./g, '_')) {
    //   //       items.push(element)
    //   //     }
    //   //   })

    //   //   if (item.selectItems != null && item.selectItems.length > 0) {
    //   //     // 获取联动项的选择项
    //   //     var selectItem = item.selectItems.find(el => el.value == this.form[item.key.replace(/\./g, '_')]) 
          
    //   //     // 将该选项下的子集插入到最外层options中
    //   //     if (selectItem && selectItem.selectItems && selectItem.selectItems.length > 0) {
    //           // selectItem.selectItems.forEach(el => {

    //           //   // 对被插入的子集做标记，以便于识别
    //           //   el.parent = item.key.replace(/\./g, '_')
    //           //   items.push(el)
    //           // })
    //   //       }
    //   //   }

   
    //   //   this.options = items
    //   //   this.initRules()

    //   //   console.log(this.options)
    //   // }


      
    // },

     // 对象模型转换为字符串拼接模型
    objectToString(target, source, firstKey) {
      if (!source) {
        source = target
      }

      var keys = Object.keys(source)
      keys.forEach(key => {
        var nextKey = firstKey ? firstKey + '_' + key : key

        if ( source[key] && source[key].constructor == Object) {
          this.objectToString(target, source[key], nextKey)
        } else {
          this.$set(target, nextKey, source[key])
          
          if (firstKey) {
            delete target[firstKey]
          }
        }
      })
    },

    // 字符串拼接模型转换为对象模型
    stringToObject(object) {
      var keys = object.key.split('_')
      if (keys.length > 1) {
        var lastKey = keys[keys.length - 1]
        var nextKey = keys.slice(0, keys.length - 1).join('_')

        var nextObj = {
          key: nextKey,
          value: {}
        }
        this.$set(nextObj.value, lastKey, object.value)
        return this.stringToObject(nextObj)
      } else {
        return object
      }
    },

  },
}
</script>


