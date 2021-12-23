import List from './index.vue'

/* istanbul ignore next */
List.install = function(Vue) {
  Vue.component('hList', List);
};

export default List;