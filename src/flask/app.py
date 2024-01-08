from flask import Flask
import pickle
# Load the machine learning model from 'model.pkl'
with open('./model.pkl', 'rb') as f:
	model = pickle.load(f)
	# Create a Flask app
	app = Flask(__name__)
	# Import routes from the 'routes' module
	from routes import *
	if __name__ == '__main__':
		app.run(debug=True)

