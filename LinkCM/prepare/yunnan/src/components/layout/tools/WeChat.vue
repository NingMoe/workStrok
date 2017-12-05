<template>
    <div class="wechat-pic">
        <v-picplay :list="list" :count="7" v-if="playStat==true"></v-picplay>
        <!-- <ul>
            <li v-for="item in picItems"><img :src="'http://10.148.10.219/dssimg' + item.img_Path"/></li>
        </ul> -->
    </div>
</template>

<script>
    import picplay from '../../common/PicPlay'

    export default {
        components:{
            'v-picplay': picplay
        },
        data () {
            return {
                picItems: [],
                list: {
                    picList: []
                },
                playStat: false
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                dateTime: state => state.wechat.dateTime,
                code: state => state.cityCode,
                areaName: state => state.areaName
            }
        },
        watch: {
            code: function(){
                this.getPicList();
            }
        },
        methods: {
            getPicList: function(){
                var code = this.code;
                code = code.length < 4 ? code + '00' : code;
                code = code.length < 6 ? code + '00' : code;
                var reqParam = { 'dangerTime': this.dateTime, 'cityCode': code, 'cityName': this.areaName };
                $.ajax({
                    url: this.dss+'/topicRead/topic-read!queryWindowInfo.action',
                    type: 'GET',
                    dataType: 'json',
                    data: reqParam,
                    success: (json)=>{
                        let data = json.PIC_NOTICE;
                        let picArr = []
                        data.forEach(function(pic){
                            var img_Path = pic.img_Path.replace(',','').replace(/\\/g,'/');
                            var arr = img_Path.split('.jpg');
                            picArr.push('http://10.148.10.219/dssimg' + arr[0] + '.jpg');
                        });
                        this.list.picList = picArr;
                        this.playStat = true;
                        // that.picItems = data;
                    }
                });
            }
        },
        ready: function(){
            this.getPicList();
            this.wechatTimer = window.setInterval(()=>{
                this.getPicList();
            }, 300000);
        },
        detached: function(){
            window.clearInterval(this.wechatTimer);
        }
    }
</script>

<style scoped lang="less">
.wechat-pic {
    
}
.wechat-pic img{
    width: 100px;
    height: 100px;
}

.wechat-pic ul{
    
}

.wechat-pic ul li {
    display: inline-block;
}
</style>