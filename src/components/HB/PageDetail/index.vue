<template>

    <a-modal
      v-model="visible"
      ok-text="确认"
      cancel-text="取消"
      centered
      :closable="false"
      :maskClosable="false"
      :destroyOnClose="true"
      :confirmLoading="loading"
      :width="isFullScreen ? '100%' : width"
      @cancel="handleCancel"
      @ok="handleOk"
    >  
      <template slot="title">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="title">{{ titles.find(el => el.value == showType).title }}</div>
          <a-icon :type="isFullScreen ? 'fullscreen-exit' : 'fullscreen'" @click="handleFullClick"/>
        </div>
      </template>

      <div class="detail" :style="(isFullScreen ? 'height: 100vh; max-height: 82vh;' : 'max-height: 70vh;') + 'overflow: auto;'">
        <div v-for="(item, index) in items" :key="index">
          <div v-if="item.children && item.children.constructor == Array">
            <a-divider :orientation="dividerOrientation" v-if="dividerOrientation">{{item.title}}</a-divider>
            <h-form
              :items="item.children.filter(el => el.hidden != true)"
              :column-num="columnNum"
              :form="form"
              @selectSearch="handleFormSelectSearch"
              @selectChange="handleFormSelectChange"
              ref="form"
              style="back"
            />
          </div>
        </div>
        <h-form
          :items="items.filter(el => el.hidden != true && (el.children == null || el.children.constructor != Array))"
          :column-num="columnNum"
          :form="form"
          @selectSearch="handleFormSelectSearch"
          @selectChange="handleFormSelectChange"
          ref="form1"
        />
      </div>
    </a-modal>

</template>

<script>
import { TYPE_ENUM, OPERATION_TYPE } from "../const.js";
import hForm from '../Form/index.vue'
import { h_getDetail, h_add, h_edit, h_request} from '../api/index'

