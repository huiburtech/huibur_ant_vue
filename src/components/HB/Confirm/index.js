import Confirm from './index.vue'

/* istanbul ignore next */
Confirm.install = function(Vue) {
  Vue.component('hConfirm', Confirm);
};

export default Confirm;