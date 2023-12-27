<script lang="ts" setup>
import { onMounted, ref, triggerRef, nextTick } from 'vue'
import moment from 'moment'
import {
  getTrainListApi,
  getTrainIndirectListApi,
  getTrainApi,
} from '@/api/train'
import * as echarts from 'echarts'

interface ListItem {
  value: string
  label: string
}

interface Train {
  state: string
  beginSite: string
  beginTime: string
  businessClass: number
  businessPrice: number
  endSite: string
  endTime: string
  firstClass: number
  firstPrice: number
  id: number
  secondClass: number
  secondPrice: number
  standingClass: number
  standingPrice: number
  trainNumber: string
}

// 查询车票
const searchTrain = async () => {
  showTable.value = true
  try {
    let dateValue = moment(date.value).format('YYYY-MM-DD').toString()
    const res: any = await getTrainListApi(
      value1.value,
      value2.value,
      dateValue,
    )

    tableData.value = res.data.data
    tableData.value.forEach((item: Train) => {
      // 计算中间站点停留时间
      const beginTime: any = new Date(item.beginTime)
      const endTime: any = new Date(item.endTime)
      // 计算时间差值（单位：毫秒）
      const timeDifference = endTime - beginTime
      // 将毫秒转换为小时和分钟
      const hours = Math.floor(timeDifference / (1000 * 60 * 60))
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
      )
      item.state = hours + '小时' + minutes + '分钟'

      item.beginTime = moment(item.beginTime).format('HH:mm')
      item.endTime = moment(item.endTime).format('HH:mm')
      if (item.endTime < item.beginTime) {
        item.endTime = '次日' + item.endTime
      }
    })
  } catch (error) {
    console.error('Error fetching train data:', error)
  }
}

// 高级查询
const searchIndirectTrain = async () => {
  showTable.value = false

  value1.value = ['杭州']
  value2.value = ['广州']

  let dateValue = moment(date.value).format('YYYY-MM-DD').toString()
  const res: any = await getTrainIndirectListApi(
    value1.value,
    value2.value,
    dateValue,
  )
  tableIndirectData.value = res.data.data

  // 处理时间
  tableIndirectData.value.forEach((item: any) => {
    item.forEach((i: any) => {
      // 计算中间站点停留时间
      const beginTime: any = new Date(i.beginTime)
      const endTime: any = new Date(i.endTime)
      // 计算时间差值（单位：毫秒）
      const timeDifference = endTime - beginTime
      // 将毫秒转换为小时和分钟
      const hours = Math.floor(timeDifference / (1000 * 60 * 60))
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
      )
      i.state = hours + '小时' + minutes + '分钟'

      i.beginTime = moment(i.beginTime).format('HH:mm')
      i.endTime = moment(i.endTime).format('HH:mm')
      if (i.endTime < i.beginTime) {
        i.endTime = '次日' + i.endTime
      }
    })
  })

  console.log(res.data.data)
}

const showTable = ref(true)
const list = ref<ListItem[]>([])
const options = ref<ListItem[]>([])
const value1 = ref<string[]>([])
const value2 = ref<string[]>([])
const loading = ref(false)
const date = ref('')
let states: any = [] //站点数据
let tableData = ref<Train[]>([]) //直达车票数据
let tableIndirectData = ref([]) //中转车票数据
let showListOrChart = ref(true) //是否显示列表
let sitedata: any = [] // 图表站点数据
let sitelinks: any = [] // 图表连接数据

// tableIndirectData = [
//   [
//     {
//       id: 5,
//       trainNumber: 'L123',
//       beginSite: '杭州',
//       endSite: '衡阳',
//       beginTime: '2023-12-30T10:54:00.000+00:00',
//       endTime: '2023-12-30T21:00:00.000+00:00',
//       businessClass: 1,
//       businessPrice: 636,
//       firstClass: 19,
//       firstPrice: 313,
//       secondClass: 21,
//       secondPrice: 111,
//       standingClass: 1,
//       standingPrice: 61,
//     },
//     {
//       id: 6,
//       trainNumber: 'L399',
//       beginSite: '衡阳',
//       endSite: '广州',
//       beginTime: '2023-12-30T21:05:00.000+00:00',
//       endTime: '2023-12-31T06:00:00.000+00:00',
//       businessClass: 3,
//       businessPrice: 699,
//       firstClass: 6,
//       firstPrice: 563,
//       secondClass: 3,
//       secondPrice: 331,
//       standingClass: 9,
//       standingPrice: 63,
//     },
//   ],
//   [
//     {
//       id: 3,
//       trainNumber: 'H999',
//       beginSite: '杭州',
//       endSite: '长沙',
//       beginTime: '2023-12-30T10:00:00.000+00:00',
//       endTime: '2023-12-30T19:00:00.000+00:00',
//       businessClass: 6,
//       businessPrice: 666,
//       firstClass: 11,
//       firstPrice: 369,
//       secondClass: 32,
//       secondPrice: 123,
//       standingClass: 9,
//       standingPrice: 66,
//     },
//     {
//       id: 4,
//       trainNumber: 'H999',
//       beginSite: '长沙',
//       endSite: '广州',
//       beginTime: '2023-12-30T19:20:00.000+00:00',
//       endTime: '2023-12-30T23:50:00.000+00:00',
//       businessClass: 11,
//       businessPrice: 888,
//       firstClass: 33,
//       firstPrice: 636,
//       secondClass: 16,
//       secondPrice: 396,
//       standingClass: 3,
//       standingPrice: 93,
//     },
//   ],
// ]

