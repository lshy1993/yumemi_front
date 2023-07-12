<template>
  <main>
    <h1 class="mainTitle">都道府県別の総人口推移グラフ</h1>
    <PrefectureSelector :prefList="prefList" @prefChanged="redrawPrefecture" />
    <div class="gapLine"></div>
    <h3 class="wrapBox">
      <div class="typeRadio" v-for="i in 4" :key="'rbox' + i">
        <input type="radio" v-model="chartType" :id="'radbtn' + i" :value="i" @change="changeChartType">
        <label :for="'radbtn' + i">{{ btnName[i - 1] }}</label>
      </div>
    </h3>
    <highcharts ref="mainchart" :options="chartOptions" :redrawOnUpdate="true" :oneToOneUpdate="false"
      :animateOnUpdate="true" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ResasDataService from '../api';
import chartOptions from '../chartopt';
import PrefectureSelector from '../components/PrefectureSelector.vue';
interface PrefectureData {
  prefName: string,
  prefCode: number,
  checked: boolean
}
export default defineComponent({
  name: "HomeView",
  data() {
    return {
      prefList: Array<PrefectureData>,
      btnName: ["総人口", "年少人口", "生産年齢人口", "老年人口"],
      chartType: 1,
      chartCache: {},
      chartOptions
    }
  },
  mounted() {
    this.initPrefcture();
  },
  methods: {
    initPrefcture() {
      ResasDataService.getPrefecture()
        .then(response => {
          this.prefList = response.data.result;
          this.prefList.forEach(element => {
            element.checked = false;
          });
        })
        .catch(error => console.log(error));
    },
    redrawPrefecture(index: number, code: number) {
      let prefname = this.prefList[String(index)].prefName;
      if (this.prefList[String(index)].checked) {
        // request data
        ResasDataService.getPolulation(code)
          .then(response => {
            let fulldb = response.data.result.data;
            // make cache
            let count = this.$refs.mainchart.chart.series.length;
            this.chartCache[prefname] = { show: true, data: fulldb, seriesID: count };
            // show only 1 data
            let dataframe = this.createDataFrame(prefname, fulldb[this.chartType - 1].data);
            // redraw add new line
            this.$refs.mainchart.chart.addSeries(dataframe);
          })
          .catch(error => console.log(error));
      } else {
        // delete line
        this.chartCache[prefname].show = false;
        let id = this.chartCache[prefname].seriesID;
        this.$refs.mainchart.chart.series[id].remove();
        // UPDATE other seriesID!!
        this.updateChartCache(id);
      }
    },
    createDataFrame(prefn: string, data: Array<{ year: number, value: number }>) {
      let df = { name: prefn, data: [] };
      data.forEach(element => {
        df.data.push([element.year, element.value]);
      });
      return df;
    },
    updateChartCache(id: number) {
      Object.keys(this.chartCache).forEach(key => {
        let element = this.chartCache[key];
        if (element.seriesID > id) {
          element.seriesID--;
        }
      });
    },
    changeChartType() {
      // change all dataseries
      Object.keys(this.chartCache).forEach(key => {
        let element = this.chartCache[key];
        if (element.show) {
          let fulldb = element.data;
          let dataframe = this.createDataFrame(key, fulldb[this.chartType - 1].data);
          // redraw
          this.$refs.mainchart.chart.series[element.seriesID].setData(dataframe.data);
        }
      });
    }
  },
  components: {
    PrefectureSelector
  }
})

</script>
<style>
.mainTitle {
  text-align: center;
  padding: 10px;
}

.typeRadio {
  display: inline-block;
  margin: 2px 5px;
}

.gapLine {
  padding: 5px 0;
  background-color: gray;
}
</style>