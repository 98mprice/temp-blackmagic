import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
  clips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clip'
  }],
  name: String
}, {
  timestamps: true
})

const Video = mongoose.model('Video', videoSchema)

export default Video
