
const SpecialManagerRouter = [
    {
        path: '/specialManager',
        component: () => import('@/views/specialManager/index'),
        name: 'subjectManager',
        meta: {
            title: '专题管理',
        }
    }
]
export default SpecialManagerRouter
