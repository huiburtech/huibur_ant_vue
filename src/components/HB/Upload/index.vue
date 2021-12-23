<template>
    <a-upload
        :listType="listType"
        :file-list="fileList"
        :accept="accept"
        :action="action"
        :data="formData"
        :headers="headers"
        :show-upload-list="(listType == 'picture-card' && fileNum == 1) ? false : { showPreviewIcon: true, showRemoveIcon: !(fileNum == 1)}"
        :multiple="multiple && fileNum != 1"
        :before-upload="beforeUpload"
        @change="handleChange"
    >       

        <!-- 类型：单图； 多图，其他文件 -->
        <!-- 图片文件 -->
        <template v-if="listType == 'picture-card'">  

            <!-- 单图 -->
            <template v-if="fileNum == 1">
                <img v-if="file" :src="file.url" style="width: 100%; height: 100%; object-fit: cover;"/>
                <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                        {{title}}
                    </div>
                </div>
            </template>
            <!-- 多图 -->
            <template v-else>
                <div v-if="fileNum == 0 || fileList.length < fileNum"> 
                    <a-icon :type="loading ? 'loading' : icon" />
                    <div class="ant-upload-text">{{ title }}</div>
                </div>
            </template>
        </template>
        <!-- 非图 -->
        <template v-else>
            <a-button> 
                <a-icon :type="loading ? 'loading' : icon" /> 
                {{title}} 
            </a-button>
        </template>
    </a-upload> 
</template>
<script>

import { getQiniuToken } from '../api/qiniu'

export default {
  name: 'Upload',

  props: {
    fileData: [String, Object, Array],
    fileNum: {
        type: Number,
        default: 1
    },
    multiple: {
        type: Boolean,
        default: false
    },
    listType: {
        type: String,
        default: 'text'
    },
    action: {
      type: String,
      default: 'https://upload.qiniup.com',
    },
    accept: {
      type: String,
    },
    headers: {
        type: Object,
    },
    formData: {
        type: Object,
        default: () => {
            return {
                token: null, // 七牛云token
                domain: 'https://statics.huibur.com/',
                region: 'ECN',
                uploadURL: 'https://upload.qiniup.com',
            }
        }
    },
    qnTokenApi: {
        type: Object,
        default: () => {
            return null
            // return {
                // method: 'GET',
                // url: 'https://www.huibur.com/hbopen/ThirdApi/qiniu/qnToken',
                // params: {
                //     accessKey: 'DNodn9bFs97CvtwIa53Fq-8v9kHM1j6qGlDbCeb9',
                //     secretKey: 'zfooX4RSwo_yASAdZQ0M2J7h4AT6rwMjHWEWHIwf',
                //     bucket: 'static'
                // }
            // }
        }
    },
    title: {
      type: String,
      default: '上传',
    },
    icon: {
      type: String,
      default: 'upload',
    }
  },
  data() {
    return {
        loading: false,
        fileList: [],
        file: null

    }
  },
  watch:{
    fileData:function(val){
        if (val.constructor == Array) {
            var items = []
            val.forEach((element, index) => {
                var url = element.constructor == String ? element : element.url
                var file = {
                    thumbUrl: (url.indexOf('http://') > -1 || url.indexOf('https://') > -1 ? "" : this.formData.domain) + url,
                    url: url,
                    uid: index,
                    status: 'done',
                    name: element.name || ('文件' + index)
                }
                items.push(file)
            });
            this.fileList = items
        } else {
            var url = val.constructor == String ? val : val.url
            this.file = {
                thumbUrl: (url.indexOf('http://') > -1 || url.indexOf('https://') > -1 ? "" : this.formData.domain) + url,
                url: url,
                uid: -1,
                status: 'done',
                name: val.name || '文件'
            }
        }

    }
  },
  mounted() {
      if (this.fileData) {
          if (this.fileData.constructor == Array) {
              var items = []
              this.fileData.forEach((element, index) => {
                var url = element.constructor == String ? element : element.url
                var file = {
                    thumbUrl: (url.indexOf('http://') > -1 || url.indexOf('https://') > -1 ? "" : this.formData.domain) + url,
                    url: url,
                    uid: index,
                    status: 'done',
                    name: element.name || ('文件' + index)
                }
                items.push(file)
              });
              this.fileList = items
          } else {
                var url = this.fileData.constructor == String ? this.fileData : this.fileData.url
               this.file = {
                    thumbUrl: (url.indexOf('http://') > -1 || url.indexOf('https://') > -1 ? "" : this.formData.domain) + url,
                    url: url,
                    uid: -1,
                    status: 'done',
                    name: this.fileData.name || '文件'
                }
          }
       
      }
  },

  methods: {
    handleCancel() {
      this.previewVisible = false
    },

    async beforeUpload(file, fileList) {

        if (this.accept && !this.accept.split(',').includes(file.type)) {
            this.$message.error('文件类型不正确')
            return false
        }

        if (this.qnTokenApi && !this.formData.token) {
            const res = await getQiniuToken(this.qnTokenApi.method, this.qnTokenApi.url, this.qnTokenApi.params)
            var token = ''
            if (res.constructor == String) {
                token = res
            } else if (res.constructor == Object) {
                token = res.data
            }
            this.$set(this.formData, 'token', token)
        }

        return true
    },


    handleChange(info) {

        if (this.fileNum == 1) {
            this.fileList = [info.file]
        } else {
            this.fileList = info.fileList
        }

        if (info.file.status === 'uploading') {
            this.loading = true
            return
        } else if (info.file.status === 'done') {
            this.loading = false
            this.file = info.file
            if (this.qnTokenApi && info.file.response.key) { // 七牛云模式
                this.$set(this.file, 'url', `${this.formData.domain}/${info.file.response.key}`)

                this.fileList.forEach(el => {
                    if (el.response && this.formData.domain) {
                        this.$set(el, 'url', `${this.formData.domain}/${el.response.key}`)
                    }
                })
            }        
        } else if (info.file.status === 'error') {
            this.loading = false
        } else if (info.file.status == 'removed') {
            this.fileList = info.fileList
        }
        
        this.$emit('change', this.fileList)
    },
  },
}
</script>
<style scoped>
</style>