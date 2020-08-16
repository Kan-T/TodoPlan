// 7. import components we can route to
import * as CONST from './modules/Const'
import List from './components/List'
import Setting from './components/Setting'

const routes = [
  {
    path: '/',
    redirect: { name: 'list', params: { 'listName': CONST.TODAY }}
  },
  {
    path: '/setting',
    component: Setting
  },
  {
    path: '/list/:listName',
    component: List,
    name: 'list',
    props: true
  },
  { path: '*',
    component: Setting
  }
]
export default routes
