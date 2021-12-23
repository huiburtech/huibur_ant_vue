import Upload from './index.vue'

/* istanbul ignore next */
Upload.install = function(Vue) {
  Vue.component('hUpload', Upload);
};

export default Upload;