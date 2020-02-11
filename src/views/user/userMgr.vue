<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
        <!-- 查询和其他操作 -->
        <div class="filter-container">
          <el-input
            v-model="searchCondition.keyword"
            clearable
            size="small"
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入搜索关键字"
          />
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleFind"
          >查找</el-button>
          <el-button
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleAdd"
          >添加</el-button>
        </div>

        <el-table v-loading="loading" :data="tableData" style="width: 100%" size="mini">
          <el-table-column label="序号" width="60" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>

          <el-table-column label="账号" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.operAccount }}</span>
            </template>
          </el-table-column>

          <el-table-column label="姓名" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.operName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="性别" width="70" align="center">
            <template slot-scope="scope">
              <div>{{ sexChange(scope.row.sex) }}</div>
            </template>
          </el-table-column>

          <el-table-column label="手机号" width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="70" align="center">
            <template slot-scope="scope">
              <div>{{ statusChange(scope.row.status) }}</div>
            </template>
          </el-table-column>

          <el-table-column label="最后登录IP" width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.lastLoginIp }}</span>
            </template>
          </el-table-column>

          <el-table-column label="最后登录时间" width="160" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.lastLoginTime }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="120" align="center">
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">查看详情</el-button>
              <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <div class="block">
          <el-pagination
            :current-page.sync="searchCondition.page"
            :page-size="searchCondition.pagesize"
            layout="total, prev, pager, next, jumper"
            :total="searchCondition.total"
            @current-change="handleCurrentChange"
          />
        </div>

        <!-- 添加或修改对话框 -->
        <el-dialog :title="operation?'新增用户':'编辑用户'" :visible.sync="dialogFormVisible" center>
          <el-form
            :model="dataForm"
            :rules="rules2"
            label-width="80px"
            size="small"
            label-position="right"
          >
            <el-form-item label="姓名" prop="username" required>
              <el-input v-model="dataForm.username" auto-complete="off" placeholder="请输入姓名" />
            </el-form-item>

            <el-form-item label="账号" prop="account" required>
              <el-input v-model="dataForm.account" auto-complete="off" placeholder="请输入账号" />
            </el-form-item>

            <el-form-item label="密码" prop="pass" required>
              <el-input v-model="dataForm.pass" auto-complete="off" placeholder="请输入密码" />
            </el-form-item>

            <el-form-item label="角色" prop="role" required>
              <el-select v-model="dataForm.role" multiple placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="状态" prop="status" required>
              <el-radio-group v-model="dataForm.radio">
                <el-radio :label="0">正常</el-radio>
                <el-radio :label="1">停用</el-radio>
                <el-radio :label="2">锁定</el-radio>
                <el-radio :label="99">注销</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDate } from "@/utils/common";
import PopupTreeInput from "@/components/PopupTreeInput";
import { findUserList } from "@/api/user";

export default {
  components: {},
  data() {
    return {
      // 搜索条件
      searchCondition: {
        keyword: "",
        page: 1,
        pagesize: 10,
        total: 0
      },

      loading: true,

      // 用户列表
      tableData: [],

      dialogFormVisible: false, // 控制弹出框

      dataForm: {
        username: "",
        account: "",
        pass: "",
        role: "",
        status: 0
      }
    };
  },

  computed: {
    ...mapGetters(["dict"])
  },

  created() {
    this.findUserList();
  },

  methods: {
    sexChange: function(val) {
      return JSON.parse(this.$store.getters.dict.SEX_LIST)[val];
    },

    statusChange: function(val) {
      return JSON.parse(this.$store.getters.dict.STATUS_LIST)["status-" + val];
    },

    // 查询筛选
    handleFind: function() {
      this.findUserList();
    },

    handleCurrentChange: function() {},

    // 添加弹框
    handleAdd: function() {
      this.dialogFormVisible = true;
      this.operation = true;
      this.dataForm = {
        username: "",
        deptId: 1,
        deptName: "",
        jobId: "",
        email: "",
        phone: "",
        lockFlag: "" + 0,
        roleList: []
      };
    },

    // 查找用户列表
    findUserList: function() {
      this.$data.loading = true;

      listUsers(this.$data.searchCondition).then(res => {
        this.$data.loading = false;
        this.$data.searchCondition.page = res.data.data.page;
        this.$data.searchCondition.pagesize = res.data.data.pageSize;
        this.$data.searchCondition.total = res.data.data.total;
        this.$data.tableData = res.data.data.records;
      });
    }
  }
};
</script>

<style scoped>
</style>
