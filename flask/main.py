from flask import Flask, abort, request
import os
import os.path
import json
import face_recognition
import srt
import subprocess
from datetime import datetime
import sys
import numpy as np
sys.path.append('/usr/local/lib/python2.7/site-packages')
import cv2

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

def run_face_detection(name):


@app.route('/face_periods', methods=["POST"])
def face_periods():
	if not request.json:
		abort(400)
	print request.json['clip_srcs']
	name = request.json['clip_srcs'][0]
	path = "../node/src/client/static/face_periods/%s.npy" % name
	if os.path.isfile(path) and os.access(path, os.R_OK):
		print "Found it"
		return "face_periods/%s.npy" % name
	else:
		print "Couldn't find it, scanning"
		# Open the input movie file
		input_movie = cv2.VideoCapture('../node/src/client/static/clips/%s' % name)
		length = int(input_movie.get(cv2.CAP_PROP_FRAME_COUNT))

		# Create an output movie file (make sure resolution/frame rate matches input video!)
		fourcc = cv2.VideoWriter_fourcc(*'XVID')
		output_movie = cv2.VideoWriter('../node/src/client/static/videos/output.avi', fourcc, 29.97, (640, 360))

		# Load some sample pictures and learn how to recognize them.
		known_faces = []
		known_names = []
		person_log = { }
		for person in request.json['people']:
			lmm_image = face_recognition.load_image_file('../node/src/client/static/people/%s' % person['image_src'])
			lmm_face_encoding = face_recognition.face_encodings(lmm_image)[0]
			known_faces.append(lmm_face_encoding)
			known_names.append(person['name'])
			person_log[person['name']] = {
				"start_frame": None,
				"end_frame": None,
				"log": []
			}

		# Initialize some variables
		face_locations = []
		face_encodings = []
		face_names = []
		frame_number = 0
		while True:
			# Grab a single frame of video
			ret, frame = input_movie.read()
			frame_number += 1

			# Quit when the input video file ends
			if not ret:
				break

			# Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
			rgb_frame = frame[:, :, ::-1]

			# Find all the faces and face encodings in the current frame of video
			face_locations = face_recognition.face_locations(rgb_frame)
			face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

			face_names = []
			for face_encoding in face_encodings:
				# See if the face is a match for the known face(s)
				match = face_recognition.compare_faces(known_faces, face_encoding, tolerance=0.50)

				# If you had more than 2 faces, you could make this logic a lot prettier
				# but I kept it simple for the demo
				name = None
				#print np.nonzero(np.array(match))
				name = known_names[np.array(match).argmax()]
				if person_log[name]["start_frame"] == None:
					person_log[name]["start_frame"] = frame_number
				person_log[name]["end_frame"] = frame_number
				for key in person_log:
					x = person_log[key]
					if x["end_frame"] != None:
						last_seen = frame_number - x["end_frame"]
						if last_seen > 30:
							x["log"].append((x["start_frame"], x["end_frame"]))
							x["start_frame"] = None
							x["end_frame"] = None
				'''if match[0]:
				    name = "Lin-Manuel Miranda"
				elif match[1]:
				    name = "Alex Lacamoire"'''

				face_names.append(name)

			# Label the results
			for (top, right, bottom, left), name in zip(face_locations, face_names):
				if not name:
					continue

				# Draw a box around the face
				cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

				# Draw a label with a name below the face
				cv2.rectangle(frame, (left, bottom - 25), (right, bottom), (0, 0, 255), cv2.FILLED)
				font = cv2.FONT_HERSHEY_DUPLEX
				cv2.putText(frame, name, (left + 6, bottom - 6), font, 0.5, (255, 255, 255), 1)

			# Write the resulting image to the output video file
			print("Writing frame {} / {}".format(frame_number, length))
			output_movie.write(frame)

		# All done!
		input_movie.release()
		cv2.destroyAllWindows()

		print person_log
		np.save("../node/src/client/static/face_periods/%s.npy" % name, np.array(person_log))

		return "face_periods/%s.npy" % name

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

def parse_srt(path):
	with open("../node/src/client/static/%s" % path, 'r') as file:
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
	return talking_periods

@app.route('/talking_periods', methods=["POST"])
def talking_periods():
	if not request.json:
		abort(400)
	print request.json['clip_src']
	transcript_src = run_autosub(request.json['clip_src'])
	print 'transcript_src', transcript_src
	talking_periods = parse_srt(transcript_src)
	return json.dumps(talking_periods, indent=4, sort_keys=True, default=str)

@app.route('/people_periods', methods=["POST"])
def people_periods():
	if not request.json:
		abort(400)
	transcript_src = run_autosub(request.json['clip_srcs'][0])
	talking_periods = parse_srt(transcript_src)
	input_movie = cv2.VideoCapture('../node/src/client/static/clips/%s' % request.json['clip_srcs'][0])
	fps = int(round(input_movie.get(cv2.CAP_PROP_FPS)))
	for talking_period in talking_periods:
		#print talking_period[0].seconds
		frame_talking_period = (fps*talking_period[0].seconds, fps*talking_period[1].seconds)
		print frame_talking_period


if __name__ == "__main__":
	app.run(port=5000, debug=True)
