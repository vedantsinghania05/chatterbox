import { Router } from 'express'
import { master, token } from '../../services/passport'
import { create, getGroupsForUser } from './controller'
import { schema } from './model'
export Group, { schema } from './model'

const router = new Router()

router.post('/',
  master(),
  create)

router.get('/user',
  token({ required: true }),
  getGroupsForUser)
  
export default router