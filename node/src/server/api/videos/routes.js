import { Router } from 'express'
import { video_index, video_search, clip_upload, transcript_search } from './controllers'

const router = Router()

router.get('/:video_id', video_index.get)
router.post('/', video_index.post)
router.post('/:video_id/upload', clip_upload.post)
router.get('/', video_index.get)
router.get('/search/:search_term', video_search.get)
router.get('/:video_id/transcripts/search/:search_term', transcript_search.get) //TODO: probably should use front-end search

export default router
