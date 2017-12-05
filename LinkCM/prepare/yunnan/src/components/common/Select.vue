<!-- div模拟下拉框 -->
<template>
    <form class="form"> 
        <div class="divselect" v-el:divele :style="uwidth"> 
            <cite>{{initName}}</cite>
            <ul v-show="ulStat==true" :style="uwidth">
                <li v-for="it in list" @click="selectChild(it.text, it.value)">
                    <a>{{it.text}}</a>
                </li>
            </ul> 
        </div> 
        <input name="" type="hidden" value="" v-el:inputele/> 
    </form> 
</template>

<script>
    /* 
     * @param def 默认值
     * @param list 列表数据
     * @param width 下拉框的宽度
     * @param defname 默认值的父组件属性名称
     */
    export default {
        props: ['def', 'list', 'width', 'height', 'defname', 'valname','initvalue'],
        data() {
            return { 
                ulStat: false,
                selectName: '',
                initName: ''
            }
        },
        computed:{
            // 控制宽度
            cwidth: function() {
                var width = 150;
                if (!!this.width) width = this.width;
                return { 'width': width + 'px' };
            },
            uwidth: function() {
                var height = 150;
                if (!!this.height) height = this.height;
                return { 'max-height': parseInt(height) + 'px' };
            }
        },
        watch: {
            def: function(){
                let ul = $(this.$els.divele).find('ul');
                ul.prev().text(this.selectName || this.def);
            }
        },
        methods: {
            // 初始化下拉框
            initSelect: function() {
                var divEle = this.$els.divele;
                var inputselect = $(this.$els.inputele);
                $(divEle).find('cite').click(() => {
                    if (this.list.length > 0) {
                        var ul = $(divEle).find('ul');
                        if (this.ulStat) {
                            this.ulStat = false;
                            ul.slideUp("fast");
                        } else {
                            this.ulStat = true;
                            ul.slideDown("fast");
                        }
                    }
                });
                $(divEle).find('ul li a').click(function() {
                    var txt = $(this).text();
                    $(divEle).find('cite').html(txt);
                    var value = $(this).attr("selectval");
                    inputselect.val(value);
                    $(divEle).find('ul').hide();
                });
            },
            // 选择子菜单
            selectChild: function(text, value) {
                this.selectName = text;
                var ul = $(this.$els.divele).find('ul');
                if (this.defname.indexOf('.') != -1) {
                    let allTypes = this.defname.split('.');
                    this.$parent[allTypes[0]][allTypes[1]] = value;
                } else if (!this.initvalue) {
                    this.$parent[this.defname] = text;
                } else {
                    this.$parent[this.defname] = value;
                }
                if (!!this.valname) {
                    if (this.valname.indexOf('.') != -1) {
                        let allTypes = this.valname.split('.');
                        this.$parent[allTypes[0]][allTypes[1]] = value;
                    } else {
                        this.$parent[this.valname] = value;
                    }
                }
                this.ulStat = false;
                ul.slideUp("fast");
                ul.prev().text(text);
            },
            // 隐藏菜单
            hideChild: function() {
                this.ulStat = false;
            }
        },
        compiled: function(){  
            if (!this.initvalue) {
                this.initName = this.def;
            } else {
                this.initName = this.initvalue;
            }
            this.initSelect();
        }
    }
</script>

<style scoped lang="less">
@import "../../assets/css/common.less";
.form { float: left; display: flex; }
.divselect { position: relative; margin-right: 5px; width: 140px;
    cite { overflow: hidden; height: 22px; line-height: 22px; display: block; color: @colorH; cursor: pointer; font-style: normal; padding-left: 4px; padding-right: 30px; border: 1px solid #ccc; background: url(../../assets/img/common/sarrow.png) no-repeat right center; }
    ul { width: 138px; max-height: 150px; overflow-y: scroll; overflow-x: hidden; border: 1px solid #ccc; background-color: #ffffff; position: absolute; z-index: 10; margin-top: -1px;
        li { height: 24px; line-height: 24px; overflow: hidden;
            a { display: block; height: 24px; text-decoration: none; padding-left: 10px; padding-right: 10px; }
            a:hover { background-color: #CCC; }
        }
    }
}
div.decideSelect { .divselect { width: 120px;
        ul { width: 118px;
            li a { padding-left: 0; }
        }
    }
}
div.fontF { .divselect { width: 45px;
        cite { width: 33px; padding-right: 8px; height: 27px; line-height: 27px; }
        ul { width: 45px;
            li a { width: 35px; padding-left: 3px; }
        }
    }
}
div.poll-select cite { text-indent: 33px; }
div.nd-select { .divselect { width: 120px;
        cite { text-indent: 60px; width: 120px; padding: 0; }
        ul { width: 120px; }
    }
}
div.font-select { .divselect { width: 60px;
        ul { width: 58px;
            li a { padding-left: 0; }
        }
    }
}
div.auto-panel { .divselect { cite { background-color: #fff; }
    }
}
div.videoSelect { .divselect { width: 160px;
        ul { width: 158px; }
    }
}
.ecaseif .divselect { width: 99px;
    ul { width: 97px; }
}
.export .divselect { margin-top: 4px; }
.big .divselect { width: 240px;
    cite { height: 30px; line-height: 30px; }
    ul { width: 238px;
        li { height: 30px; line-height: 30px;
            a { height: 30px; }
        }
    }
}
.big .ecaseif .divselect { width: 150px;
    ul { width: 148px; }
}
.big .export .divselect { width: 176px; }
.big div.decideSelect { .divselect { width: 195px; }
    ul { width: 193px; }
}
.big div.fontF { .divselect { width: 80px;
        cite { width: 68px; padding-right: 8px; height: 37px; line-height: 37px; }
        ul { width: 80px;
            li a { width: 70px; padding-left: 3px; }
        }
    }
}
.big div.poll-select { .divselect { width: 145px;
        cite { width: 145px; text-indent: 50px; padding-right: 0; }
        ul { width: 149px; }
    }
}
.big div.nd-select { .divselect { width: 200px;
        cite { width: 200px; text-indent: 95px; }
        ul { width: 200px; }
    }
}
.big div.time-select { .divselect { width: 200px;
        cite { width: 196px; padding-right: 0; }
        ul { width: 200px; }
    }
}
.big div.font-select { .divselect { width: 90px;
        ul { width: 88px;
            li a { padding-left: 0; }
        }
    }
}
</style>