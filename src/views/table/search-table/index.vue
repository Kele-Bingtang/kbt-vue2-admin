<template>
  <div class="single-search-table-container">
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
        <el-button v-waves type="primary" icon="el-icon-search" @click="handleReset">重置</el-button>
      </div>
    </div>

    <el-table :data="tableData" v-loading="loading" border highlight-current-row row-key="id" style="width: 100%">
      <el-table-column prop="id" label="ID" width="70" align="center" sortable></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | tableStatusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级">
        <template slot-scope="{ row }">
          <svg-icon v-for="n in row.priority" :key="n" name="star" style="color: #606266" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="{ row, $index }">
          <el-button type="text" icon="el-icon-delete" @click="handleDelete(row, $index)" class="btn-danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { middleData } from "@/test/table";
import { Component, Vue } from "vue-property-decorator";

@Component({ name: "SearchTableDemo" })
export default class extends Vue {
  public row!: any;
  public $index: any;
  public tableStatusFilter!: any;

  public loading = true;
  public tableData = middleData;
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

  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  // 应该将参数 searchParams 传到后台，这里演示本地数据查询
  public handleSearch(type: "single" | "multiple") {
    this.loading = true;
    this.tableData = middleData;
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
      let tableData = [...this.tableData];
      if (this.multipleSearchParams.name) {
        tableData = this.tableData.filter(item => {
          return item.name.indexOf(this.multipleSearchParams.name) !== -1;
        });
      }
      if (this.multipleSearchParams.status) {
        tableData = this.tableData.filter(item => {
          return item.status === this.multipleSearchParams.status;
        });
      }
      if (this.multipleSearchParams.priority) {
        tableData = this.tableData.filter(item => {
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
    this.tableData = middleData;
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
}
</script>

<style lang="scss" scoped>
.single-search-table-container {
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
}
</style>
