# import necessary libraries
import pandas as pd
from flask import json
from flask import Flask, render_template, jsonify, Response, make_response
import sqlalchemy
import flask
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, Column, Integer, String, Float, Date, DateTime 

# create instance of Flask app
app = Flask(__name__)


# create route that renders index.html template
@app.route("/")
def index():

    return render_template("index.html")

# create route that returns json data from database
@app.route("/data")
def data():

    engine = create_engine(f"sqlite:///static/data/msa.sqlite")

    # Connect to the engine
    conn = engine.connect()

    # Start a session
    session = Session(bind=engine)

    data = pd.read_sql("SELECT * FROM msa", conn)
    data_json = data.to_json(orient='records', date_format='iso')
    msa_json = Response(response=data_json, status=200, mimetype='application/json')

    # Close session
    session.close()

    return msa_json

@app.route("/guns")
def guns():

    engine = create_engine(f"sqlite:///static/data/msa.sqlite")

    # Connect to the engine
    conn = engine.connect()

    # Start a session
    session = Session(bind=engine)

    data = pd.read_sql("SELECT * FROM ownership_data", conn)
    data_json = data.to_json(orient='records', date_format='iso')
    guns_json = Response(response=data_json, status=200, mimetype='application/json')

    # Close session
    session.close()

    return guns_json

@app.route("/poverty")
def poverty():

    engine = create_engine(f"sqlite:///static/data/msa.sqlite")

    # Connect to the engine
    conn = engine.connect()

    # Start a session
    session = Session(bind=engine)

    data = pd.read_sql("SELECT * FROM poverty_data", conn)
    data_json = data.to_json(orient='records', date_format='iso')
    poverty_json = Response(response=data_json, status=200, mimetype='application/json')

    # Close session
    session.close()

    return poverty_json

@app.route("/election")
def election():

    engine = create_engine(f"sqlite:///static/data/msa.sqlite")

    # Connect to the engine
    conn = engine.connect()

    # Start a session
    session = Session(bind=engine)

    data = pd.read_sql("SELECT * FROM election_data", conn)
    data_json = data.to_json(orient='records', date_format='iso')
    election_json = Response(response=data_json, status=200, mimetype='application/json')

    # Close session
    session.close()

    return election_json

@app.route("/state")
def state():

    engine = create_engine(f"sqlite:///static/data/msa.sqlite")

    # Connect to the engine
    conn = engine.connect()

    # Start a session
    session = Session(bind=engine)

    data = pd.read_sql("SELECT * FROM state_data", conn)
    data_json = data.to_json(orient='records', date_format='iso')
    state_json = Response(response=data_json, status=200, mimetype='application/json')

    # Close session
    session.close()

    return state_json


if __name__ == "__main__":
    app.run(debug=True)