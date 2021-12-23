<template>
  <div class="contain">


    <a-card class="h-list-search" v-if="searchItems && searchItems.length > 0">
        <h-form
            ref="search"
            :button-items="searchBtnItems"
            :items="searchItems"
            :column-num="searchColumnNum"
            :form="searchForm"
            @btnClick="handleSearchClick">
        </h-form>
    </a-card>
    <h-header class="h-list-header" :title="title" :subTitle="subTitle" :items="headerButtonItems" :search-num="pagination.total" :select-num="selectedRowKeys.length" @btnClick="handleHeaderBtnClick"/>
    <h-table
      class="h-list-table"
      ref="list"
      :pageNum="pagination.pageNum"
      :pageSize="pagination.pageSize"
      :total="pagination.total"
      :isPagination="isPagination"
      :columns="columns.filter(el => el.hidden == null || el.hidden == false)"
      :list="list"
      :row-selection="rowSelected ? { selectedRowKeys: selectedRowKeys, onChange: handleListRowChange } : null"
      @pageChange="handleListPageChange"
      @buttonClick="handleListButtonClick"
    ></h-table>

    <h-detail ref="detail" 
        class="h-list-detail"
        :header="header"
        :idKey="idKey"
        :apiName="apiName"
        :succCode="succCode"
        :logoutCode="logoutCode"
        :items="detailItems"
        :extParams="extParams"
        :column-num="detailColumnNum"
        :dividerOrientation="dividerOrientation"
        :requestDetail="requestDetail"
        :selectDict="selectDict"
        :convertData="convertData"
        :dictApi="dictApi"
        :width="detailWidth"
        @addSucc="handleAddSucc" 
        @editSucc="handleEditSucc"
        @ok="handleDetailOK"
        />

    <h-confirm class="h-list-confirm" ref="confirm"/>
  </div>
</template>

<script>
import { TYPE_ENUM, OPERATION_TYPE } from '../index'
import hHeader from '../Header/index.vue' 
import hForm from '../Form/index.vue'
import hTable from '../Table/index.vue'
import hConfirm from '../Confirm/index.vue'
import hDetail from '../PageDetail/index.vue'
import {h_getList, h_delete, h_request} from '../api/index'

