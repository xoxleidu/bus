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
      @row-dblclick = "dbClickRow"
      style="width: 98%;margin: 20px;">

      <el-table-column type="expand" label="展开" width="60">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        prop="id"
        label="ID"
        sortable
        width="60">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="date"-->
        <!--label="日期"-->
        <!--sortable-->
        <!--width="180">-->
        <!--<template slot-scope="scope">-->
          <!--<i class="el-icon-time"></i>-->
          <!--<span style="margin-left: 10px">{{ scope.row.date }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        label="个人信息"
        width="180"
        align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.name }}</p>
            <p>{{ scope.row.photoPath }}</p>
            <p>性别: {{ scope.row.sex == 0 ? "男":"女"}}</p>
            <p>身份证: {{ scope.row.idcard }}</p>
            <p>住址: {{ scope.row.address }}</p>
            <p>备注: {{ scope.row.remark }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="age"
        label="年龄"
        width="80">
      </el-table-column>
      <el-table-column
        sortable
        prop="employeeId"
        label="员工号"
        width="90">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="电话"
        width="120">
      </el-table-column>
      <el-table-column
        label="所属公司"
        width="100">
        <template slot-scope="scope">
          {{ scope.row.companyId == 0 ? "一公司" : scope.row.companyId == 1 ? "二公司" : scope.row.companyId == 2 ? "三公司" : "四公司"}}
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="inchargeLine"
        label="所属路线"
        width="110">
      </el-table-column>
      <el-table-column
        sortable
        prop="grade"
        label="评级分数"
        width="110">
      </el-table-column>
      <el-table-column
        sortable
        prop="complaintCount"
        label="投诉次数"
        width="110">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
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



    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        231
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Clean</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ dialogbutton }}</el-button>
      </div>
    </el-dialog>

  </div>


</template>

<script>
  import { getList,postList,createArticle } from '@/api/table'
    export default {
        name: "index",
        data() {
          return {
            inputSearch: '',
            selectSearch: 1,

            /*{
              "address": "河北省廊坊市广阳区万达广场",
              "age": 28,
              "companyId": 0,所属公司
              "complaintCount": 2,受到投诉次数
              "employeeId": 1001,员工号
              "grade": 9,评级分数
              "idcard": "131002199408204046",
              "inchargeLine": 24,所属路线
              "name": "张三",
              "photoPath": "201-10-18-wsdassda.jpg",
              "remark": "测试测试123",备注
              "sex": 0,
              "telephone": "13185471256"
            }*/

            listLoading: true,
            tableData: [{
              id: '1',
              name: '王小虎',
              sex: 0,
              age: 28,
              employeeId: '员工号',
              telephone: '13185471256',
              companyId: '所属公司',
              inchargeLine: '所属路线',
              grade: '评级分数',
              complaintCount: '受到投诉次数',
              idcard: '131002199408204046',
              photoPath: '201-10-18-wsdassda.jpg',
              remark: '测试测试',
              address: '上海市普陀区金沙江路'
            }],
            multipleSelection: [],
            total: 5,
            currentPage: 1,
            pageSize: 2,

            temp: {
              id: undefined,
              importance: 1,
              remark: '',
              timestamp: new Date(),
              title: '',
              type: '',
              status: 'published'
            },
            dialogStatus: '',
            dialogFormVisible: false,
            textMap: {
              update: 'Edit',
              create: 'Create'
            },
            /*contenttype: [{
              'data': {
                'test':'test'
              },
              'headers': {
                'Content-Type': 'application/json'
              }
            }]*/
            contenttype: {
              'username': 'admin',
              'password': 'admin'
            },


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



          resetTemp() {
            this.temp = {
              id: undefined,
              importance: 1,
              remark: '',
              timestamp: new Date(),
              title: '',
              status: 'published',
              type: ''
            }
          },
          onSubmitAdd() {

            this.resetTemp()
            this.dialogStatus = 'create'
            this.dialogbutton = 'create'
            this.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })

            /*//添加数据
            this.list.unshift(this.temp);

            //删除数据
            const index = this.list.indexOf(row); //找到要删除数据在list中的位置
            this.list.splice(index, 1); //通过splice 删除数据

            //修改数据
            const index = this.list.indexOf(row); //找到修改的数据在list中的位置
            this.list.splice(index, 1,this.updatedData); //通过splice 替换数据 触发视图更新*/
          },


          dbClickRow(val){
            alert(val.id);
            console.log(val);
          },
          handleEdit(index, row) {
            alert(row.id);
            console.log(index, row);
          },
          handleDelete(index, row) {
            alert(row.id);
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

            //alert(curr + '|' + sizes + '|' + data);

            this.listLoading = true
            //alert(this.currentPage);
            postList(this.currentPage,this.pageSize).then(response => {
              //this.tableData = response.data.items
              //alert(response.result.length);
              this.listLoading = false
              this.total = response.result.length;
              this.currentPage = 1;
              this.tableData = response.result;
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



          createData() {
            createArticle(this.contenttype).then((res) => {
              //alert(res);
            })
            /*this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
                this.temp.author = 'vue-element-admin'
                createArticle(this.temp).then(() => {
                  this.list.unshift(this.temp)
                  this.dialogFormVisible = false
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                })
              }
            })*/
          },
          handleUpdate(row) {
            this.temp = Object.assign({}, row) // copy obj
            this.temp.timestamp = new Date(this.temp.timestamp)
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
          },
          updateData() {
            this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                const tempData = Object.assign({}, this.temp)
                tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
                updateArticle(tempData).then(() => {
                  for (const v of this.list) {
                    if (v.id === this.temp.id) {
                      const index = this.list.indexOf(v)
                      this.list.splice(index, 1, this.temp)
                      break
                    }
                  }
                  this.dialogFormVisible = false
                  this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                  })
                })
              }
            })
          },
          handleDelete(row) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
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
