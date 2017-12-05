<template>
    <div></div>
</template>

<script>
    import { updateParam } from '../../vuex/store'

    export default {
        data() {
            return {
               left: 0,
               right:0,
               index:4
            }
        },
        vuex: {
            getters: {
                divIds: state => state.windows.divIds
            },
            actions: {
                updateParam
            }
        },
        watch:{
            divIds: function(){
                this.controlWindow();
            }
        },
        methods: {
          /**
          *确定打开的div的堆叠顺序，将最近展开的div显示在最上面
          */
           controlWindow: function(){
               if(this.divIds === ''){
                   return;
               }
               let idArr = this.divIds.split(',');
               let num = 0;
               for(let k in idArr){
                   if(idArr[k] === ''){
                       return;
                   }
                   let obj = $('#'+idArr[k]);
                   this.right = num * 20; 
                   this.top = num * 25;
                   obj.css('top',this.top+'px');
                   obj.css('right',this.right+'px');
                   obj.css('zIndex',this.index+num)
                   num ++ ;
               }
           }
        },
        ready: function(){
           
        },
        detached: function(){
            
        }
    }
</script>

<style scoped="scoped" lang="less">

</style>