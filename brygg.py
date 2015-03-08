from flask import Flask
from flask import render_template
from flask import request,session
from flask import make_response


import traceback
import StringIO
import json
from werkzeug.routing import BaseConverter

app = Flask(__name__)
coords=[]

@app.route('/')
def root():
    return render_template('index.html')
    
@app.route(r'/save',methods=["POST"])
def save():
    
    coordinates=dict()
    for key in request.form.keys():
        value=request.form[key]
        axis,ordinal=re.match(r"(x|y)_(\d+)",key)
        axisnum=1 if axis=='y' else 0
        coordinates.setdefault(int(ordinal),[0,0])[axisnum]=float(value)
    
    coords=[]
    for coord in sorted(coordinates.items(),key=lambda x:x[0]):
        coords.append(coord)
    print coords
    
    return json.dumps('')

       
if __name__ == '__main__':    
    app.debug=True
    app.run(host="0.0.0.0",port=8011)
    
    

