import { Router } from 'express'
import { middleware as query } from 'querymen'
import { password as passwordAuth, master, token } from '../../services/passport'
import { index, show, create, update, updatePassword, destroy, getMembers } from './controller'
import { schema } from './model'
export User, { schema } from './model'

const router = new Router()

router.get('/',
  token({ required: true }),
  query(),
  getMembers)

router.get('/:id',
  token({ required: true }),
  show)

router.post('/',
  master(),
  create)

router.put('/:id',
  token({ required: true }),
  update)

router.put('/:id/password',
  passwordAuth(),
  updatePassword)

router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
