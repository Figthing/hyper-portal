<template>
  <a-drawer
    title="角色权限配置"
    :width="520"
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="visible"
  >
    <a-form :form="form" layout="vertical" hideRequiredMark>
      <a-form-item label="角色名称：">
        <a-input
          v-decorator="['name']" 
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="拥有的权限：">
        <a-tree
          checkable
          @expand="onExpand"
          @check="onCheck"
          :disabled="state.saveBtn"
          :treeData="userPermissionTree"
          :expandedKeys="expandedKeys"
          :checkedKeys="selectedRowKeys"
          :autoExpandParent="autoExpandParent"
        />
      </a-form-item>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button
          :style="{marginRight: '8px'}"
          @click="onClose"
        >
          取消
        </a-button>
        <a-button 
          @click="handleSubmit"
          :loading="state.saveBtn"
          type="primary">
          确认
        </a-button>
      </div>
    </a-form>
  </a-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import lang from '@/lang'
import pick from 'lodash.pick'

export default {
  props: {
    userPermissionTree: {
      type: [Array],
      required: true
    }
  },
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),

      state: {
        saveBtn: false
      },

      // data => 角色数据
      selectedRowKeys: [],
      allSelectedNodes: [],
      expandedKeys: [],
      test: [],
      autoExpandParent: true,
    }
  },

  methods: {
    ...mapActions({
      'ListPermissionByRoleId': 'role/ListPermissionByRoleId',
      'UpdateRolePermission': 'role/UpdateRolePermission',
    }),

    showDrawer() {
      this.visible = true
      this.initForm()
    },

    initForm() {
      const { data: { id, name } } = this

      if (id === undefined) {
        return
      }

      // 获取当前角色权限
      this.ListPermissionByRoleId(id).then(data => {
        const tmp = []
        data.forEach((item) => {
          const { permissionId } = item
          tmp.push(permissionId)
        })

        this.selectedRowKeys = this.compareItem(tmp, this.getTreeChildren(this.userPermissionTree))
        this.expandedKeys = this.selectedRowKeys
      })

      this.$nextTick(() => {
        this.form.setFieldsValue({
          name: name
        })
      })
    },

    onClose() {
      this.visible = false
      this.$data.expandedKeys  = []
      this.$data.allSelectedNodes  = []
      this.$data.selectedRowKeys = []
      this.$data.test = []
      this.$data.autoExpandParent = true
    },
    
    // 展开
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    // 点击复选框
    onCheck (checkedKeys, info) {
      this.allSelectedNodes  = checkedKeys.concat(info.halfCheckedKeys)
      this.selectedRowKeys = checkedKeys
    },

    // 提交表单
    handleSubmit (e) {
      e.preventDefault()

      this.state.saveBtn = true

      const { UpdateRolePermission, data: { id }, allSelectedNodes } = this

      UpdateRolePermission({
        id: id,
        permission: allSelectedNodes
      })
      .then(res => {
        this.$notification['success']({
          message: '系统提示',
          description: lang.t(res)
        })

        this.onClose()
      })
      .catch(err => {
        this.$notification['error']({
          message: '系统提示',
          description: lang.t(err)
        })
      })
      .finally(() => {
        this.state.saveBtn = false
      })
    },

    // 1.循环遍历出最深层子节点，存放在一个数组中
    getTreeChildren(data){
      data&&data.map(item=>{
        if(item.children && item.children.length > 0){
          this.getTreeChildren(item.children)
        }else{
          this.test.push(item.key)
        }
        return null
      })
      return this.test
    },
    // 2.将后台返回的含有父节点的数组和第一步骤遍历的数组做比较
    // 3.如果有相同值，将相同值取出来，push到一个新数组中
    compareItem(all_data,child_data){
      var uniqueChild = []
      for(var i in child_data){
        for(var k in all_data){
          if(all_data[k] === child_data[i]){
            uniqueChild.push(all_data[k])
          }
        }
      }
      return uniqueChild
    },
  }
}
</script>