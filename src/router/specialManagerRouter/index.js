
const SpecialManagerRouter = [
    {
        path: '/specialManager',
        component: () => import('@/views/specialManager/index'),
        name: 'specialManager',
        meta: {
            title: '专题管理',
        },
    },
    {
        path: '/specialDetail',
        component: () => import('@/views/specialManager/specialDetail'),
        name: 'specialDetail',
        meta: {
            title: '专题管理',
        }
    }
]
export default SpecialManagerRouter
