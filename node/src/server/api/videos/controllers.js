import fs from 'fs'
import formidable from 'formidable'
import Clip from './models/clip_models'
import Video from './models/video_models'
import ffmpeg from 'fluent-ffmpeg';
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

function baseName(str) {
		var base = new String(str).substring(str.lastIndexOf('/') + 1);
		if(base.lastIndexOf(".") != -1) {
			base = base.substring(0, base.lastIndexOf("."));
		}
		return base;
	}

export const clip_upload = {
  /**
   *  Adds clip
   */
  async post (req, res) {
    try {
      console.log("ibn")
      var form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        console.log(JSON.stringify(files))
        for (var key in files) {
          if (files.hasOwnProperty(key)) {
            var file = files[key]
            var oldpath = file.path;
            var newpath = 'src/client/static/clips/' + file.name;
            //var filename = file.path;
            //var basename = baseName(filename);
            //console.log('basename ' + basename)
            await new Promise((resolve, reject) => {
              ffmpeg(oldpath)
              // Generate 720P video
              .output(newpath)
              .videoCodec('libx264')
              .size('426x240')
              .on('start', function() {
                  console.log('started');
              })
              .on('error', function(err) {
                  console.log('An error occurred: ' + err.message);
                  res.status(400);
                  res.json({
                    message: `An error occoured with video ${file.name}`
                  })
              })
              .on('progress', function(progress) {
                  console.log('... frames: ' + progress.frames);

              })
              .on('end', function() {
                resolve();//console.log('Finished processing');

              })
              .run();
            });
            console.log('Finished processing');
            /*fs.rename(oldpath, newpath, function (err) {
              if (err) throw err;
              console.log("done " + err)
            });*/
          }
        }
        console.log("done!")
        res.json({ message: 'Successfully uploaded all' })
        /*var oldpath = files.file.path;
        var newpath = 'src/client/static/clips/' + files.file.name;
        if (!oldpath.name || oldpath.name.match(/\.(jpg|jpeg|png)$/i)) {
          console.log("the file is an image");
          fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            console.log("done " + err)

          });
        } else {
          throw new ServerError("the file is not an image", { status: 400 })
          console.log("the file is not an image");
        }*/
      })
    } catch (error) {
      console.log(error)
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
