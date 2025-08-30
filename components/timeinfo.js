export default {
    props: {
      data: Object
    },
    methods:{
      setSpeed(value){
        this.$parent.setSpeed(value);
      },
      
    },
    delimiters: ['[[', ']]'],
    template: `
    <div class="grid-item">
        <h4>Current Date: [[$parent.formatDate($parent.currentDate)]]</h4>
        <div class="d-flex">
          <button class="btn btn-primary m-2" @click="setSpeed(200)">Normal</button>
          <button class="btn btn-primary m-2" @click="setSpeed(100)">2x</button>
          <button class="btn btn-primary m-2" @click="setSpeed(50)">4x</button>
          <button class="btn btn-primary m-2" @click="setSpeed(1)">200x</button>
        </div>
        <div class="log">
          <table class="table table-striped">
            <tbody>
              <tr v-for="log in $parent.log">
                <td>[[$parent.formatDate(log.Time)]]</td><td>[[log.message]]</td>
                </tr>
            </tbody>
          </table>
        </div>
    </div>
    
    `
  }
