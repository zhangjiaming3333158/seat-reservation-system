<template>
  <div class="user-container">
    <div class="top-card"><h3>站点管理列表</h3></div>
    <div class="body-card">
      <div class="addStation">
        <el-button type="primary" :icon="Plus" @click="addStation"
          >添加站点</el-button
        >
        <div class="tabs">
          <el-button class="title" @click="showListOrChart = true">
            <el-icon class="icon"><List /></el-icon><span>列表</span>
          </el-button>
          <el-button class="title" @click="initChart">
            <el-icon class="icon"><Picture /></el-icon><span>图表</span>
          </el-button>
        </div>
      </div>
      <el-divider />
      <el-table
        v-if="showListOrChart"
        :data="tableData"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="beginSite" label="出发站" />
        <el-table-column prop="endSite" label="到达站" />
        <el-table-column prop="distance" label="站点距离" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="warning" @click="editStation(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确认删除吗？"
              @confirm="deleteStation(scope.row)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div v-else id="main"></div>
      <div
        v-show="showListOrChart"
        style="display: flex; justify-content: center; margin-top: 20px"
      >
        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :total="10"
        />
      </div>
    </div>
    <div class="dialog">
      <el-dialog v-model="dialogFormVisible" title="编辑用户信息">
        <el-form :model="form">
          <el-form-item label="id:" :label-width="formLabelWidth">
            {{ form.id }}
          </el-form-item>
          <el-form-item label="出发站" :label-width="formLabelWidth">
            <el-select v-model="form.beginSite" placeholder="选择出发站">
              <el-option v-for="i in stations" :key="i" :label="i" :value="i" />
            </el-select>
          </el-form-item>
          <el-form-item label="到达站" :label-width="formLabelWidth">
            <el-select v-model="form.endSite" placeholder="选择到达站">
              <el-option v-for="i in stations" :key="i" :label="i" :value="i" />
            </el-select>
          </el-form-item>
          <el-form-item label="站点距离" :label-width="formLabelWidth">
            <el-input v-model="form.distance" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="confirm"> 确认 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { reactive, ref, onMounted, nextTick } from 'vue'
import {
  getSiteApi,
  addSiteApi,
  deleteSiteApi,
  updateSiteApi,
  getGraphSites,
} from '@/api/site'
import { getTrainApi } from '@/api/train'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

interface TableData {
  id: string
  beginSite: string
  endSite: string
  distance: string
}

let page = 1
// 全部站点
let stations = ref([])
const tableData = ref<TableData[]>([])
let showListOrChart = ref(true) //true为列表，false为图表
let chartData = ref<any>({
  nodes: [],
  links: [],
  categories: [],
})

onMounted(() => {
  getSite() //获取站点数据
  getTrain() //获取全部站点
  // initChart()
  getAllGraphSites()
})

//chart
const initChart = () => {
  showListOrChart.value = false
  console.log(chartData.value.nodes)
  nextTick(() => {
    var chartDom = document.getElementById('main')
    var myChart = echarts.init(chartDom)
    var option: any

    myChart.hideLoading()

    chartData.value.nodes.forEach(function (node: any) {
      node.label = {
        show: true,
      }
    })
    option = {
      tooltip: {},
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          name: 'Les Miserables',
          type: 'graph',
          layout: 'none',
          data: chartData.value.nodes,
          links: chartData.value.links,
          categories: chartData.value.categories,
          roam: true,
          label: {
            position: 'right',
            formatter: '{b}',
          },
          lineStyle: {
            color: 'source',
            curveness: 0.3,
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 10,
            },
          },
        },
      ],
    }
    myChart.setOption(option)

    option && myChart.setOption(option)
  })
}

