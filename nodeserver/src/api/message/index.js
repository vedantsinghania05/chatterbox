import { Router } from 'express'
import { middleware as query } from 'querymen'
import { password as passwordAuth, master, token } from '../../services/passport'
import { index, getMessages, show, create, update, updatePassword, destroy } from './controller'
import { schema } from './model'
export Message, { schema } from './model'

const router = new Router()

router.post('/',
  master(),
  create)

router.get('/',
  token({ required: true }),
  getMessages)

export default router