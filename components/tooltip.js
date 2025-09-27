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
            let height = this.getTooltipHeight();
            let max = window.innerHeight;
            let top = (this.data?.data.clientY - this.offsetY)
            let overflow = this.data?.data.clientY - this.offsetY + height - max;
            if(overflow > 0){
                top -= overflow;
            }
            return { top: top + "px", left: (this.data?.data.clientX  + this.offsetX) + "px" };
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
        
    },
    getTooltipHeight(){
       let el = document.getElementById('tooltip');
       return el?.clientHeight;
    },
  },
  delimiters: ['[[', ']]'],
  template: `
   <span :class="containerClass" class="tooltip-container" v-show="data?.visible">
      <slot></slot>

      <div id="tooltip" :class="['tooltip-box', tooltipClass]" :style="pos()">
        <span v-if="!data?.isHtml">[[ getText() ]]</span>
        <span v-else v-html="getText()"></span>
        [[getTooltipHeight()]]
      </div>
    </span>
  `
};