onMounted(() => {
  getTrain()
})

// 远程搜索
const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = list.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}

// 交换出发地和目的地
const exchangeSite = () => {
  let temp = value1.value
  value1.value = value2.value
  value2.value = temp
  triggerRef(value1)
  triggerRef(value2)
}

// 获取全部站点
const getTrain = async () => {
  try {
    const res: any = await getTrainApi()
    states = res.data.data
    list.value = states.map((item: any) => {
      return { value: `${item}`, label: `${item}` }
    })
    console.log(states)
  } catch (error) {
    console.error(error)
  }
}

//计算图片date数据和links数据
const computeChartDate = () => {
  console.log(tableIndirectData);
  sitedata = tableIndirectData.value
    .flat()
    .map((item) => [{ name: item.beginSite }, { name: item.endSite }])
    .flat()
    .filter(
      (value, index, self) =>
        self.findIndex((item) => item.name === value.name) === index,
    )

  // 生成连接列表
  sitelinks = tableIndirectData.value.flat().map((item) => ({
    source: item.beginSite,
    target: item.endSite,
    value: 1,
  }))
}

// 图表
const initChart = () => {
  showListOrChart.value = false
  computeChartDate()
  nextTick(() => {
    var chartDom = document.getElementById('main')
    var myChart = echarts.init(chartDom)
    var option
    option = {
      series: {
        type: 'sankey',
        layout: 'none',
        emphasis: {
          focus: 'adjacency',
        },
        lineStyle: {
          color: 'gradient',
          curveness: 0.5,
        },
        data: sitedata,
        links: sitelinks,
      },
    }
    option && myChart.setOption(option)
  })
}
</script>

