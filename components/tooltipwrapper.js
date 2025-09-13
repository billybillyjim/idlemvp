export default {
  props: {
    text: '',
    ishtml:false,
  },
  template: `
   <span 
        @pointermove="$parent.setTooltipData(text, ishtml, $event)"
        @pointerenter="$parent.setTooltipData(text, ishtml, $event)"
        @pointerleave="$parent.clearTooltipData()">
      <slot></slot>
    </span>
  `
};
