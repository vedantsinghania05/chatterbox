import { Router } from 'express'
import { master, token } from '../../services/passport'
import { create, getGroupsForUser, getGroupInfo, getGroupMembers } from './controller'
import { schema } from './model'
export Group, { schema } from './model'

const router = new Router()

router.post('/',
  master(),
  create)

router.get('/user',
  token({ required: true }),
  getGroupsForUser)
  
router.get('/:id',
  token({ required: true }),
  getGroupInfo)

router.get('/:id/members',
  token({ required: true }),
  getGroupMembers)

export default router