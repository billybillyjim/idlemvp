export default {
    props: {
      data: Object
    },
    methods:{
      formatDate(date) {
        if(typeof date === "string"){
          date = new Date(date);
        }
        let calTech = this.$parent.getCalendarTech()
        if(calTech == 'Solar'){
          const year = date.getFullYear() - 2000;
          const month = date.toLocaleString('en-US', { month: 'long' });
          const day = String(date.getDate()).padStart(2, '0');

          return `${year} ${month} ${day}`;
        }
        else if(calTech == 'Lunar'){
          let [day, month] = this.$parent.getLunarDate(date);
          return `${day} ${month}`;
        }
        else{
          return this.$parent.getPrecalendarDate(date);
        }
      },
      setSpeed(value){
        this.$parent.setSpeed(value);
      },
      
    },
    delimiters: ['[[', ']]'],
    template: `
    <div class="grid-item">
        <h4>Current Date: [[formatDate($parent.currentDate)]]</h4>
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
                <td>[[formatDate(log.Time)]]</td><td>[[log.message]]</td>
                </tr>
            </tbody>
          </table>
        </div>
    </div>
    
    `
  }
