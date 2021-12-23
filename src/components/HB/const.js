const TYPE_ENUM = {
    INPUT: '1-1',
    INPUT_NUMBER: '1-2',
    INPUT_TEXT_AREA: '1-3',
    SELECT: '2-1-1',
    SELECT_FILTER: '2-1-2',
    SELECT_SEARCH: '2-1-3',
    SELECT_MULTI: '2-2-1', // 多选
    SELECT_MULTI_FILTER: '2-2-2',
    SELECT_MULTI_SEARCH: '2-2-3',
    SELECT_INPUT: '2-4-1', // 搜索即输入
    DATEPICKER: '3',
    MONTHPICKER: '3-1',
    DATERANGEPICKER: '3-2',
    LINK: '4',
    TEXT: '5',
    CHECKBOX: '6',
    CHECKBOX_GROUP: '6-1',
    CHANGE: '7', //数据转换
    OPERATION: '8', //操作
    IMG: '9', //图片
    IMG_MULTI: '9_1', //图片
    FILE: '9_1_2', //文件
    FILE_MULTI: '9_1_3', //多文件
    BUTTON: '10-1', // 按钮
    BUTTONGROUP: '10-2', // 按钮
    DROPDOWN: '11', // 下拉框,
    ACTION: '12', // 组合操作
    RADIO: '13-1', // 单选项
    SWITCH: '14', // 开关
    TIMESTAMP: '15-1', // 时间戳转时间
};

const OPERATION_TYPE = {
    ADD: 0, // 新增
    EDIT: 1, // 编辑
    COPY: 2, // 拷贝
    DETAIL: 3, // 详情
};

export {
    TYPE_ENUM,
    OPERATION_TYPE
} 
