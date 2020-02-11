<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
        <!-- 查询和其他操作 -->
        <div class="filter-container" style="margin: 10px 0 10px 0;">
          <el-input
            v-model="searchCondition.keywords"
            clearable
            class="filter-item"
            style="width: 200px;"
            size="small"
            placeholder="请输入角色名称"
            @keyup.enter.native="handleFind"
          />
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="handleFind"
          >查找</el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >添加角色</el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="danger"
            @click="handleBatchDelete"
          >批量删除</el-button>
        </div>

        <el-table v-loading="loading" :data="tableData" style="width: 100%" size="mini" 
        @selection-change="handleSelectionChange">
          <el-table-column type="selection" />
          <el-table-column label="序号" width="60" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>

          <el-table-column label="角色名称" width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="角色标识" width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.code }}</span>
            </template>
          </el-table-column>

          <el-table-column label="角色介绍" width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" width="160" align="center" prop="createTime">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="150" align="center">
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="handleDelete(scope.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <div class="block">
          <el-pagination
            :current-page.sync="searchCondition.pageNum"
            :page-size="searchCondition.pagesize"
            layout="total, prev, pager, next, jumper"
            :total="searchCondition.total"
            @current-change="handleCurrentChange"
          />
        </div>

        <!-- 添加或修改对话框 -->
        <el-dialog
          :title="operation?'新增角色':'编辑角色'"
          :visible.sync="dialogFormVisible"
          v-if="dialogFormVisible"
          width="30%"
          center
          @close="handleDialogClose"
        >
          <el-form
            ref="form"
            :model="form"
            :rules="dataRule"
            label-width="80px"
            size="small"
            v-loading="dialogLoading"
            label-position="right"
          >
            <el-form-item label="角色名字" prop="name">
              <el-input v-model="form.name" auto-complete="off" placeholder="请输入角色名字" />
            </el-form-item>

            <el-form-item label="角色标识" prop="code">
              <el-input v-model="form.code" auto-complete="off" placeholder="请输入角色标识" />
            </el-form-item>

            <el-form-item label="角色介绍" prop="remark">
              <el-input v-model="form.remark" auto-complete="off" />
            </el-form-item>

            <el-form-item label="访问菜单">
              <el-tree
                ref="menuTree"
                :data="menuData"
                size="mini"
                show-checkbox
                node-key="id"
                :default-expanded-keys="defaultExpandKeys"
                :props="defaultProps"                
                element-loading-text="拼命加载中"
              />

              <div style="padding-left:24px;padding-top:12px;">
                <el-checkbox v-model="checkAll" :disabled="false" @change="handleCheckAll">
                  <b>全选</b>
                </el-checkbox>
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleDialogClose">取 消</el-button>
            <el-button type="primary" :loading="dialogLoading" @click="submitForm">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Notification } from 'element-ui'
import { listRouters } from '@/api/user'
import { listRoles, insertRole, updateRole, deleteRole, listMenusByRoleId } from "@/api/role";

