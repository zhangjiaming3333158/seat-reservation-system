<template>
  <div class="user-container">
    <div class="top-card"><h3>车次管理列表</h3></div>
    <div class="body-card">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <div class="mid-container">
              <h3>中间站点信息</h3>
              <el-table :data="props.row.family">
                <el-table-column label="中间站点名称" prop="name" />
                <el-table-column label="中间站点停留时间" prop="state" />
                <el-table-column label="二等座" prop="second" />
                <el-table-column label="一等座" prop="first" />
                <el-table-column label="商务座" prop="bussiness" />
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="车次名称" />
        <el-table-column prop="startTime" label="出发时间" />
        <el-table-column prop="pass" label="中间站点">
          <template #default="scope">
            <el-tag
              v-for="i in scope.row.pass"
              :key="i"
              style="margin-right: 10px"
              >{{ i }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="到达时间" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="warning">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
const tableData = [
  {
    name: 'G1',
    startTime: '8:00',
    pass: ['xx站', 'xx站', 'xx站'],
    endTime: '10:00',
    family: [
      {
        name: 'xx站',
        state: '10min',
        second: '100',
        first: '100',
        bussiness: '100',
      },
      {
        name: 'xx站',
        state: '10min',
        second: '100',
        first: '100',
        bussiness: '100',
      },
      {
        name: 'xx站',
        state: '10min',
        second: '100',
        first: '100',
        bussiness: '100',
      },
    ],
  },
  {
    name: 'G1',
    startTime: '8:00',
    pass: ['xx站', 'xx站', 'xx站'],
    endTime: '10:00',
  },
  {
    name: 'G1',
    startTime: '8:00',
    pass: ['xx站', 'xx站', 'xx站'],
    endTime: '10:00',
  },
  {
    name: 'G1',
    startTime: '8:00',
    pass: ['xx站', 'xx站', 'xx站'],
    endTime: '10:00',
  },
]
</script>

<style scoped lang="scss">
.user-container {
  box-sizing: border-box;
  padding: 20px;
  .top-card {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .body-card {
    margin-top: 20px;
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    .mid-container {
      box-sizing: border-box;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      h3 {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
