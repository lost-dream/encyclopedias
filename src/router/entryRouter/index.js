
const EntryRouter = [
    {
        path: '/viewEntry',
        component: () => import('@/views/entry/viewEntry'),
        name: 'viewEntry',
        meta: {
            title: '词条浏览',
        }
    },{
        path: '/createEntry',
        component: () => import('@/views/entry/createEntry'),
        name: 'createEntry',
        meta: {
            title: '词条创建',
        }
    }, {
        path: '/editEntry',
        component: () => import('@/views/entry/editEntry'),
        name: 'editEntry',
        meta: {
            title: '词条编辑',
        },
    },{
        path: '/editOthersEntry',
        component: () => import('@/views/entry/editOthersEntry'),
        name: 'editOthersEntry',
        meta: {
            title: '词条编辑',
        },
    }
]
export default EntryRouter
