<template>
  <div>
    <el-row class="el-row-left">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="inputSearch" @keyup.enter.native="onSubmitSearch"
                  class="input-with-select">
          <el-select v-model="selectSearch" slot="prepend" placeholder="请选择" style="width: 100px;">
            <el-option label="工号" value="0"></el-option>
            <el-option label="身份证" value="1"></el-option>
          </el-select>
        </el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="success" icon="el-icon-search" @click="onSubmitSearch"></el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="onSubmitAdd">Add</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="onSubmitClear">刷新</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      element-loading-text="Loading"
      ref="multipleTable"
      :data="tableData"
      stripe
      border
      :default-sort="{order: 'descending'}"
      @selection-change="handleSelectionChange"
      @row-dblclick="dbClickRow"
      style="width: 98%;margin: 20px;">

      <!--<el-table-column type="expand" label="展开" width="60">
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
      </el-table-column>-->

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
            <p>性别: {{ scope.row.sex == 0 ? "男":"女"}}</p>
            <p>身份证: {{ scope.row.idcard }}</p>
            <p>住址: {{ scope.row.address }}</p>
            <p>备注: {{ scope.row.remark }}</p>
            <div slot="reference" class="name-wrapper">
              <div v-if="scope.row.photoPath" class="avatartablerowfacediv">
                <img :src="scope.row.photoPath">
              </div>
              <div v-else class="avatartablerowfacediv">
                <img src="/static/imageDef.jpg">
              </div>
              <div class="avatartablerownamediv">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
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
          {{ scope.row.companyId == 0 ? "一公司" : scope.row.companyId == 1 ? "二公司" : scope.row.companyId == 2 ? "三公司" :
          "四公司"}}
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
      <el-table-column
        align="center"
        label="驾照"
        width="110">
        <template slot-scope="scope">
          <div v-if="scope.row.licensePath" class="avatartablerowcarddiv">
            <img :src="scope.row.licensePath">
          </div>
          <div v-else class="avatartablerowcarddiv">
            <img src="/static/imageDef.jpg">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="体检表"
        width="110">
        <template slot-scope="scope">
          <div v-if="scope.row.healthPath" class="avatartablerowmedicadiv">
            <img :src="scope.row.healthPath">
          </div>
          <div v-else class="avatartablerowmedicadiv">
            <img src="/static/imageDef.jpg">
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除
          </el-button>
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

    <el-dialog :visible.sync="dialogImgVisible">
        <el-form ref="imgForm" :rules="rules" :model="temp"
                 label-position="left" label-width="70px"
                 style="width: 700px; margin:auto; text-align: center;">
          <el-row class="dialogtempimgcard">
            <img :src="temp.licensePath"/>
          </el-row>
          <el-row class="dialogtempimgmedica">
            <img :src="temp.healthPath"/>
          </el-row>
        </el-form>
    </el-dialog>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
               style="width: 800px; margin-left:50px;">

        <el-row :gutter="24" class="form_data_label">基本信息</el-row>
        <el-row :gutter="24">
          <el-col :span="2">姓名</el-col>
          <el-col :span="4">
            <el-input v-model="temp.name"/>
          </el-col>
          <el-col :span="2">性别</el-col>
          <el-col :span="4">
            <el-radio-group v-model="temp.sex">
              <el-radio-button label="0">男</el-radio-button>
              <el-radio-button label="1">女</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="2">年龄</el-col>
          <el-col :span="3">
            <el-input v-model="temp.age"/>
          </el-col>
          <el-col :span="2">电话</el-col>
          <el-col :span="5">
            <el-input v-model="temp.telephone"/>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="2">身份证</el-col>
          <el-col :span="8">
            <el-input v-model="temp.idcard"/>
          </el-col>
          <el-col :span="2">地址</el-col>
          <el-col :span="10">
            <el-input v-model="temp.address"/>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="2">头像</el-col>
          <el-col :span="6">
            <!--<img src="../../assets/user.png" class="img_border_radius" v-model="temp.photoPath" />-->

            <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/buscenter/uploaddriverimages/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageFaceUrl" :src="imageFaceUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

          </el-col>
          <el-col :span="2">驾照</el-col>
          <el-col :span="6">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/buscenter/uploaddriverimages/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess1"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageCardUrl" :src="imageCardUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
          <el-col :span="2">体检表</el-col>
          <el-col :span="6">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/buscenter/uploaddriverimages/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess2"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageMedicalUrl" :src="imageMedicalUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="form_data_label">工作信息</el-row>
        <el-row :gutter="24">
          <el-col :span="2">员工号</el-col>
          <el-col :span="6">
            <el-input v-model="temp.employeeId" :disabled="true" />
          </el-col>
          <el-col :span="3">所属公司</el-col>
          <el-col :span="6">
            <el-select v-model="temp.companyId" placeholder="please select your zone">
              <el-option label="Zone one" value="0"/>
              <el-option label="Zone two" value="1"/>
              <el-option label="Zone three" value="2"/>
              <el-option label="Zone fore" value="3"/>
            </el-select>
          </el-col>
          <el-col :span="3">所属路线</el-col>
          <el-col :span="4">
            <el-select v-model="temp.inchargeLine" placeholder="please select your zone">
              <el-option label="Zone one" value="1"/>
              <el-option label="Zone two" value="2"/>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="form_data_label">评价信息</el-row>
        <el-row :gutter="24">
          <el-col :span="3">评级分数</el-col>
          <el-col :span="6">
            <el-input v-model="temp.grade" :disabled="true" />
          </el-col>
          <el-col :span="4">受到投诉次数</el-col>
          <el-col :span="6">
            <el-input v-model="temp.complaintCount" :disabled="true" />
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="2">备注</el-col>
          <el-col :span="20">
            <el-input v-model="temp.remark" type="textarea"/>
          </el-col>
        </el-row>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Clean</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ dialogbutton }}
        </el-button>
      </div>
    </el-dialog>

  </div>


