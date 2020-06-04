from flask import Flask
from api import predict_func

app = Flask(__name__)

@app.route('/detect')
def detect():
    return predict_func()

if __name__ == '__main__':
    import waitress
    print('http://localhost:8888/detect')
    waitress.serve(app, host='127.0.0.1', port=8888)