import Header from './index.vue'

/* istanbul ignore next */
Header.install = function(Vue) {
  Vue.component('hHeader', Header);
};

export default Header;