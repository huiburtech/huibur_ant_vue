import Form from './index.vue'

/* istanbul ignore next */
Form.install = function(Vue) {
  Vue.component('hForm', Form);
};

export default Form;