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
    getText(){
        if(this.data?.calcfrom){
            return this.data.calcfrom();
        }
        if(this.data?.text){
            return this.data.text;
        }
        return '';
        
    }
  },
  delimiters: ['[[', ']]'],
  template: `
   <span :class="containerClass" class="tooltip-container" v-show="data?.visible">
      <slot></slot>

      <div :class="['tooltip-box', tooltipClass]" :style="pos()">
        <span v-if="!data?.isHtml">[[ getText() ]]</span>
        <span v-else v-html="getText()"></span>
      </div>
    </span>
  `
};
