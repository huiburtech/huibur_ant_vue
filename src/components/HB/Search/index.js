import Search from './index.vue'

/* istanbul ignore next */
Search.install = function(Vue) {
  Vue.component('hSearch', Search);
};

export default Search;