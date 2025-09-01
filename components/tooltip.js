export default {
  props: {
    data: Object
  },
  data() {
    return {
      visible: false,
      x: 0,
      y: 0
    };
  },
  methods: {
    cfg() {
      // defaults + user overrides
      return Object.assign(
        { text: "", offsetX: 10, offsetY: 10, tooltipClass: "", containerClass: "" },
        this.data || {}
      );
    },
    show(e) {
      const c = this.cfg();
      if(c.text){
        this.visible = true;
        this.x = (e?.clientX || 0) + c.offsetX;
        this.y = (e?.clientY || 0) + c.offsetY;
      }

    },
    move(e) {
      if (!this.visible) return;
      const c = this.cfg();
      this.x = (e?.clientX || 0) + c.offsetX;
      this.y = (e?.clientY || 0) + c.offsetY;
    },
    hide() {
      this.visible = false;
    },
    pos() {
      return { top: this.y + "px", left: this.x + "px" };
    }
  },
  delimiters: ['[[', ']]'],
  template: `
   <span
      :class="cfg().containerClass"
      @mouseenter="show"
      @mousemove="move"
      @mouseleave="hide"
      class="tooltip-container"
    >
      <slot></slot>

      <div
        v-if="visible"
        :class="['tooltip-box', cfg().tooltipClass]"
        :style="pos()"
      >
        [[ cfg().text ]]
      </div>
    </span>
  `
};