<template>
  <div class="dashboard-container">
    <div class="top-card">
      <div class="input-slide">
        <div class="before"></div>
        <div class="start">
          <p>出发地址</p>
          <el-select
            v-model="value1"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="输入出发地址"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="icon" @click="exchangeSite">
          <el-icon :size="30"><Switch /></el-icon>
        </div>
        <div class="end">
          <p>目的地址</p>
          <el-select
            v-model="value2"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="输入出发地址"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="date">
          <p>出发时间</p>
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </div>
      </div>
      <div class="button-slide">
        <div class="before"></div>
        <div class="button">
          <el-button type="primary" size="large" @click="searchTrain"
            >查询车票</el-button
          >
        </div>
        <p class="gaoji" @click="searchIndirectTrain">高级查询</p>
      </div>
    </div>
    <div class="body-card" v-if="showTable">
      <div class="title">
        <div class="zhida active">直达</div>
      </div>
      <el-divider />
      <el-table :data="tableData" style="width: 100%" lazy>
        <el-table-column label="车次" width="70">
          <template #default="scope">
            <span>{{ scope.row.trainNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出发站" width="70" prop="beginSite">
        </el-table-column>
        <el-table-column label="到达站" width="70" prop="endSite">
        </el-table-column>
        <el-table-column label="出发时间" width="120" prop="beginTime" sortable>
        </el-table-column>
        <el-table-column label="到达时间" width="120" prop="endTime" sortable>
        </el-table-column>
        <el-table-column label="历时" width="100" prop="state" sortable>
        </el-table-column>
        <el-table-column label="站票" sortable>
          <template #default="scope">
            <div>
              <el-tag>剩余{{ scope.row.standingClass }}票</el-tag>
            </div>
            <div>价格:{{ scope.row.standingPrice }}</div>
          </template>
        </el-table-column>
        <el-table-column label="二等座" sortable>
          <template #default="scope">
            <div>
              <el-tag>剩余{{ scope.row.secondClass }}票</el-tag>
            </div>
            <div>价格:{{ scope.row.secondPrice }}</div>
          </template>
        </el-table-column>
        <el-table-column label="一等座" prop="last" sortable>
          <template #default="scope">
            <div>
              <el-tag>剩余{{ scope.row.firstClass }}票</el-tag>
            </div>
            <div>价格:{{ scope.row.firstPrice }}</div>
          </template>
        </el-table-column>
        <el-table-column label="商务座" prop="last" sortable>
          <template #default="scope">
            <div>
              <el-tag>剩余{{ scope.row.businessClass }}票</el-tag>
            </div>
            <div>价格:{{ scope.row.businessPrice }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Operations">
          <template #default="scope">
            <el-button type="primary">预定</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="body-card" v-else>
      <div class="title">
        <div class="tabs">
          <el-button class="title" @click="showListOrChart = true">
            <el-icon class="icon"><List /></el-icon><span>列表</span>
          </el-button>
          <el-button class="title" @click="initChart">
            <el-icon class="icon"><Picture /></el-icon><span>图表</span>
          </el-button>
        </div>
        <div class="zhida active">中转</div>
      </div>
      <el-divider />
      <el-table
        v-if="showListOrChart"
        :data="tableIndirectData"
        stripe
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template #default="props">
            <div m="4">
              <h3>中间站点信息</h3>
              <el-table :data="props.row">
                <el-table-column label="车次" prop="trainNumber" width="100">
                </el-table-column>
                <el-table-column label="中间站点名称">
                  <template #default="scope">
                    <el-tag style="margin-right: 10px">{{
                      scope.row.beginSite
                    }}</el-tag
                    >->
                    <el-tag style="margin-right: 10px">{{
                      scope.row.endSite
                    }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="中间站点停留时间" prop="state" />
                <el-table-column label="二等座" prop="second">
                  <template #default="scope">
                    <div>
                      <el-tag>剩余{{ scope.row.secondClass }}票</el-tag>
                    </div>
                    <div>价格:{{ scope.row.secondPrice }}元</div>
                  </template>
                </el-table-column>
                <el-table-column label="一等座" prop="first">
                  <template #default="scope">
                    <div>
                      <el-tag>剩余{{ scope.row.firstClass }}票</el-tag>
                    </div>
                    <div>价格:{{ scope.row.firstPrice }}元</div>
                  </template>
                </el-table-column>
                <el-table-column label="商务座" prop="bussiness">
                  <template #default="scope">
                    <div>
                      <el-tag>剩余{{ scope.row.businessClass }}票</el-tag>
                    </div>
                    <div>价格:{{ scope.row.businessPrice }}元</div>
                  </template>
                </el-table-column>
                <el-table-column label="站座" prop="bussiness">
                  <template #default="scope">
                    <div>
                      <el-tag>剩余{{ scope.row.standingClass }}票</el-tag>
                    </div>
                    <div>价格:{{ scope.row.standingPrice }}元</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="车次名称">
          <template #default="scope">
            <el-tag
              v-for="i in scope.row"
              :key="i"
              style="margin-right: 10px"
              >{{ i.trainNumber }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="出发时间">
          <template #default="scope">
            <el-tag
              v-for="i in scope.row"
              :key="i"
              style="margin-right: 10px"
              >{{ i.beginTime }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="pass" label="中间站点">
          <template #default="scope">
            <el-tag v-for="i in scope.row" :key="i" style="margin-right: 10px"
              >{{ i.beginSite }}->{{ i.endSite }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="到达时间">
          <template #default="scope">
            <el-tag
              v-for="i in scope.row"
              :key="i"
              style="margin-right: 10px"
              >{{ i.endTime }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="primary">预定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-else id="main"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  box-sizing: border-box;
  padding: 20px;
  .top-card {
    box-sizing: border-box;
    padding: 20px;
    // display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    .input-slide {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      .start,
      .end {
        flex: 1;
        width: 200px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        p {
          margin-bottom: 10px;
        }
      }
      .before,
      .date {
        width: 200px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        p {
          margin-bottom: 10px;
        }
      }
      .icon {
        box-sizing: border-box;
        padding: 5px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #000;
        border-radius: 50%;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .button-slide {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .before,
      p,
      .button {
        width: 200px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      p {
        cursor: pointer;
        margin-left: 10px;
        color: #409eff;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .body-card {
    margin-top: 20px;
    box-sizing: border-box;
    padding: 20px 20px 20px 20px;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    .title {
      position: relative;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 35px;
      .tabs {
        position: absolute;
        display: flex;
        left: 0;
        top: 0;
        width: 100%;
        height: 40px;
        .el-button {
          height: 100%;
        }
      }
      .zhida {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-size: 20px;
        font-weight: bold;
      }
    }
    #main {
      width: 100%;
      height: 500px;
    }
  }
}
</style>
