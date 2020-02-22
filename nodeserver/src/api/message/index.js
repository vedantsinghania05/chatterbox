import { Router } from 'express'
import { middleware as query } from 'querymen'
import { password as passwordAuth, master, token } from '../../services/passport'
import { index, show, create, update, updatePassword, destroy } from './controller'
import { schema } from './model'
export Group, { schema } from './model'

const router = new Router()



export default router