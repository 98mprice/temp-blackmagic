from flask import Flask, abort, request
import json
import face_recognition

app = Flask(__name__)

@app.route('/find_face', methods=["POST"])
def find_face():
	if not request.json:
        abort(400)
	print request.json.image_src
	return False
	'''image = face_recognition.load_image_file(request.json.image_src)
	face_locations = face_recognition.face_locations(image)
	if len(face_locations) > 0:
		return True
	else:
		return False'''

if __name__ == "__main__":
	app.run(port=5000, debug=True)
