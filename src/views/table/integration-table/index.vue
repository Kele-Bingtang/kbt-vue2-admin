<template>
  <div class="tree-table-container">
    <div class="search-container">
      <div class="single-search search-content">
        <el-select v-model="singleSearchKey" placeholder="关键词" clearable style="width: 150px">
          <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input
          v-model="singleSearchValue"
          placeholder="输入关键词搜索"
          style="width: 200px"
          @keyup.enter.native="handleSearch('single')"
        />
        <el-button
          v-waves
          type="primary"
          icon="el-icon-search"
          @click="handleSearch('single')"
          style="margin-left: 10px"
        >
          单条件查询
        </el-button>
      </div>
      <div class="multiple-search search-content">
        <el-input v-model="multipleSearchParams.name" placeholder="姓名" style="width: 200px" />
        <el-select v-model="multipleSearchParams.status" placeholder="状态" clearable style="width: 130px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="multipleSearchParams.priority" placeholder="优先级" clearable style="width: 120px">
          <el-option v-for="item in priorityOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button
          v-waves
          type="primary"
          icon="el-icon-search"
          @click="handleSearch('multiple')"
          style="margin-left: 10px"
        >
          多条件查询
        </el-button>
        <el-button v-waves icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button v-waves type="primary" icon="el-icon-plus" @click="handleAdd()">添加</el-button>
        <el-checkbox v-model="showAddress" style="margin-left: 15px" @change="tableKey = tableKey + 1">
          地址
        </el-checkbox>
      </div>
    </div>

    <el-table
      :data="tableData.slice((paging.currentPage - 1) * paging.pageSize, paging.currentPage * paging.pageSize)"
      border
      highlight-current-row
      row-key="id"
      :key="tableKey"
      style="width: 100%"
      v-loading="loading"
      @row-dblclick="handleInlineEdit"
      ref="table"
    >
      <el-table-column prop="id" label="ID" width="70" align="center" sortable></el-table-column>
      <el-table-column prop="date" label="日期" width="180px"></el-table-column>
      <el-table-column prop="name" label="姓名" width="150px"></el-table-column>
      <el-table-column min-width="100" label="标题">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              circle
              @click="cancelEdit(row)"
            ></el-button>
            <el-button
              class="confirm-btn"
              size="small"
              icon="el-icon-check"
              type="primary"
              circle
              @click="confirmEdit(row)"
            ></el-button>
          </template>
          <span v-else style="color: var(--theme-color); cursor: pointer" @click="handleEdit(row)">
            {{ row.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" v-if="showAddress"></el-table-column>
      <el-table-column prop="status" label="状态" width="140">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | tableStatusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级" width="140">
        <template slot-scope="{ row }">
          <svg-icon v-for="n in row.priority" :key="n" name="star" style="color: #606266" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200px">
        <template slot-scope="{ row, $index }">
          <el-button type="text" icon="el-icon-search" @click="handleLook(row)" class="btn-info">查看</el-button>
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="handleDelete(row, $index)" class="btn-danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="tableData.length > 0"
      :total="tableData.length"
      :paging="paging"
      @pagination="handleSizeChange"
    />

    <el-dialog :title="dialogTitle[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempTableDate"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left: 50px"
        :disabled="dialogStatus === 'look'"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="tempTableDate.name" placeholder="请选择姓名" />
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="tempTableDate.date"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择日期"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="tempTableDate.status" placeholder="请选择状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-rate
            v-model="tempTableDate.priority"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :max="5"
            style="margin-top: 8px"
          />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="tempTableDate.address"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入地址"
          />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="tempTableDate.title"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入标题"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <template v-if="dialogStatus === 'look'">
          <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
        </template>
        <template v-else>
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus === 'add' ? addData() : editData()">确定</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Paging, paging } from "@/components/Pagination/index.vue";
import { largeData } from "@/test/table";
import { Form } from "element-ui";
import { Component, Vue, Watch } from "vue-property-decorator";
import Pagination from "@/components/Pagination/index.vue";
import Sortable from "sortablejs";

const defaultTableData = {
  id: "",
  name: "",
  date: "",
  address: "",
  status: "",
  priority: 0,
  title: "",
};

@Component({ name: "IntegrationTableDemo", components: { Pagination } })
export default class extends Vue {
  public row!: any;
  public $index!: any;
  public tableStatusFilter!: any;

  public tableKey = 0;
  public showAddress = false;
  public loading = true;
  public tableData = largeData;
  public paging = paging;
  public searchOptions = [
    {
      value: "id",
      label: "ID",
    },
    {
      value: "date",
      label: "日期",
    },
    {
      value: "name",
      label: "姓名",
    },
    {
      value: "address",
      label: "地址",
    },
    {
      value: "status",
      label: "状态",
    },
    {
      value: "priority",
      label: "优先级",
    },
  ];
  public singleSearchKey = "";
  public singleSearchValue = "";
  public multipleSearchParams = {
    name: "",
    status: "",
    priority: "",
  };
  public statusOptions = [
    {
      value: "Enable",
      label: "Enable",
    },
    {
      value: "Disable",
      label: "Disable",
    },
    {
      value: "Deleted",
      label: "Deleted",
    },
  ];
  public priorityOptions = [1, 2, 3, 4, 5];
  public dialogFormVisible = false;
  public dialogStatus = "";
  public dialogTitle: { [propName: string]: string } = {
    look: "查看",
    edit: "编辑",
    add: "创建",
  };
  public rules = {
    date: [{ required: true, message: "date is required", trigger: "change" }],
    name: [{ required: true, message: "name is required", trigger: "change" }],
    title: [{ required: true, message: "title is required", trigger: "blur" }],
  };
  public tempTableDate = defaultTableData;
  public sortable: any = null;

  @Watch("showAddress")
  public onShowAddressChange() {
    this.sortable = null;
    this.$nextTick(() => {
      this.rowDrop();
    });
  }

  mounted() {
    this.tableData.map(item => {
      this.$set(item, "edit", false);
      this.$set(item, "originalTitle", item.title);
      return item;
    });
    setTimeout(() => {
      this.loading = false;
    }, 500);
    this.rowDrop();
  }

  // 应该将参数 searchParams 传到后台，这里演示本地数据查询
  public handleSearch(type: "single" | "multiple") {
    this.loading = true;
    this.tableData = largeData;
    if (type === "single") {
      if (!this.singleSearchValue) {
        setTimeout(() => {
          this.loading = false;
        }, 500);
        return;
      }
      this.tableData = this.tableData.filter(item => {
        if (this.singleSearchKey === "priority") {
          return item.priority === parseInt(this.singleSearchValue);
        }
        return (item as any)[this.singleSearchKey].indexOf(this.singleSearchValue) !== -1;
      });
    } else {
      if (
        this.multipleSearchParams.name === "" &&
        this.multipleSearchParams.status === "" &&
        this.multipleSearchParams.priority === ""
      ) {
        setTimeout(() => {
          this.loading = false;
        }, 500);
        return;
      }
      let tableData = this.tableData;
      if (this.multipleSearchParams.name) {
        tableData = tableData.filter(item => {
          return item.name.indexOf(this.multipleSearchParams.name) !== -1;
        });
      }
      if (this.multipleSearchParams.status) {
        tableData = tableData.filter(item => {
          return item.status === this.multipleSearchParams.status;
        });
      }
      if (this.multipleSearchParams.priority) {
        tableData = tableData.filter(item => {
          return item.priority === parseInt(this.multipleSearchParams.priority);
        });
      }
      this.tableData = tableData;
    }
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  public handleReset() {
    this.tableData = largeData;
  }

  public handleAdd() {
    this.tempTableDate = defaultTableData;
    this.dialogStatus = "add";
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate();
    });
  }
  public addData() {
    (this.$refs.dataForm as Form).validate(async valid => {
      if (valid) {
        const tableData = this.tempTableDate;
        tableData.id = Math.round(Math.random() * 100) + 1024 + ""; // 随机一个 id
        this.tableData.unshift(tableData);
        this.dialogFormVisible = false;
        this.$notify({
          title: "成功",
          message: "创建成功",
          type: "success",
          duration: 2000,
        });
      }
    });
  }

  public handleInlineEdit(row: any) {
    if (row.edit) {
      this.cancelEdit(row);
    } else {
      row.edit = !row.edit;
    }
  }

  public cancelEdit(row: any) {
    row.title = row.originalTitle;
    row.edit = false;
    this.$message({
      message: "标题已恢复为原始值！",
      type: "warning",
    });
  }

  public confirmEdit(row: any) {
    row.edit = false;
    row.originalTitle = row.title;
    this.$message({
      message: "标题已编辑！",
      type: "success",
    });
  }

  public handleLook(row: any) {
    this.tempTableDate = Object.assign({}, row);
    this.dialogStatus = "look";
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate();
    });
  }

  public handleEdit(row: any) {
    this.tempTableDate = Object.assign({}, row);
    this.dialogStatus = "edit";
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate();
    });
  }
  public editData() {
    (this.$refs.dataForm as Form).validate(async valid => {
      if (valid) {
        const tempData = Object.assign({}, this.tempTableDate);
        const index = this.tableData.findIndex(v => v.id === tempData.id);
        this.tableData.splice(index, 1, tempData);
        this.dialogFormVisible = false;
        this.$notify({
          title: "成功",
          message: "更新成功",
          type: "success",
          duration: 2000,
        });
      }
    });
  }
  public handleDelete(row: any, index: number) {
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        this.tableData.splice(index, 1);
        this.$notify({
          title: "Success",
          message: "删除成功！",
          type: "success",
          duration: 2000,
        });
      })
      .catch(() => {});
  }

  public handleSizeChange(paging: Paging) {
    this.paging.currentPage = paging.currentPage;
    this.paging.pageSize = paging.pageSize;
  }

  // 完整 table-column 行拖拽
  public rowDrop() {
    const el = (this.$refs.table as Vue).$el.querySelector(".el-table__body-wrapper > table > tbody") as HTMLElement;
    this.sortable = Sortable.create(el, {
      ghostClass: "sortable-ghost",
      onEnd: (evt: any) => {
        if (typeof evt.oldIndex !== "undefined" && typeof evt.newIndex !== "undefined") {
          // 删除选择的行，并获取
          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0];
          // 获取的行插入到新的地方
          this.tableData.splice(evt.newIndex, 0, targetRow);
        }
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.tree-table-container {
  padding: 20px;
  .search-container {
    margin-bottom: 20px;
    .search-content {
      display: inline-block;
    }
    .multiple-search {
      margin-left: 20px;
    }
  }
  .edit-input {
    padding-right: 90px;
  }

  .cancel-btn {
    position: absolute;
    right: 55px;
    top: 10px;
  }
  .confirm-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
}
</style>

<style lang="scss">
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>
