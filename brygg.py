from flask import Flask
from flask import render_template
from flask import request,session
from flask import make_response
import re
import thread
import traceback
import StringIO
import json
from werkzeug.routing import BaseConverter
import time

P=0.2

app = Flask(__name__)

coords=[]
run_start=None

@app.route('/')
def root():    
    return render_template('index.html',coords=coords)
    
@app.route(r'/save',methods=["POST"])
def save():
    global coords
    targetpath=json.loads(request.form['data'])
    coords=list()
    for minute,degc in targetpath:
        coords.append([minute,degc])
    
    return json.dumps({'status':'OK'})

@app.route(r'/play',methods=["POST"])
def play():
    global run_start
    if run_start==None:    
        run_start=time.time()
    else:
        run_start=None
    return json.dumps({'status':'OK'})

@app.route(r'/rewind',methods=["POST"])
def rewind():
    global run_start
    if run_start!=None:
        run_start+=60
    else:
        run_start=time.time()
    
    return json.dumps({'status':'OK'})

@app.route(r'/forward',methods=["POST"])
def forward():
    global run_start
    if run_start!=None:
        run_start-=60
    else:
        run_start=time.time()
    return json.dumps({'status':'OK'})

def getTargetPathAt(timenow):
    targetpath=coords
    if len(targetpath)==0:
        return 0
    if len(targetpath)==1:
        return targetpath[0][1]           
    for i in xrange(len(targetpath)-1):
        a=targetpath[i]
        b=targetpath[i+1]
        
        amin=a[0]
        bmin=b[0]
        adeg=a[1]
        bdeg=b[1]
        
        if (timenow>=amin and timenow<=bmin):
            p=(timenow-amin)/float(bmin-amin)
            deg=adeg + (bdeg-adeg)*p

            return deg;

    if (timenow<=targetpath[0][0]):
        return targetpath[0][1]
    if (timenow>=targetpath[len(targetpath)-1][0]):
        return targetpath[len(targetpath)-1][1]
    return 0

def measure_temp():
    return 42


curpower=0
def power_on():
    global curpower
    if curpower==0:
        print "POWER ON!"
        curpower=1
def power_off():
    global curpower
    if curpower==1:
        print "POWER OFF!"
        curpower=0
           
@app.route('/getstate')
def getstate():   
    if run_start!=None:
        tm=int(time.time()-run_start)//60
    else:
        tm=0
    return json.dumps({'curpower':curpower,'curtime':tm,'curtemp':measure_temp(),'playing': 1 if run_start!=None else 0})
    
def regulator():    
    idx=1
    while True:
        time.sleep(1)
        if run_start!=None:
            now=int(time.time()-run_start)//60
            #print "now:",now
            targetdeg=getTargetPathAt(now)                        
            meastemp=measure_temp()
            delta=targetdeg-meastemp
            #print "Measured temp:",meastemp,"target:",targetdeg,"delta:",delta
            if delta<0:
                power_off()
            else:
                pwr=P*delta * 15
                if pwr>16: pwr=16
                if pwr<0: pwr=0
                idx%=15
                idx+=1
                #print "Pwr:",pwr,"Idx:",idx
                if idx<pwr:
                    power_on()
                else:
                    power_off()            
        else:
            power_off()
        
       
if __name__ == '__main__':    
    app.debug=True
    thread.start_new_thread(regulator,())
    app.run(host="0.0.0.0",port=8012)
    

