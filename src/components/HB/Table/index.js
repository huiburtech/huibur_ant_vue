import Table from './index.vue'

/* istanbul ignore next */
Table.install = function(Vue) {
  Vue.component('hTable', Table);
};

export default Table;