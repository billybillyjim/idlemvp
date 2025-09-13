export default {
  props: {
    data: Object
  },
  data() {
    return {
      eventData:null,
      text:'',
      isHtml:false,
      containerClass:'',
      tooltipClass:'',
      offsetX:15,
      offsetY:15,
    };
  },
  methods: {
    pos() {
        if(this.data && this.data.visible){
            return { top: (this.data?.data.clientY - this.offsetY) + "px", left: (this.data?.data.clientX  + this.offsetX) + "px" };
        }
        return '';
    },
    setData(data){
        console.log(data);
    }
  },
  delimiters: ['[[', ']]'],
  template: `
   <span :class="containerClass" class="tooltip-container" v-show="data?.visible">
      <slot></slot>

      <div :class="['tooltip-box', tooltipClass]" :style="pos()">
        <span v-if="!data?.isHtml">[[ data?.text ]]</span>
        <span v-else v-html="data?.text"></span>
      </div>
    </span>
  `
};
