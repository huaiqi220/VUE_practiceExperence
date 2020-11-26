var Time ={
    getUnix: function () {
        var data = new Date();
        return data.getTime();
      },
    getTodayUnix: function () {
        var data = new Date();
        data.setHours(0);
        data.setMinutes(0);
        data.setSeconds(0);
        data.setMilliseconds(0);
        return data.getTime();
    },
    getYearUnix: function () {
        var data = new Date();
        data.setMonth(0);
        data.setDate(1);
        data.setHours(0);
        data.setMinutes(0);
        data.setSeconds(0);
        data.setMilliseconds(0);
        return data.getTime();
    },
    getLastDate: function (time) {
        var date = new Date(time);
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() <10 ?'0' + date.getDate():date.getDate();
        return date.getFullYear() + '-' + month + "-" + day;
    },
    getFormatTime: function (timestamp) {
        var now = this.getUnix();

        var today = this.getTodayUnix();

        var year = this.getYearUnix();
        var timer = (now-timestamp)/1000;
        var tip='';

        if (timer <= 0) {
            tip = '刚刚';

        }else if (Math.floor(timer / 60) <= 0) {
            tip = '刚刚';
        }else if (timer < 3600) {
            tip = Math.floor(timer / 60) + '分钟前';

        }else if (timer >= 3600 && (timestamp - today >= 0)) {
            tip = Math.floor(timer / 3600) + '小时前';

        }else if (timer / 86400 <= 31) {
            tip = Math.ceil(timer / 86400) + '天前';

        } else {
            tip = this.getLastDate(timestamp);

        }
        return tip;
    }
};

Vue.directive('time',{
    bind: function (el, binding) {
        /*innerHtMl定义操作*/
        el.innerHTML = Time.getFormatTime(binding.value);
        /*在此的_timeout_是一个计时器，每1分钟刷新一次显示*/
        el._timeout_ = setInterval(function () {
            el.innerHTML = Time.getFormatTime(binding.value);
        }, 60000);

    },
    /*unbind生命周期，销毁时清除掉定时器*/
    unbind: function (el) {
        clearInterval(el._timeout_);
        delete el._timeout_;

    }
    /*在编写自定义指令时，给DOM绑定一次性事件等初始操作建议在bind钩子里完成
    *   同时要在unbind钩子里解除绑定*/
})