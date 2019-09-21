
const dictionaryRouter = [
    {
        path: '/viewDictionary',
        component: () => import('@/views/dictionary/viewDictionary'),
        name: 'viewDictionary',
        meta: {
            title: '词条浏览',
        }
    },{
        path: '/createDictionary',
        component: () => import('@/views/dictionary/createDictionary'),
        name: 'createDictionary',
        meta: {
            title: '词条创建',
        }
    }, {
        path: '/editDictionary',
        component: () => import('@/views/dictionary/editDictionary'),
        name: 'viewDictionary',
        meta: {
            title: '词条编辑',
        },
    }
]
export default dictionaryRouter
