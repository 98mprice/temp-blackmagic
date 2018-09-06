import { Router } from 'express'
import { person_index, upload_image } from './controllers'

const router = Router()

router.get('/:username', person_index.get)
router.get('/:username/:person_id', person_index.get)
router.post('/upload/:username', upload_image.post)
router.post('/:username', person_index.post)
router.post('/:username/:person_id', person_index.post)
router.delete('/:username/:person_id', person_index.delete)

export default router
