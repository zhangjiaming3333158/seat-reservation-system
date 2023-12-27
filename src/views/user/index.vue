<template>
  <div class="user-container">
    <div class="top-card"><h3>用户管理列表</h3></div>
    <div class="body-card">
      <div class="addUser">
        <el-button type="primary" :icon="Plus" @click="addUser"
          >添加用户</el-button
        >
      </div>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="注册日期" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="password" label="密码" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="warning" @click="editUser(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialog">
      <el-dialog v-model="dialogFormVisible" title="编辑用户信息">
        <el-form :model="form">
          <el-form-item label="注册日期" :label-width="formLabelWidth">
            <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const form = reactive({
  username: '',
  password: '',
  date: '',
})
const tableData = [
  {
    date: '2016-05-03',
    username: 'Tom',
    password: '123456',
  },
  {
    date: '2016-05-02',
    username: 'Tom',
    password: '123456',
  },
  {
    date: '2016-05-04',
    username: 'Tom',
    password: '123456',
  },
  {
    date: '2016-05-01',
    username: 'Tom',
    password: '123456',
  },
]

const editUser = (data: any) => {
  dialogFormVisible.value = true
  form.username = data.username
  form.password = data.password
  form.date = data.date
}

const addUser = () => {
  form.username = ''
  form.password = ''
  form.date = ''
  dialogFormVisible.value = true
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
    margin-top: 20px;
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .body-card {
    .addUser {
      margin: 20px 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
    }
    margin-top: 20px;
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
}
</style>
