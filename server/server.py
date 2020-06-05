from flask import Flask
from api import predict_func
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/detect')
def detect():
    return predict_func()

if __name__ == '__main__':
    import waitress
    print('http://localhost:8888/detect')
    waitress.serve(app, host='127.0.0.1', port=8888)