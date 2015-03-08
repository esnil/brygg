from flask import Flask
from flask import render_template
from flask import request,session
from flask import make_response


import traceback
import StringIO

from werkzeug.routing import BaseConverter

app = Flask(__name__)

@app.route('/')
def root():
    return render_template('index.html')
    
    
       
if __name__ == '__main__':    
    app.debug=True
    app.run(host="0.0.0.0",port=8012)
    
    