</template>

<script>
  import {getList, postList, createArticle, updateArticle,deleteArticle,searchArticle} from '@/api/table'

  export default {
    name: "index",
    data() {
      return {
        inputSearch: undefined,
        selectSearch: undefined,

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
          photoPath: '/static/imageDef.jpg',
          licensePath: '/static/imageDef.jpg',
          healthPath: '/static/imageDef.jpg',
          remark: '测试测试',
          address: '上海市普陀区金沙江路'
        }],
        multipleSelection: [],
        total: 5,
        currentPage: undefined,
        pageSize: 5,

        temp: {
          id: undefined,
          name: '',
          sex: 0,
          age: 20,
          employeeId: 1000,
          telephone: '',
          companyId: 0,
          inchargeLine: 1,
          grade: 0,
          complaintCount: 0,
          idcard: '',
          photoPath: '',
          licensePath: '',
          healthPath: '',
          remark: '',
          address: '廊坊市'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        dialogImgVisible: false,
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        querykey:'employeeId',
        imageFaceUrl: '',
        imageCardUrl: '',
        imageMedicalUrl: '',
        imageDef:'/static/imageDef.jpg'



      }
    },
    created: function () {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      this.fetchData();
    },
    methods: {

      resetTemp() {
        this.temp = {
          id: undefined,
          name: '',
          sex: 1,
          age: 20,
          employeeId: 1000,
          telephone: '',
          companyId: 0,
          inchargeLine: 1,
          grade: 0,
          complaintCount: 0,
          idcard: '',
          photoPath: '',
          remark: '',
          address: '廊坊市',
          healthPath:'',
          licensePath:'',
        }
      },
      onSubmitAdd() {

        this.resetTemp()
        this.imageFaceUrl = ''
        this.imageCardUrl = ''
        this.imageMedicalUrl = ''
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


      dbClickRow(val) {

        if(val.licensePath == '' || val.healthPath == '') {
          this.$notify({
            title: '警告',
            message: '没有上传资料',
            type: 'warning',
            duration: 2000
          })
        } else {
          this.temp.licensePath = val.licensePath;
          this.temp.healthPath = val.healthPath;
          this.dialogImgVisible = true
          this.$nextTick(() => {
            this.$refs['imgForm'].clearValidate()
          })
        }


        //alert(val.licensePath);
        //console.log(val);
      },




      handleSizeChange(val) {

        this.pageSize = val;
        this.currentPage = 1;
        this.fetchData();
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);

        this.currentPage = val;
        this.fetchData();
      },
      handleSelectionChange(val) {
        alert(123)
        //this.multipleSelection = val;
        //this.currentPage = val;
        this.fetchData();
        // console.log(`当前页: ${val}`);
      },
      callbackFunction(result) {
        alert(result + "aaa");
      },

      onSubmitSearch() {
        if(this.selectSearch == undefined) {
          this.$notify({
            title: '警告',
            message: '请选择查询条件',
            type: 'warning',
            duration: 2000
          })
        }else if(this.inputSearch == undefined){
          this.$notify({
            title: '警告',
            message: '请填写查询内容',
            type: 'warning',
            duration: 2000
          })
        }else {
          this.fetchData()
        }

      },

      onSubmitClear(){
        this.currentPage = undefined
        this.selectSearch = undefined
        this.inputSearch = undefined
        this.imageFaceUrl = ''
        this.imageCardUrl = ''
        this.imageMedicalUrl = ''
        this.fetchData()
      },

      fetchData() {
        this.listLoading = true

        /*if(data == null && data == undefined && data == ''){
          alert('搜索')
          searchArticle(this.currentPage, this.pageSize, this.inputSearch).then(response => {
            //this.tableData = response.data.items
            //alert(response.result.length);
            this.listLoading = false
            this.total = response.result.length;
            this.currentPage = 1;
            this.tableData = response.result;
          })
        } else {*/
        //alert(this.currentPage);
        postList(this.currentPage, this.pageSize,this.selectSearch,this.inputSearch).then(response => {
          //this.tableData = response.data.items
          //alert(response.result.length);
          this.listLoading = false
          this.total = response.result.total;
          this.currentPage = response.result.current;
          this.tableData = response.result.records;
        })
        //}
        //alert(curr + '|' + sizes + '|' + data);

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

          console.log(this.temp);
        createArticle(this.temp).then((res) => {
          console.log(res)
          if (res.code == "000") {
            this.temp.id = res.result
            this.tableData.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }else {
            this.$notify({
              title: '失败',
              message: '创建失败',
              type: 'error',
              duration: 4000
            })
          }
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
        alert(JSON.stringify(row))
        this.temp = Object.assign({}, row) // copy obj
        //this.temp.timestamp = new Date(this.temp.timestamp)
        this.imageFaceUrl = row.photoPath;
        this.imageCardUrl = row.licensePath;
        this.imageMedicalUrl = row.healthPath;
        this.dialogbutton = 'update'
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {

        console.log()
        updateArticle(this.temp).then((res) => {
          console.log(res)
          if (res.code == "000") {
            for (const v of this.tableData) {
              if (v.id === this.temp.id) {
                const index = this.tableData.indexOf(v)
                this.tableData.splice(index, 1, this.temp)
                break
              }
            }
            //this.tableData.splice(index, 1,this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          }else {
            this.$notify({
              title: '失败',
              message: '创建失败',
              type: 'error',
              duration: 4000
            })
          }
        })

        /*this.$refs['dataForm'].validate((valid) => {
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
        })*/
      },
      handleDelete(row) {

        deleteArticle(row.id).then((res) => {
          console.log(res)
          if (res.code == "000") {
            const index = this.tableData.indexOf(row)
            this.tableData.splice(index, 1)
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }else {
            this.$notify({
              title: '失败',
              message: '创建失败',
              type: 'error',
              duration: 4000
            })
          }
        })

        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },

      /*photoPath: this.imageFaceUrl,
      licensePath: this.imageCardUrl,
      healthPath: this.imageMedicalUrl,*/

      handleAvatarSuccess(res, file) {

        console.log(res)
        //this.imageUrl = URL.createObjectURL(file.raw);
        this.imageFaceUrl = res.result.url;
        this.temp.photoPath = res.result.url;
      },
      handleAvatarSuccess1(res, file) {

        console.log(res)
        //this.imageUrl = URL.createObjectURL(file.raw);
        this.imageCardUrl = res.result.url;
        this.temp.licensePath = res.result.url
      },
      handleAvatarSuccess2(res, file) {

        console.log(res)
        //this.imageUrl = URL.createObjectURL(file.raw);
        this.imageMedicalUrl = res.result.url;
        this.temp.healthPath = res.result.url
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

    }
  }
</script>

<style scoped>

  .img_border_radius {
    border-radius: 60px;
    width: 120px;
    height: 120px;
  }
  .form_data_label{
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 1px solid #d3dce6;
  }
  .el-row {
    margin: 20px;
  }
  .el-col {
    line-height: 36px;
  }
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
  .input-with-select select {
    width: 120px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatartablerow {
    width: 60px;
    height: 40px;
    display: block;
  }
  .avatartablerowfacediv img{
    width: 26px;
    height: 26px;
    -webkit-border-radius: 13px;
    border-radius: 13px;
  }
  .avatartablerowfacediv{
    float: left;
  }
  .avatartablerowcarddiv img{
    width: 60px;
    height: 40px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }
  .avatartablerowmedicadiv img{
    width: 40px;
    height: 60px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }
  .dialogtempimgcard img {
    width: 400px;
    height: 250px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }
  .dialogtempimgmedica img {
    width: 600px;
    height: 800px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }
  /*.zjhn-nav li.active a{
    background-image:url(../image/Click_03_temp.png);
    background-repeat:no-repeat;
    background-size:100% 100%;
    -moz-background-size:100% 100%;}*/
</style>
