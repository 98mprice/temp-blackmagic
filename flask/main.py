from flask import Flask, abort, request
import json
import face_recognition

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

if __name__ == "__main__":
	app.run(port=5000, debug=True)