//接口获取site数据
const getSite = async () => {
  const res: any = await getSiteApi(page)
  console.log(res.data.data)
  tableData.value = res.data.data
}
//接口编辑site数据
const updateSite = async () => {
  const res: any = await updateSiteApi(form)
  if (res.data.code == 1200) {
    ElMessage.success(res.data.message)
  } else {
    ElMessage.error(res.data.message)
  }
}
//接口添加site数据
const addSite = async () => {
  const res: any = await addSiteApi(form)
  if (res.data.code == 1200) {
    ElMessage.success(res.data.message)
  } else {
    ElMessage.error(res.data.message)
  }
}
//接口删除site数据
const deleteSite = async (data: any) => {
  const res: any = await deleteSiteApi(data)
  if (res.data.code == 1200) {
    ElMessage.success(res.data.message)
  } else {
    ElMessage.error(res.data.message)
  }
}
//接口获取全部站点
const getTrain = async () => {
  try {
    const res: any = await getTrainApi()
    stations = res.data.data
    console.log(stations)
  } catch (error) {
    console.error(error)
  }
}
//接口获取全部站点信息
const getAllGraphSites = async () => {
  try {
    const res: any = await getGraphSites()
    let rawData = res.data.data
    const cityToCategory = {}
    const cityCoordinates = {
      南昌: { x: 117.8575 * 5, y: 35.2833 },
      郑州: { x: 117.2249 * 5, y: 29.7472 },
      上海: { x: 121.5439 * 5, y: 32.8683 },
      南京: { x: 120.6994 * 5, y: 30.9943 },
      杭州: { x: 120.1551 * 5, y: 33.2741 },
      洛阳: { x: 116.4475 * 5, y: 29.6574 },
      成都: { x: 112.5668 * 5, y: 35.5728 },
      西安: { x: 114.9402 * 5, y: 30.3416 },
      长沙: { x: 116.9388 * 5, y: 35.5282 },
      温州: { x: 120.7969 * 5, y: 35.0603 },
      北京: { x: 118.4074 * 5, y: 22.9042 },
      宁波: { x: 121.4737 * 5, y: 34.2304 },
      衡阳: { x: 116.6077 * 5, y: 36.9004 },
      福州: { x: 120.2965 * 5, y: 39.0745 },
      厦门: { x: 119.0894 * 5, y: 40.4798 },
      深圳: { x: 118.0579 * 5, y: 42.5431 },
      广州: { x: 117.2644 * 5, y: 41.1291 },
    }
    const categoryColors = ['#ff5733', '#33ff57', '#5733ff', '#ffff33', '#33ffff', '#ff33ff', '#888888', '#555555', '#aaaaaa', '#444444', '#cccccc', '#666666', '#222222', '#999999', '#111111', '#000000'];

    rawData.forEach((pair, index) => {
      pair.forEach((city) => {
        if (!(city in cityToCategory)) {
          const categoryId = Object.keys(cityToCategory).length.toString()
          cityToCategory[city] = categoryId
          const { x, y } = cityCoordinates[city]
          chartData.value.nodes.push({
            id: chartData.value.nodes.length.toString(),
            name: city,
            symbolSize: 20,
            value: 20,
            category: categoryId,
            x,
            y,
          })
        }
      })

      chartData.value.links.push({
        source: cityToCategory[pair[0]],
        target: cityToCategory[pair[1]],
      })
    })

    const uniqueCategories = [...new Set(Object.values(cityToCategory))]
    uniqueCategories.forEach((categoryId, index) => {
      chartData.value.categories.push({
        name: categoryId,
        color: categoryColors[index % categoryColors.length],
      })
    })

    console.log(chartData)
  } catch (error) {
    console.error(error)
  }
}

// dialog
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  id: '',
  beginSite: '',
  endSite: '',
  distance: '',
  state: 0,
})
//编辑按钮
const editStation = (data: any) => {
  dialogFormVisible.value = true
  form.id = data.id
  form.beginSite = data.beginSite
  form.endSite = data.endSite
  form.distance = data.distance
  form.state = 1
}
//添加按钮
const addStation = () => {
  form.id = '自动生成'
  form.beginSite = ''
  form.endSite = ''
  form.distance = ''
  form.state = 2
  dialogFormVisible.value = true
}
//删除按钮
const deleteStation = (data: any) => {
  deleteSite(data)
}
//确认按钮
const confirm = () => {
  dialogFormVisible.value = false
  if (form.state === 1) {
    updateSite()
  } else if (form.state === 2) {
    addSite()
  }
}
</script>

<style scoped lang="scss">
.user-container {
  box-sizing: border-box;
  padding: 20px;
  .top-card {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .body-card {
    margin-top: 10px;
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    .addStation {
      position: relative;
      margin: 20px 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      .tabs {
        position: absolute;
        display: flex;
        right: 0;
        top: 0;
        height: 40px;
        .el-button {
          height: 100%;
        }
      }
    }
    #main {
      width: 100%;
      height: 400px;
    }
  }
}
</style>
