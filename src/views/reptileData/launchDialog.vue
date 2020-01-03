<template>
    <div class="launchDialog">
        <el-table
                class="departTable"
                :data="entryListData"
                border
                @selection-change="handleSelectionChange"
                style="width: 100%"
        >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="title" label="词条名称" width="180"></el-table-column>
            <el-table-column prop="desc" label="词条描述"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="modalShow = false">取 消</el-button>
            <el-button type="primary" @click="modify">确 定</el-button>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'launchDialog'
  }
</script>

<style lang="scss" scoped>

</style>