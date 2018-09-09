from flask import Flask, abort, request
import os
import os.path
import json
import face_recognition
import srt
import subprocess
from datetime import datetime

app = Flask(__name__)

@app.route('/find_face', methods=["POST"])
def find_face():
	if not request.json:
		abort(400)
	print request.json['image_src']
	path = '../node/src/client/static' + request.json['image_src']
	print 'path', path
	image = face_recognition.load_image_file(path)
	face_locations = face_recognition.face_locations(image)
	if len(face_locations) > 0:
		return json.dumps(True)
	else:
		return json.dumps(False)

@app.route('/generate_transcript', methods=["POST"])
def generate_transcript():
	if not request.json:
		abort(400)
	print request.json['clip_srcs']
	transcript_srcs = []
	for file_src in request.json['clip_srcs']:
		transcript_src = run_autosub(file_src)
		if transcript_src == None:
			abort(400)
		else:
			transcript_srcs.append(transcript_src)
	return json.dumps(transcript_srcs)

def run_autosub(file_src):
	try:
		filename, file_extension = os.path.splitext(file_src)
		print "../node/src/client/static/transcripts/%s.srt" % filename
		path = "../node/src/client/static/transcripts/%s.srt" % filename
		if os.path.isfile(path) and os.access(path, os.R_OK):
			print "File exists and is readable"
			return "transcripts/%s.srt" % filename
		else:
			print "Either the file is missing or not readable"
			bashCommand = "autosub ../node/src/client/static/clips/%s -o %s" % (file_src, path)
			process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
			output, error = process.communicate()
			if error != None:
				return None
			else:
				return "transcripts/%s.srt" % filename
	except:
		return None

@app.route('/generate_transcript', methods=["POST"])
def generate_transcript():
	if not request.json:
		abort(400)
	print request.json['clip_srcs']
	transcript_srcs = []
	for file_src in request.json['clip_srcs']:
		transcript_src = run_autosub(file_src)
		if transcript_src == None:
			abort(400)
		else:
			transcript_srcs.append(transcript_src)
	return json.dumps(transcript_srcs)

@app.route('/talking_periods', methods=["POST"])
def talking_periods():
	if not request.json:
		abort(400)
	print request.json['clip_src']
	transcript_src = run_autosub(request.json['clip_src'])
	print 'transcript_src', transcript_src
	with open("../node/src/client/static/%s" % transcript_src, 'r') as file:
	    data = file.read()
	subtitle_generator = srt.parse(data)
	subtitles = list(subtitle_generator)
	talking_periods = []
	prev_end_time = subtitles[0].end
	period_start_time = subtitles[0].start
	iter_subtitles = iter(subtitles)
	next(iter_subtitles)
	for subtitle in iter_subtitles:
	    diff = subtitle.start - prev_end_time
	    if diff.total_seconds() > 10:
	        talking_periods.append((period_start_time, prev_end_time))
	        period_start_time = subtitle.start
	    prev_end_time = subtitle.end
	print talking_periods
	return json.dumps(talking_periods, indent=4, sort_keys=True, default=str)

if __name__ == "__main__":
	app.run(port=5000, debug=True)
