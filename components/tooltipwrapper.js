export default {
  props: {
    text: '',
    ishtml:false,
	calcfrom:{type:Function}
  },
  template: `
   <span 
        @pointermove="$parent.setTooltipData(text, ishtml, $event,calcfrom)"
        @pointerenter="$parent.setTooltipData(text, ishtml, $event,calcfrom)"
        @pointerleave="$parent.clearTooltipData()">
      <slot></slot>
    </span>
  `
};
