/*Vue.component('my-component',{
    template:'<div id="context">' +
        '<button @click="commit" v-show={{showcommit}} class="button">提交</button>' +
        '<button @click="theup(currentPage)" v-show={{showup}} class="button">上一步</button>' +
        '<button @click="thenext(currentPage)" v-show={{shownext}} class="button">下一步</button>' +
        '<button @click="reset" >重置</button>' +
        '' +
        '</div>',
    methods:{
        commit: function () {

        },
        theup: function (currentPage) {

        },
        thenext: function (currentPage) {

        },
        reset: function () {

        }
    }

});*/
var bus = new Vue();


Vue.component('onepage',{
    template: '<div>' +
        '<p>请问您的性别是：</p>' +
        '<br>' +
        '<input type="radio" v-model="picked" @change="change" value="man" id="man">' +
        '<label for="man">男</label>' +
        '<br>' +
        '<input type="radio" v-model="picked" @change="change" value="women" id="women">' +
        '<label for="women">女</label>' +
        '<br>' +
        '<input type="radio" v-model="picked" @change="change" value="secert" id="secert">' +
        '<label for="secert">保密</label>' +
        '<br>' +
        '</div>',
    data: function () {
        return{
            picked:''
        }
    },

    methods: {
        change: function () {
            bus.$emit('on-message',this.picked);
        }
    }

});

Vue.component('twopage',{
    template:'<div>' +
        '<p>请选择您的兴趣爱好</p>' +
        '<br>' +
        '<input type="checkbox" v-model="habits" @change="change" value="看书" id="read">' +
        '<label for="read">看书</label>' +
        '<br>' +
        '<input type="checkbox" v-model="habits" @change="change" value="打篮球" id="basketball">' +
        '<label for="basketball">打篮球</label>' +
        '<br>' +
        '<input type="checkbox" v-model="habits" @change="change" value="打游戏" id="computer">' +
        '<label for="computer">打游戏</label>' +
        '<br>' +
        '</div>',
    data: function () {
        return{
            habits:['看书'],
        }
    },

    methods: {
        change: function () {
            bus.$emit('page2',this.habits);
        }
    }

})

Vue.component('threepage',{
    template:'<div>' +
        '<p>请介绍一下自己：</p>' +
        '<br>' +
        '<input type="text" v-model="value" @change="change" placeholder="请介绍一下你自己">' +
        '<br> </div>',
    data: function () {
        return{
            value:''
        }
    },

    methods:{
        change: function () {
            bus.$emit('page3',this.value);
        }
    }

})

Vue.component('botton',{
    template:'<div>' +
        '<button @click="buttonnext">下一页</button>' +
        '<button @click="buttonup">上一页</button>' +
        '<button @click="buttonreset">重置</button>' +
        '<button @click="commit">提交</button>' +
        '</div>',

    data: function () {
        return{
            currentPage:1,
            picked:'',
            habits: ['看书'],
            value:'',

        }
    },
    mounted: function () {
        var _this = this;
        bus.$on('page2', function (habit) {
            _this.habits = habit;
        });
        bus.$on('on-message', function (msg) {
            _this.picked = msg;
        });
        bus.$on('page3', function (value) {
            _this.value = value;
        });
    },

    methods:{
        commit: function () {
            var message1 = this.picked;
            var message2 = this.habits;
            var message3 = this.value;
            var params = new URLSearchParams();
            params.append('number', {message1,message2,message3});

            axios.post('/jiajiatest/vue', params)
                .then(function(res){
                    console.log(res);
                })
                .catch(function(err){
                    console.log(err);
                });
        },


        buttonreset: function () {
            this.currentPage =1;
            this.$parent.show1 = true;
            this.$parent.show2 = false;
            this.$parent.show3 = false;

        },


        buttonnext: function () {
            if(this.currentPage==3){
                return;
                /*最后一页点击下一页步进行操作*/
            };
            if(this.picked==''){
                alert('请选择选项');
                return ;
            };

            if(this.habits.length==0){
                alert('请选择选项');
                return ;
            }
            if(this.currentPage<3){
                this.currentPage = this.currentPage+1;
                /*页数加1*/
            };
            /*根据currentPage变化对页面显示进行操作*/
            if(this.currentPage==2){
              /*成了第二页，之前肯定是第一页*/
                this.$parent.show1=false;
                this.$parent.show2=true;
            }if(this.currentPage==3){
                this.$parent.show3=true;
                this.$parent.show2=false;

            };
        },
        buttonup: function () {
            if(this.currentPage==1){
                return;
            };
            if(this.currentPage>1){
                this.currentPage = this.currentPage-1;

            };
            if(this.currentPage==2){

                this.$parent.show3=false;
                this.$parent.show2=true;
            }if(this.currentPage==1){
                this.$parent.show1=true;
                this.$parent.show2=false;

            };

        }
    }
})