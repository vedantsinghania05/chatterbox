import { Router } from 'express'
import { middleware as query } from 'querymen'
import { password as passwordAuth, master, token } from '../../services/passport'
import { create, index, show, update, getUsersGroups } from './controller'
import { schema } from './model'
export Group, { schema } from './model'

const router = new Router()

router.post('/',
  master(),
  create)

router.get('/',
  token({ required: true }),
  getUsersGroups)

router.get('/:id',
  token({ required: true }),
  show)

router.put('/:id',
  token({ required: true }),
  update)
  
export default router