export default {
name: 'hList',
  components: {
    hHeader,
    hForm,
    hTable,
    hConfirm,
    hDetail
  }, 
  props: {
    header: {
      type: Object,
      default: () => {
        return null
      }
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
    idKey: {
        type: String,
        default: 'id'
    },
    title: {
      type: String
    },
    subTitle: {
      type: String
    },
    headerButtonItems: {
        type: Array,
        default: () => {
            return [
              {
                title: '新建',
                value: 'add',
                icon: 'plus-circle'
              }
            ]
        }
    },
    searchItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    searchBtnItems: {
      type: Array,
      default: () => {
        return [
            {
                title: '查询',
                icon: 'search',
                value: 'search'
            },
            {
                title: '重置',
                icon: 'reload',
                value: 'reset'
            }
        ]
      }
    },
    searchColumnNum: {
        type: Number,
        default: 4
    },
    detailColumnNum: {
        type: Number,
        default: 1
    },
    tableColumns: {
      type: Array,
      default: () => {
        return []
      }
    },
    isPagination: {
        type: Boolean,
        default: false
    },
    pagination: {
      type: Object,
      default: () => {
        return {pageNum: 1, pageSize: 10, total: 0}
      }
    },
    rowSelected: {
        type: Boolean,
        default: false
    },
    detailItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    batchAddItems: {
      type: Array,
      default: () => {
        return []
      }
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
    requestDetail: {
      type: Boolean,
      default: false
    },
    convertData: {
      type: Array,
      default: () => {
        return []
      }
    },
    dictApi: {
      type: Array,
      default: () => {
        return []
      }
    },
    dataSource: {
      type: Array,
      default: () => {
        return []
      }
    },
    detailWidth: {
      type: String,
      default: '50%'
    }
  },
  data () {
    return {
      TYPE_ENUM,
      OPERATION_TYPE,
      searchForm: {},
      columns: this.tableColumns,
      list: [],
      selectedRowKeys: [],
      selectDict: {}
    }
  },
  watch:{
    dataSource:function(val){
      this.list = val
    }
  },
  created () {
    
  },
  mounted () {
      this.renderColumns()

      if (this.dataSource) {
        this.list = this.dataSource
      }
      
      if (this.apiName) {
        // 获取数据列表
        this.requestGetList()
      
        // 获取字典对应的数据
        this.dictApi.forEach(el => {
          this.requestGetDict(el)
        })
      }      
  },
  methods: {
    // -------------------------------------事件--------------------------------------

    // -------------------------------------公共方法--------------------------------------
    // 刷新数据
    _refreshTable(item) {
        if (item) {
            this.list.forEach(element => {
                if (element[this.idKey] == item[this.idKey]) {
                    element = item
                }
            });
        } else {
            this.requestGetList()
        }
    },
    
    // -------------------------------------私有方法--------------------------------------
    // 重新渲染table配置列：默认根据详情页数据配置
    renderColumns() {
      if (!this.columns || this.columns.length == 0) {
        var items = []

        items.push({
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          scopedSlots: { customRender: 'index' },
          selectItems: [],
        })

        this.detailItems.forEach(el => {
          if (el.children && el.children.constructor == Array) {
            el.children.forEach(elEl => {
              // if (elEl.tableHidden == null || elEl.tableHidden == false) {
                items.push({
                  title: elEl.title,
                  dataIndex: elEl.dataIndex || elEl.key,
                  dataType: elEl.dataType || TYPE_ENUM.TEXT,
                  align: elEl.align || 'center',
                  selectItems: elEl.selectItems,
                  customRender: elEl.customRender,
                  hidden: elEl.tableHidden
                })
              // }
            })
          } else {
            // if (el.tableHidden == null || el.tableHidden == false) {
              items.push({
                title: el.title,
                dataIndex: el.dataIndex || el.key,
                dataType: el.dataType || TYPE_ENUM.TEXT,
                align: el.align || 'center',
                selectItems: el.selectItems,
                customRender: el.customRender,
                hidden: el.tableHidden
              })
            // }
          }
          
        })
        
        if (!items.find(el=> el.dataIndex == 'operation')) {
          items.push({
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            selectItems: [{label: '操作', value: 'operation', selectItems: [{label: '编辑', value: 'edit', icon: 'edit'}, {label: '拷贝', value: 'copy', icon: 'copy'}, {label: '删除', value: 'delete', icon: 'delete'}]}],
            dataType: TYPE_ENUM.ACTION
          })
        }

        this.columns = items
      } 
    },

    // -------------------------网络请求------------------------------------
    // 网络请求-获取下拉选项字典数据
    requestGetDict (dictApi) {

        h_request(dictApi.method, dictApi.url, dictApi.params, dictApi.data, dictApi.header).then((res) => {
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

            this.$set(this.selectDict, dictApi.key, items)

            this.columns.forEach(el => {
                if (el.key == dictApi.key) {
                    el.selectItems = items
                }
            })

            this.searchItems.forEach(el => {
                if (el.key == dictApi.key) {
                    el.selectItems = items
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

    // 网络请求-获取工程列表
    requestGetList () {
        // 1:组织参数
        const params = {}

        if (this.isPagination) {
            this.$set(params, 'current', this.pagination.pageNum)
            this.$set(params, 'pageSize', this.pagination.pageSize)
        }

        Object.assign(params, this.searchForm)
        Object.assign(params, this.extParams)

        // 2:设置loading加载
        this.$refs.list._startLoading()
        h_getList(this.apiName, params, this.header).then((res) => {
          console.log(res)
            // 3:成功-进行业务操作（注：200还是'200'具体需要根据服务器返回确定）
            if (String(res.code) === this.succCode) {
                if (res.data.list) {
                    this.list = res.data.list
                    this.$set(this.pagination, 'total', Number(res.data.total))
                } else {
                    this.list = res.data
                    this.$set(this.pagination, 'total', Number(res.total) || res.data.length)
                }
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
        this.$refs.list._stopLoading()
        })

    },

    // 网络删除
    requestDelete (val) {

      // 2:设置loading加载
      this.loading = true
      h_delete(this.apiName, val[this.idKey], this.header)
          .then((res) => {
            // 3:成功-进行业务操作（注：200还是'200'具体需要根据服务器返回确定）
            if (String(res.code) === this.succCode) {
                this.$message.success('删除成功')
                this.requestGetList()
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


    // -------------------------------------通知--------------------------------------
    handleHeaderBtnClick(info) {
        if (info.value == 'add') {
            this.$refs.detail._show()
        } 

        this.$emit('headerBtnClick', info)
    },

    // 搜索框-选择框进行搜索
    handleSelectSearch (info) {
      const { kw, item, form } = info
    },

    // 搜索框-选择框的进行选中事件
    handleSelectChange (info) {
      const { kw, item, form } = info
    },

    // 搜索框-搜索按钮点击事件
    handleSearchClick (info) {
      if (info.item.value == 'search') { // 搜索
        this.pagination.pageNum = 1
        this.requestGetList()
      } else if (info.item.value == 'reset') {// 重置
        // this.searchItems.forEach(el => {
        
        //     // this.$set(this.searchForm, el.key, '')
        // })
        this.searchForm = {}
        this.pagination.pageNum = 1
        this.requestGetList()
      }
      
      this.$emit('searchBtnClick', info)
    },

    // list 分页
    handleListPageChange (val) {
      
        this.selectedRowKeys = []
        this.pagination.pageNum = val.current
        this.requestGetList()

        // 通知选中项变化
        if(this.rowSelected) {
            this.$emit('tableRowChange', {selectedRowKeys: [], selectedRows: []})
        }
      
    },

    handleListRowChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.$emit('tableRowChange', {selectedRowKeys, selectedRows})
    },

    // 按钮点击事件
    handleListButtonClick (val) {
      if (val.val.value == 'detail') {
        this.$refs.detail._show(val.info, OPERATION_TYPE.DETAIL)
      } else if (val.val.value == 'edit') {
        this.$refs.detail._show(val.info, OPERATION_TYPE.EDIT)
      } else if (val.val.value == 'copy') {

        // 拷贝数据重组：删除ID，创建新的copyId作为查询详情关键字
        var params = Object.assign({}, val.info)
        params.copyId = params[this.idKey]
        params[this.idKey] = null
        console.log(params)

        this.$refs.detail._show(params, OPERATION_TYPE.COPY)
      } else if (val.val.value == 'delete') {
        this.$refs.confirm._show('确认删除？', '删除后不可恢复，请谨慎操作', (res) => {
        if (this.apiName) {
          this.requestDelete(val.info)
        } else {
          this.$emit('delete', val.info)
        }
          
        })
      }

      this.$emit('tableBtnClick', val)
    },

    // 详情页-新增成功
    handleAddSucc (info) {
        this.requestGetList()
    },

    // 详情页-编辑成功
    handleEditSucc (info) {
        this.requestGetList()
    },

    handleDetailOK(info) {
      this.$emit('detailOk', info)
    }

  },
}
</script>
