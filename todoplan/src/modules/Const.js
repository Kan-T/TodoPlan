export const PLAN_LIST = '智能计划清单'
export const LIST = '清单'
export const LISTS = '清单列表'
export const HOME_PAGE = '首页'
export const DEFAULT = '默认'
export const TODAY = '今日 (第0天)'
export const DAY_1_6 = '第 1 至 6 天'
export const DAY_7_LATER = '第 7 至 ~ 天'
export const TOMORROW = '明日'
export const DAY3_7 = '一周'
export const FUTURE = '未来'
export const NO_PLAN = '未计划'
export const CUSTOM = '固定习惯'
export const DONE = '已完成'
export const SETTING = '设置'

export const APP_NAME = '待办计划'
export const DATE = '日期'
export const TIME = '时间'
export const REMIND = '提醒'
export const TODO_LIST = '待办列表'
export const ADD_ITEM_CONTENT = '添加待办事项内容 (必填项)'
export const ADD_SUBITEM = '添加子事项'
export const EMPTY_CONFIRM = '列表内的清单将被清空，确定要清空此列表吗？'
export const CLOSE_LIST = '关闭列表'
export const LIST_TO_ADD = '要添加的列表'
export const CONTENT = '内容'
export const SUB_TASK = '子任务'
export const ADD = '添加'
export const EMPTY = '清空'
export const SAVE = '保存'
export const EDIT = '编辑'
export const DELETE = '删除'
export const COMPLETE = '完成'
export const CANCEL = '取消'
export const CLEAR = '清除'
export const TIP = '提示'
export const TURN_ON = '打开'
export const TURN_OFF = '关闭'
export const ON = '开'
export const OFF = '关'
export const COPY_TO = '复制到'
export const MOVE_TO = '移动到'
export const REMIND_LATER = '稍后提醒'
export const DONE_CLEAN_FAIL = '已完成列表清理失败'
export const DONE_CLEAN_END = '已完成列表清理完成'
export const DELETE_ALL_LIST_DATA = '删除全部清单数据'
export const ADDTODO_MESSAGE = '"计划日期"填写后，该事项会自动显示在"智能计划清单"列表中对应的清单内。'
export const LIST_DEL_ALERT = '删除清单前，请先清空其 代办事项。'
export const TIME_INCORRECT = '时间格式不正确'
export const ATTENTION = '注意'
export const CONFIRM_BTN = '确定'
export const FONT_SIZE = '字体大小'
export const SMALL = '小'
export const BIG = '大'
export const BUTTON_VOLUME = '按键音量'
export const PRIORITY = '优先级'
export const DONE_SAVE_DAYS = '已完成事项保留天数'
export const MAX = Infinity
export const MIN = -Infinity

export const SAVE_TO = '存储到'
export const CHOOSE = '请选择'
export const DETAIL = '详情'
export const SORT = '排序'
export const LANG = '语言'
export const LANG_CHN = '简体中文'
export const LANG_EN = 'English'

export const FONT_ADJUST = 'todo_local_font_adjust'
export const TAP_VOLUME = 'todo_local_tap_volume'
export const DONE_KEEP_DAYS = 'todo_local_done_keep_days'
export const LAST_CLEAN_DATE = 'todo_local_last_clean_date'
export const NOTIFY_ID = 'todo_local_notify_id'
export const ASIDE_LIST = '_aside_list'
export const ASIDE_LIST_ID = '110'
export const PLAN_LIST_ARGS = '_plan_list_args'
export const CONFIG = '_config'
export const PRIORITIES = ['低优先级', '中优先级', '高优先级']
export const SORT_DEFAULT = '默认排序'
export const SORT_PRIORITY = '按优先级排序'
export const SORT_REMINDER = '按提醒时间排序'
export const SORT_DATETIME = '按计划时间排序'
export const SORT_KEYS = [SORT_DEFAULT, SORT_PRIORITY, SORT_REMINDER, SORT_DATETIME]

// Program read only, no need to translate.
export const RESERVED_NAMES = [TODAY, TOMORROW, DAY3_7, DAY_7_LATER, NO_PLAN, CUSTOM, DONE, ASIDE_LIST, CONFIG, DEFAULT]
// export const PLAN_TODO_LIST = [TODAY, TOMORROW, DAY3_7, DAY_7_LATER, NO_PLAN, DONE]
export const PLAN_TODO_LIST = [TODAY, DAY_1_6, DAY_7_LATER, NO_PLAN, DONE]
export const PLAN_LIST_ARGS_INIT = {
  '今日 (第0天)': {
    min: MIN,
    max: 0
  },
  '第 1 至 6 天': {
    min: 1,
    max: 6
  },
  '第 7 至 ~ 天': {
    min: 7,
    max: MAX
  }
}