export default {
  name: 'hDetail',
  components: {
    hForm
  },
  props: {
    header: {
      type: Object,
      default: () => {
        return null
      }
    },
    width: {
      type: String,
      default: '50%'
    },
    apiName: {
      type: String,
    },
    succCode: {
      type: String,
      default: '200'
    },
    logoutCode: {
      type: String,
      default: 'P4007'
    },
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    columnNum: {
      type: Number,
      default: 1
    },
    requestDetail: {
      type: Boolean,
      default: false
    },
    idKey: {
      type: String,
      default: 'id'
    },
    extParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dividerOrientation: {
      type: String,
      default: null
    },
    dictApi: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectDict: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data () {
    return {
      TYPE_ENUM,
      OPERATION_TYPE,
      titles: [
        {title: '新增', value: OPERATION_TYPE.ADD},
        {title: '编辑', value: OPERATION_TYPE.EDIT},
        {title: '拷贝', value: OPERATION_TYPE.COPY},
        {title: '详情', value: OPERATION_TYPE.DETAIL}
      ],
      showType: OPERATION_TYPE.ADD,
      form: {},
      visible: false,
      loading: false,
      isFullScreen: false
    }
  },
  watch:{
    selectDict:function(val){
      console.log(val)
      this.items.forEach(item => {
        if (item.children && item.children.constructor == Array) {
          item.children.forEach(itemEl => {
            if (val[itemEl.key]) {
              itemEl.selectItems = val[itemEl.key]
            }
          })
        } else {
          if (val[item.key]) {
            item.selectItems = val[item.key]
          }
        }
        
      })
    }
  },
  mounted() {
    // if (this.dictApi) {
    //   this.dictApi.forEach(el => {
    //     this.requestGetDict(el)
    //   })
    // }
  },
  methods: {
    // -------------------------------------事件--------------------------------------
    handleFullClick() {
      this.isFullScreen = !this.isFullScreen
    },

    // 取消
    handleCancel () {
      this.visible = false
    },
    // 确认
    handleOk () {

      var valueValid = true
      this.items.forEach((el, index) => {
        if (el.children && el.children.constructor == Array) {
          this.$refs.form[index]._validate((valid, form) => {
            Object.assign(this.form, form)
            if (valid === false) {
              valueValid = false
            }
          })
        }
      })

      this.$refs.form1._validate((valid, form) => {
        Object.assign(this.form, form)
        if (valid === false) {
          valueValid = false
        }
      })

      if (valueValid == false) {
        return
      }

      // 没有接口时的操作
      if (!this.apiName) {
        this.$emit('ok', {valid: valueValid, form: this.form})
        this.visible = false
      }

      if (this.form[this.idKey]) {
            // 调用编辑接口
        this.requestEdit()
      } else {
        // 调用新增接口
        this.requestAdd()
      }
    },



    // -----------------------b --------------公共方法--------------------------------------
    _show (params, showType) {
      this.showType = showType || OPERATION_TYPE.ADD
      this.visible = true
      if (params != null) { // 编辑
        this.form = Object.assign({}, params)
        if (this.requestDetail == true) {
          // 获取详情接口
          this.requestGetDetail()
        } else {
          // this.convertDataToForm()
        }

        this.items.forEach(el => {
          if (el.children && el.children.constructor == Array) {
            el.children.forEach(item => {
              if (item.linkageApi) {
                this.requestLinkageItem(item, this.form[item.key])
              }
            })
          } else {
            if (el.linkageApi) {
                this.requestLinkageItem(el, this.form[el.key])
            }
          }
        })

      } else {

        this.form = Object.assign({}, this.extParams)

        // this.items.forEach((el, index) => {
        //   if (el.children && el.children.constructor == Array) {
        //     el.children.forEach(item => {
        //       if (item.linkageApi) {
        //         // 设置延迟执行
        //         setTimeout(() => {
        //           // this.$refs.form[index]._refreshLinkage(item)
        //         }, 50)

        //       }
        //     })
        //   } else {
        //     if (el.linkageApi) {
        //       // 设置延迟执行
        //       setTimeout(() => {
        //         // this.$refs.form[index]._refreshLinkage(el)
        //       }, 50)

        //     }
        //   }
          
        // })
      }
    },
    // -------------------------------------私有方法--------------------------------------
    // 将复杂模型数据转换为单一Form对象
    // convertDataToForm() {
    //   if (this.convertData.length == 0) {
    //     return
    //   }

    //   this.convertData.forEach(el => {
    //     if (el.type == Object) {
    //       this.$set(this.form, el.formKey, this.form[el.modelKey][el.formKey])
    //     } else if (el.type === Array) {
    //       this.form[el.modelKey].forEach(item => {
    //         this.$set(this.form, item[el.formKey], item.data)
    //       })
    //     } else if (el.type == String) {
    //       this.$set(this.form, el.formKey, this.form[el.modelKey])
    //     } 
        
    //   })
    // },

    // 将单一Form对象转换为模型对象
    // convertFormToData() {
    //   if (this.convertData.length == 0) {
    //     return
    //   }

    //   this.convertData.forEach(el => {
    //     if (el.type == Object) {
    //       if (!this.form[el.modelKey]) {
    //         this.$set(this.form, el.modelKey, {})
    //       }
    //       this.$set(this.form[el.modelKey], el.formKey, this.form[el.formKey] || '')
    //     } else if (el.type === Array) {

    //       var items = []
    //       this.items.forEach(item => {
    //         if (item.children && item.children.constructor == Array) {
    //           item.children.forEach(itemEl => {
    //             if (itemEl.parent === el.parent) { // 放入模型对象
    //               var obj = {}
    //               this.$set(obj, el.formKey, itemEl.key)
    //               this.$set(obj, 'data', this.form[itemEl.key] || '')
    //               items.push(obj)
    //             }
    //           })
    //         } else {
    //           if (item.parent === el.parent) { // 放入模型对象
    //             var obj = {}
    //             this.$set(obj, el.formKey, item.key)
    //             this.$set(obj, 'data', this.form[item.key] || '')
    //             items.push(obj)
    //           }
    //         }
            
    //       })
    //       this.$set(this.form, el.modelKey, items)
    //     } else if (el.type == String) {
    //       this.$set(this.form, el.modelKey, this.form[el.formKey])
    //     } 
        
    //   })
    // },

    // -------------------------------------网络请求--------------------------------------
    // 网络请求-新增
    requestGetDetail () {
      if (this.loading || !this.apiName) {
        return
      }

      var id = this.form[this.idKey] || this.form.copyId

      // 2:设置loading加载
      this.loading = true
      h_getDetail(this.apiName, id, this.header)
          .then((res) => {
            console.log(res)
            // 3:成功-进行业务操作（注：200还是'200'具体需要根据服务器返回确定）
            if (String(res.code) === this.succCode) {
              if (res.data) {
                this.$set(this, 'form', res.data)
              }
              // this.convertDataToForm()
            } else if (String(res.code) === this.logoutCode) {
              this.$store.dispatch('Logout')
              this.$emit('logout')
            } else {
              // 4:失败-弹框提示（注：message还是msg、或者其他具体需要根据服务器返回确定）
              this.$message.warn(res.message)
            }
          })
          .finally(() => {
            // 5:结束加载
            this.loading = false
          })
    },

    // 网络请求-新增
    requestAdd () {
      if (this.loading) {
        this.$message.warn('正在添加中')
        return
      }

      if (!this.apiName) {
        return
      }

      // 2:设置loading加载
      this.loading = true
      h_add(this.apiName, this.form, this.header)
          .then((res) => {
            // 3:成功-进行业务操作（注：200还是'200'具体需要根据服务器返回确定）
            if (String(res.code) === this.succCode) {
              this.$message.success('新增成功')
              this.$emit('addSucc', this.form)
              this.visible = false
            } else if (String(res.code) === this.logoutCode) {
              this.$store.dispatch('Logout')
              this.$emit('logout')
            } else {
              // 4:失败-弹框提示（注：message还是msg、或者其他具体需要根据服务器返回确定）
              this.$message.warn(res.message)
            }
          })
          .finally(() => {
            // 5:结束加载
            this.loading = false
          })
    },

    // 网络请求-编辑
    requestEdit () {
      if (this.loading) {
        this.$message.warn('正在编辑中')
        return
      }

      if (!this.apiName) {
        return
      }

      // 2:设置loading加载
      this.loading = true
      h_edit(this.apiName, this.form, this.form[this.idKey], this.header).then((res) => {
            // 3:成功-进行业务操作（注：200还是'200'具体需要根据服务器返回确定）
            if (String(res.code) === this.succCode) {
              this.$message.success('编辑成功')
              this.$emit('editSucc', this.form)
              this.visible = false
            } else if (String(res.code) === this.logoutCode) {
              this.$store.dispatch('Logout')
              this.$emit('logout')
            } else {
              // 4:失败-弹框提示（注：message还是msg、或者其他具体需要根据服务器返回确定）
              this.$message.warn(res.message)
            }
          })
          .finally(() => {
            // 5:结束加载
            this.loading = false
          })
    },

    // 网络请求-获取下拉选项字典数据
    requestGetDict (dictApi, kw) {
        var params = dictApi.params || {}
        if (dictApi.kwKey) {
          this.$set(params, dictApi.kwKey, kw)
        }
        
        h_request(dictApi.method, dictApi.url, params, dictApi.data, this.header, dictApi.timout).then((res) => {
          if (String(res.code) === this.succCode) {
            var valueKey = dictApi.valueKey || 'value'
            var labelKey = dictApi.labelKey || 'label'

            var items = []

            res.data.forEach(el => {
              var item = {value: '', label: ''}
              if (el.constructor == Object) {
                item.label = el[labelKey]
                item.value = el[valueKey]
              } else if (el.constructor == String) {
                item.label = el
                item.value = el
              }

              items.push(item)
            })

            this.items.forEach((item, index) => {
              if (item.children && item.children.constructor == Array) {
                if(this.$refs.form && this.$refs.form.length > 0) {
                  this.$refs.form[index]._assignSelectItems(item.children, item.idKey, items)
                }
              } else {
                this.$refs.form._assignSelectItems(this.items, item.idKey, items)
              }
              
            })
          
          } else if (String(res.code) === this.logoutCode) {
              this.$store.dispatch('Logout')
              this.$emit('logout')
          } else {
            // 4:失败-弹框提示（注：message还是msg、或者其他具体需要根据服务器返回确定）
            this.$message.warn(res.message)
          }
        })
        .finally(() => {
        })
    },

    // 网络请求-获取某通讯方式下参数信息
    requestLinkageItem (linkageItem, value) {
    
        var valueKey = linkageItem.linkageApi.valueKey || 'value'
        var labelKey = linkageItem.linkageApi.labelKey || 'title'
  
        // 2:设置loading加载
        h_request(linkageItem.linkageApi.method, linkageItem.linkageApi.url, linkageItem.linkageApi.params, linkageItem.linkageApi.data, this.header, linkageItem.linkageApi.timout, value).then((res) => {
              // 3:成功-进行业务操作（注：200还是'200'具体需要根据服务器返回确定）
              if (String(res.code) === this.succCode) {
                // 重组模型，与form的模型保持一致
                res.data.forEach(el => {
                  el.title = el[labelKey]
                  el.key = String(el[valueKey])
                  el.value = el[valueKey]
                  el.required = true
                  el.type = TYPE_ENUM.INPUT
                })

                this.items.forEach((item, index) => {
                  if (item.children && item.children.constructor == Array) {
                    item.children.forEach(itemEl => {
                      if (itemEl.key == linkageItem.key) {
                        itemEl.selectItems.forEach( itemElEl => {
                          if (itemElEl.value == value) {
                            itemElEl.selectItems = res.data
                          }
                        })
                        // 刷新
                        // this.$refs.form[index]._refreshLinkage(itemEl)
                        this.$refs.form[index]._refresh()
                      }
                    })
                  } else {
                    if (item.key == linkageItem.key) {
                      item.selectItems.forEach( itemElEl => {
                        if (item.value == value) {
                          itemElEl.selectItems = res.data
                        }
                      })
                      // 刷新
                      // this.$refs.form._refreshLinkage(item)
                      this.$refs.form1._refresh()
                    }
                  }
                  
                })

                
              } else if (String(res.code) === this.logoutCode) {
                this.$store.dispatch('Logout')
                this.$emit('logout')
              }
            })
            .finally(() => {
              // 5:结束加载
            })
    },

    // -------------------------------------通知回调--------------------------------------
    handleFormSelectChange(e) {
      console.log(e)
      if (e.item.linkageApi) {
        // this.
        var selectData = e.item.selectItems.find(el => el.value == e.text) 
        if(selectData.selectItems == null || selectData.selectItems.length == 0) {

          this.requestLinkageItem(e.item, e.text)
        } 
      }
    },

    // select搜索
    handleFormSelectSearch(e) {
      var selectItem = this.dictApi.find(el => el.key == e.item.key)
      this.requestGetDict(selectItem, e.kw)
    },


  }
}
</script>


<style scoped>
.detail {
  width: 100%;
  /* max-height: 70vh; */
  overflow: auto;
  /* display: flex;
  flex-direction: column;
  /* justify-content: center;
  align-items: center; */
}
</style>