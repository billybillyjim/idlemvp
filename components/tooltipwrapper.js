export default {
	props: {
		text: '',
		ishtml: false,
		vm: null,
		calcfrom: { type: Function }
	},
	methods: {
		setTooltipData(text, ishtml, $event, calcfrom) {
			if (this.vm) {
				this.vm.setTooltipData(text, ishtml, $event, calcfrom);
			}
			else {
				console.error("Failed to show tooltip because vm was not set for wrapper");
			}
		},
		clearTooltipData(vm) {
			if (this.vm) {
				this.vm.clearTooltipData();
			}
		},
	},
	template: `
   <span 
        @pointermove="setTooltipData(text, ishtml, $event, calcfrom)"
        @pointerenter="setTooltipData(text, ishtml, $event, calcfrom)"
        @pointerleave="clearTooltipData()">
      <slot></slot>
    </span>
  `
};