export default {
  components: {},

  computed: {
    ...mapGetters([
      'permission_route'
    ]),
  },

  data() {
    return {

      // ==> 角色列表
      loading: true,

      // 搜索条件
      searchCondition: {
        keywords: "",
        pageNum: 1,
        pagesize: 10,
        total: 0
      },  

      // 角色数据
      tableData: [],

      // ==> 新增角色&修改角色
      selectRole: {},

      checkAll: false,

      // 弹框
      dialogFormVisible: false,
      dialogLoading: true,

      // 菜单列表
      menuData: [],

      // 添加角色
      operation: false,

      form: {
        name: "",
        code: "",
        remark: "",
        permissIds: []
      },

      // 表单校验
      dataRule: {
        name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
        code: [{ required: true, message: "角色标识不能为空", trigger: "blur" }]
      },

      // tree配置项
      defaultProps: {
        children: 'children',
        label: function(a, b) {

          if (a.meta) {
            return a.meta.title
          }
          
        }
      },

      // 展开和选中的Keys
      defaultExpandKeys: [],

      // 表格选中的值
      tableSelectIds: []
    };
  },

  created() {
    this.findTreeData();
    this.findRoleList();
  },

  methods: {

    // 添加角色
    handleAdd: function() {
      this.dialogFormVisible = true
      this.dialogLoading = false
      this.operation = true
      this.isEditForm = false
      this.form = {
        name: "",
        code: "",
        remark: "",
        permissIds: []
      }
    },

    // 编辑角色
    handleEdit: function(row) {
      this.dialogFormVisible = true
      this.isEditForm = true
      this.operation = false
      this.form = {
        name: row.name,
        code: row.code,
        remark: row.remark,
        permissIds: []
      }
      this.selectRole.id = row.id

      listMenusByRoleId(row.id).then(res=>{
        let keys = []
        for(let i = 0; i < res.data.data.length; i++) {
          let menuId = res.data.data[i].menuId
          if (res.data.data[i].parentId != '0') {
            keys.push(menuId)
          }
          
          this.$set(this.defaultExpandKeys, i, menuId)
        }

        this.$refs.menuTree.setCheckedKeys(keys)
        this.dialogLoading = false
      })
    },

    // 全选操作
    handleCheckAll() {
      if (this.checkAll) {
        const allMenus = []
        this.checkAllMenu(this.menuData, allMenus)
        this.$refs.menuTree.setCheckedNodes(allMenus)
      } else {
        this.$refs.menuTree.setCheckedNodes([])
      }
    },

    // 筛选
    handleFind: function() {
      this.findRoleList()
    },

    // 分页
    handleCurrentChange: function() {
      this.findRoleList();
    },

    // 关闭Dialog
    handleDialogClose: function() {
      this.dialogLoading = true
      this.dialogFormVisible = false
      this.$refs.menuTree.setCheckedKeys([])
      this.$data.defaultExpandKeys = []
    },

    // 表格选中的值
    handleSelectionChange:function(val) {
      this.tableSelectIds = []
      for(let i = 0; i < val.length; i++) {
        this.tableSelectIds.push(val[i].id)
      }
    },

    // 批量删除
    handleBatchDelete: function() {
      if (0 >= this.tableSelectIds.length) {
        return;
      }

      this.handleDelete(this.tableSelectIds)
    },

    // 删除
    handleDelete: function(ids) {
      this.$confirm('此操作将把角色删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = [];
          params = params.concat(ids)
          deleteRole(params).then(res => {
            if (res.data.code === '0') {
              Notification.success({
                title: '操作成功'
              })
              
              this.findRoleList();
            }            
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 递归全选
    checkAllMenu(menuData, allMenus) {
      menuData.forEach(menu => {
        allMenus.push(menu)
        if (menu.children) {
          this.checkAllMenu(menu.children, allMenus)
        }
      })
    },

    // 查找角色列表
    findRoleList: function() {
      this.$data.loading = true;

      listRoles(this.$data.searchCondition).then(res => {
        this.$data.loading = false;
        this.$data.searchCondition.pageNum = res.data.data.pageNum;
        this.$data.searchCondition.pagesize = res.data.data.pageSize;
        this.$data.searchCondition.total = res.data.data.total;
        this.$data.tableData = res.data.data.list;
      });
    },

    // 查找菜单数据
    findTreeData: function() {
      listRouters().then(res=>{
        this.$data.menuData = res.data.data
      })
    },

    // 提交表单(新增角色&修改角色)
    submitForm: function() {
      const roleId = this.selectRole.id > 0 ? this.selectRole.id : 0
      const checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true)
      const permisses = []
      for (let i = 0, len = checkedNodes.length; i < len; i++) {
        permisses.push(checkedNodes[i].meta.permiss)
      }

      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return;
        }

        this.form.permissIds = permisses
        this.dialogLoading = true

        if (!this.isEditForm) {
          insertRole(this.form).then(res => {
            if (res.data.code === '0') {
              Notification.success({
                title: '操作成功'
              })
              
              this.findRoleList();
              this.handleDialogClose()
            } else {
              this.dialogLoading = false
            }  
          })
        } else {
          updateRole(roleId, this.form).then(res => {
            if (res.data.code === '0') {
              Notification.success({
                title: '操作成功'
              })
              
              this.findRoleList();
              this.handleDialogClose()
            } else {
              this.dialogLoading = false
            }
          })
        }
      })
    }
  }
};
</script>
