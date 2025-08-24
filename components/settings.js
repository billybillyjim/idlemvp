export default {
    props: {
      data: Object
    },
    data() {
        return {
        deletingSave: false
        };
    },
    methods:{
        getDailyChange(currency){
            if(!this.$parent.currencies[currency.Name] || !this.$parent.previousCurrencyValues[currency.Name]){
                return 0;
            }
            return (this.$parent.currencies[currency.Name]?.Amount - this.$parent.previousCurrencyValues[currency.Name]?.Amount) * 24;
        }
    },
    delimiters: ['[[', ']]'],
    template: `
    <div class="grid-item">
        <div><h4>Settings</h4></div>
        <div>
            <table class="table table-striped">
                <tbody>
                    <tr>
                        <td>Download Save</td>
                        <td></td>
                        <td><button class="btn btn-primary m-2" @click="$parent.downloadSave()">Download</button></td>
                    </tr>
                    <tr>
                        <td>Upload Save</td>
                        <td><input type="file" @change="e => $parent.setUploadedFile(e)"></td>
                        <td><button class="btn btn-primary m-2" @click="$parent.uploadSave()">Upload</button></td>
                    </tr>
                    <tr>
                        <td>Reset Game</td>
                        <td>Erase all data, unreversable.</td>
                        <td><button class="btn btn-primary m-2" @click="deletingSave = true;">Erase It</button></td>
                    </tr>
                    <tr v-if="deletingSave">
                        <td colspan="100">Really do it?
                        Unreversable! No going back!</td>
                    </tr>
                    <tr v-if="deletingSave">
                        <td colspan="100"><button class="btn btn-danger m-2" @click="$parent.deleteSave()">Let's gooo</button></td>
                    </tr>
                    <tr v-if="deletingSave">
                        <td colspan="100"><button class="btn btn-primary m-2" @click="deletingSave = false;">Wait I don't wanna do that</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    
    `
  }
