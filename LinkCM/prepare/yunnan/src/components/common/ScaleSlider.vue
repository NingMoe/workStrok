<template>
    <div>
        <div class="model-name" v-if="!bothPanel">{{slider.currName}}</div>
        <div class="model-name multi-panel" v-if="bothPanel">
            <ul>
                <li v-if="timeName">{{ timeName }}:</li>
                <li class="li_input" v-for="item in childItems" @click="selectBothModel($key)">
            		<input class="form-radio" type="radio" name="multiModel" v-model="multiModel" :value="$key" :id="$key"/>
            		<label :for="$key">{{item.name}}</label>
            	</li>
            </ul>    
        </div>
        <div>
            <div class="model-slider" :id="slider.model + '-slider'"></div>
            <!-- <ul class="model-scale"><li v-for="item in slider.baseItems" @click="selectModel($index)" :style="liWidth">{{item.dateTime}}</li></ul> -->
        </div>
    </div>
</template>

<script>

    // import 'jquery-ui/themes/base/slider.css'
    // import 'jquery-ui/themes/base/theme.css'
    import 'jquery-ui/ui/widgets/slider'
    import '../../util/slider-pips/jquery-ui-slider-pips'
    import { updateParam } from '../../vuex/store'
    import ModelInfo from '../common/model'

    export default {
        props: ['slider'],
        vuex: { getters: { pType: state => state.model.pType }, actions: { updateParam } },
        data() {
            return {
                childItems: {},
                multiModel: '',
                timeName: '',
                multiType: ''
            }
        },
        computed: {
            bothPanel: function() {
                return this.slider.baseItems[this.slider.currIndex].both;
            },
            liWidth: function() {
                return { width: Number(100 / this.slider.baseItems.length).toFixed(5) + '%' };
            },
            isSeconds:function(){
                return true;
                $(".li_input").each(function(index,ele){
                    if(index==1&&this.timeName!=='过去24小时')
                        return true;
                    else
                        return false;
                });
            }
        },
        methods: {
            selectModel: function(index){
                this.timeName = ''
                let slider = this.slider;
                $('#' + slider.model + '-slider').slider('option', 'value', index);
                let item = slider.baseItems[index];
                let childItems = {};
                let cType = item.code;
                if (item.both) {
                    childItems = slider.childModel[item.code];
                    this.childItems = childItems;
                } else {
                    this.multiType = item.type;
                }
                
                let state = 0;
                for (let type in childItems) {
                    if (childItems[type].type === this.multiType) {
                        cType = type;
                        state = 1;
                        break;
                    } else {
                        state = 2;
                    }
                }

                slider.currModel = cType;
                slider.currIndex = index;
                slider.currName = item.name;
                if (state === 0 && !this.multiType) {
                    this.multiType = item.type;
                }

                if (state === 2) {
                    this.multiType = item.type;
                }

                this.multiModel = cType;
                if (item.timeName) this.timeName = item.timeName;
                if (ModelInfo.dropzone[cType]) {
                    this.updateParam('dropzone', 'status', true);
                    this.updateParam('dropzone', 'pType', this.pType);
                    this.updateParam('dropzone', 'cType', cType);
                    this.updateParam('model', 'cType', '');
                } else {
                    this.updateParam('dropzone', 'pType', '');
                    this.updateParam('dropzone', 'cType', '');
                    this.updateParam('dropzone', 'status', false);
                    this.updateParam('model', 'cType', cType);
                }
            },
            selectBothModel: function(cType){
                let slider = this.slider;
                this.childItems[slider.currModel].status = false;
                this.childItems[cType].status = true;
                slider.currName = this.childItems[cType].name;
                this.multiType = this.childItems[cType].type;
                if (ModelInfo.dropzone[cType]) {
                    this.updateParam('dropzone', 'pType', this.pType);
                    this.updateParam('dropzone', 'cType', cType);
                    this.updateParam('model', 'cType', '');
                } else {
                    this.updateParam('dropzone', 'pType', '');
                    this.updateParam('dropzone', 'cType', '');
                    this.updateParam('model', 'cType', cType);
                }
            }
        },
        created : function(){
            this.sliderData = $.extend({}, this.slider);
        },
        ready: function(){
            let nameArr = this.slider.baseItems.map((data)=>{
                return data.dateTime;
            });
            $('#' + this.slider.model + '-slider').slider({
                min: 0,
                max: this.slider.baseItems.length - 1,
                value: this.slider.currIndex,
                slide: (event, ui) => {
                    this.selectModel(ui.value);
                }
            }).slider("pips", {
                rest: "label",
                labels: nameArr
            });
            let status = this.slider.baseItems[this.slider.currIndex].both;
            if (status){
                this.selectModel(this.slider.currIndex);
            }
        }
    }
</script>

<style scoped lang="less">
@import '../../util/slider-pips/jquery-ui-slider-pips.css';
.model-slider { 
	margin-left:9px; 
	margin-right: 12px; 
	height: 1px; 
	border-radius: 0; 
	border: 0px; 
	background:#c1c1c1; 
	}
.model-slider:after { content: "h"; position: absolute; right: -13px; top: -4px; font-size: 13px; color: #6d82a1; }
.model-scale { li { display: inline-block; text-align: center; }
    li:first-child { text-align: start; }
    li:last-child { text-align: end; }
}
.both-panel { position: absolute; background: rgba(255, 255, 255, 0.9); box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
    ul li { margin: 5px; min-width: 100px; }
}
.model-select { color: #1f7ed0; }
.model-name { 
	margin: 0 0px 5px 0px; 
	height: auto; 
	overflow: hidden;
    ul { 
    	width: 100%; 
    	clear: both; 
    	height: 16px;
        li { 
        	float: left;
        	margin-right: 0px;
        	 margin-bottom: 5px;
            input { 
            	height: 14px; 
            	width: 14px; 
            	vertical-align: middle; 
            	margin-right: 2px; 
            	margin-top: -1px; cursor: pointer; 
            	}
        }
        li.li_input{
        	min-width: 16%;
        	margin-right: 5px;
        }
        li.li_input:nth-child(4){
        	margin-left:24.6%;
        }
    }
}
.big .model-name { margin: 0 0px 10px 0px; font-size: 18px;
    ul { height: 22px;
        li { 
        	input { 
        		height: 16px; 
        		width: 16px; 
        	}
        }
        li.li_input:nth-child(4){
        	margin-left: 26.3%;
        }
    }
}
.big .model-slider:after { font-size: 20px; top: -11px; }
</style>