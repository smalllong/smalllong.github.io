
Vue.component('flip-num', {
	props: ['value'],
	template: '#flip-num-template',
	data: function() {
		return {
			imgTop: 0,
			flipping: false,
		}
	},
	computed: {
		imgBottom: function() {
			if (this.imgTop != this.value) {
				this.flipping = true;
				var that = this;
				setTimeout(function() {
					that.flipping = false;
					that.imgTop = that.value;
				}, 1500);
			}
			return this.value;
		}
	}
});

var vm = new Vue({
    el: '#app',
    data: {
        value: 1,
    },
    methods: {
        add: function() {
            (this.value==9)?(this.value=0):(this.value++);
        },
        minus: function() {
            (this.value==0)?(this.value=9):(this.value--);
        },
    }
});