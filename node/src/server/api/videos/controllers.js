import fs from 'fs'
import Clip from './models/clip_models'
import Video from './models/video_models'
import { ServerError } from 'express-server-error'

export const video_index = {
  /**
   *  Finds all videos or specific video by id and returns array
   */
  async get (req, res) {
    console.log("getting video" + req.params.video_id)
    try {
      if (req.params.video_id) {
        let video = await Video.findById(req.params.video_id)
        if (!video) throw new ServerError('No video with that id exists at this moment.', { status: 404 })
        let clips = await Clip.find({
            '_id': { $in: video.clips}
        })
        res.json({
          video_name: video.name,
          clips: clips
        })
      } else {
        console.log("getting all videos")
        let videos = await Video.find({})
        if (!videos) throw new ServerError('No videos exist at this moment.', { status: 404 })
        res.json(videos)
      }
    } catch (error) {
      res.handleServerError(error)
    }
  },
  /**
   *  Adds video
   */
  async post (req, res) {
    try {
      let { name } = req.body
      console.log("saving video" + name)
      let new_video = new Video({ name: name })
      let saved_video = await new_video.save()
      console.log('saved video' + saved_video._id)
      res.json(saved_video)
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

export const clip_upload = {
  /**
   *  Adds clip
   */
  async post (req, res) {
    try {
      let video = await Video.findById(req.params.video_id)
      if (!video) throw new ServerError('No video with that id exists at this moment.', { status: 404 })
      let { blob } = req.body
      console.log("uploading clip")
      let new_clip = new Clip({ })
      makeDirectoryIfDoesNotExist('/videos')
      makeDirectoryIfDoesNotExist(`/videos/${req.params.video_id}`)
      var path = `/videos/${req.params.video_id}/${new_clip._id}.mp4`
      var buf = new Buffer(blob, 'base64'); // decode
      fs.writeFile(path, buf, async function(err) {
        if(err) {
          console.log("err", err);
          res.handleServerError(err)//throw new ServerError('Error saving video', { status: 404 })
        } else {
          new_clip.path = path
          let saved_clip = await new_clip.save()
          res.json(saved_clip)
        }
      });
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

function makeDirectoryIfDoesNotExist(dir) {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const video_search = {
  async get (req, res) {
    try {
      console.log("searching for" + req.params.search_term)
      const regex = new RegExp(escapeRegex(req.params.search_term), 'gi');
      let videos = await Video.find({ name: regex })
      console.log("returning " + JSON.stringify(videos))
      res.json(videos)
    } catch (error) {
      res.handleServerError(error)
    }
  }
}

//TODO Probably unneccesary
export const transcript_search = {
  async get (req, res) {
    try {
      console.log("searching for" + req.params.search_term + " in video " + req.params.video_id)
      let video = await Video.findById(req.params.video_id)
      if (!video) throw new ServerError('No video with that id exists at this moment.', { status: 404 })
      const regex = new RegExp(escapeRegex(req.params.search_term), 'gi');
      let clips = await Clip.find({
        '_id': { $in: video.clips },
        transcript: regex
      })
      console.log("returning " + JSON.stringify(clips))
      res.json(clips)
    } catch (error) {
      res.handleServerError(error)
    }
  }
}
