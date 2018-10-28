<template>
  <div>
    <el-row class="el-row-left">
      <el-col :span="3">
        <el-input placeholder="请输入内容" v-model="inputSearch" @keyup.enter.native="onSubmitSearch" class="input-with-select">
          <el-select v-model="selectSearch" slot="prepend" placeholder="请选择">
            <el-option label="餐厅名" value="1"></el-option>
            <el-option label="订单号" value="2"></el-option>
            <el-option label="用户电话" value="3"></el-option>
          </el-select>
        </el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="success" icon="el-icon-search" @click="onSubmitSearch"></el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="onSubmitAdd">Add</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      element-loading-text="Loading"
      ref="multipleTable"
      :data="tableData"
      stripe
      border
      :default-sort = "{order: 'descending'}"
      @selection-change="handleSelectionChange"
      style="width: 98%;margin: 20px;">
      <el-table-column
        prop="id"
        label="ID"
        sortable
        width="60">
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.name }}</p>
            <p>住址: {{ scope.row.address }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[5, 10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>


</template>

<script>
  import { getList } from '@/api/table'
    export default {
        name: "index",
        data() {
          return {
            inputSearch: '',
            selectSearch: 1,

            listLoading: true,
            tableData: [{
              id: '1',
              date: '2016-05-02',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }],
            multipleSelection: [],
            total: 5,
            currentPage: 1,
            pageSize: 2,
          }
        },
        created: function(){
          // 组件创建完后获取数据，
          // 此时 data 已经被 observed 了
          this.fetchData();
        },
        methods: {

          onSubmitSearch() {
            alert(this.selectSearch + ' onSubmitSearch ' + this.inputSearch)
          },
          onSubmitAdd() {
            alert('onSubmitAdd!');
            /*//添加数据
            this.list.unshift(this.temp);

            //删除数据
            const index = this.list.indexOf(row); //找到要删除数据在list中的位置
            this.list.splice(index, 1); //通过splice 删除数据

            //修改数据
            const index = this.list.indexOf(row); //找到修改的数据在list中的位置
            this.list.splice(index, 1,this.updatedData); //通过splice 替换数据 触发视图更新*/
          },


          handleEdit(index, row) {
            console.log(index, row);
          },
          handleDelete(index, row) {
            console.log(index, row);
          },
          formatter(row, column) {
            return row.address;
          },
          handleSizeChange(val){
            this.pageSize = val;
            this.currentPage = 1;
            this.fetchData(1, val);
            // console.log(`每页 ${val} 条`);
          },
          handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            //this.currentPage = val;
            this.fetchData(val,this.pageSize);
          },
          handleSelectionChange(val) {
            //this.multipleSelection = val;
            this.currentPage = val;
            this.fetchData(val, this.pageSize);
            // console.log(`当前页: ${val}`);
          },
          callbackFunction(result) {
            alert(result + "aaa");
          },
          fetchData(curr,sizes,data){

            alert(curr + '|' + sizes + '|' + data);

            this.listLoading = true
            //alert(this.currentPage);
            getList(this.currentPage).then(response => {
              //this.tableData = response.data.items
              this.listLoading = false
              this.total = response.data.items.length;
              this.currentPage = 1;
              this.tableData = response.data.items;
            })

            /*this.axios.post('list.json',this.qs.stringify({'name':'xiaoming','sex':'nan'}),{
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
              .then(function(res){
                console.log(res.data)
                //控制台打印请求成功时返回的数据
                //bind(this)可以不用
              }.bind(this))
              .catch(function(err){
                if(err.response) {
                  console.log(err.response)
                  //控制台打印错误返回的内容
                }
                //bind(this)可以不用
              }.bind(this))*/

            //获取数据
            /*this.$http.jsonp("list.json",{//跨域请求数据
              params: {
                keywords:this.keyword//输入的关键词
              },
              jsonpCallback:'callbackFunction'//这里是callback
            }).then(function(res) {//请求成功回调，请求来的数据赋给searchList数组
              this.total = res.body.count;
              this.currentPage = res.body.curr;
              this.tableData = res.body.data;
              console.info(res);
            },function(res) {//失败显示状态码
              alert("res.status:"+res.status)
            })*/
          },
        }
    }
</script>

<style scoped>



  .el-row-left {
    margin-left: 20px;
    margin-top: 20px;
    margin-right: 20px;
  }
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
