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

# create route that returns a geoJson dataset
# @app.route("/geojson")
# def geojson():

#     return render_template("index.html")

# create route that returns json data from database
@app.route("/data")
def data():

    # Create Engine
    # engine = create_engine(f"sqlite:///mass_shooting.sqlite")

    engine = create_engine(f"sqlite:///data/msa.sqlite")

    # Connect to the engine
    conn = engine.connect()

    # Start a session
    session = Session(bind=engine)

    # Create variables for the dictionary
    # lng = session.query(Shooting.longitude).all()
    # lat = session.query(Shooting.latitude).all()
    # killed = session.query(Shooting.number_killed).all()
    # injured = session.query(Shooting.number_injured).all
    # date = session.query(Shooting.incident_date).all()
    # state = session.query(Shooting.state).all()
    # locale = session.query(Shooting.city_county).all()

    # data = pd.read_sql("SELECT * FROM Mass_Shooting_Data_USA", conn)
    data = pd.read_sql("SELECT * FROM msa", conn)
    data_json = data.to_json(orient='records', date_format='iso')
    msa_json = Response(response=data_json, status=200, mimetype='application/json')

    # date = pd.read_sql("SELECT incident_date FROM Mass_Shooting_Data_USA", conn)
    # state = pd.read_sql("SELECT state FROM Mass_Shooting_Data_USA", conn)
    # locale = pd.read_sql("SELECT city_county FROM Mass_Shooting_Data_USA", conn)
    # killed = pd.read_sql("SELECT number_killed FROM Mass_Shooting_Data_USA", conn)
    # injured = pd.read_sql("SELECT number_injured FROM Mass_Shooting_Data_USA", conn)
    # lat = pd.read_sql("SELECT latitude FROM Mass_Shooting_Data_USA", conn)
    # lng = pd.read_sql("SELECT longitude FROM Mass_Shooting_Data_USA", conn)

    # data = data.drop(['index', 'Unnamed: 0'], axis = 1)
    
    # data_json = data.to_json(orient='records')
    # data_json = json.loads(data_json, mimetype='application/json')
    # data_json = json.loads(data.to_json(orient='records'))
    # data = jsonify(data)
    # data_json = data.to_json(orient='records')
    # data_json = (data.to_json(orient='records'), mimetype='application/json')
    # data_json = (data_json, mimetype='application/json'))
    # data_json =  make_response(json.dumps(data))
    # data_json.headers['content-type'] = application/json
    


    # Create dictionary to be returned
    # incident_list = {'date': date,
    #             'state': state,
    #             'city_county': locale,
    #             'killed': killed,
    #             'injured': injured,
    #             'latitude': lat,
    #             'longitude': lng}

    # # Create dictionary to be returned
    # incident_list = {'date': data['incident_date'].tolist(),
    #     'state': data['state'].tolist(),
    #     'city_county': data['city_county'].tolist(),
    #     'killed': data['number_killed'].tolist(),
    #     'injured': data['number_injured'].tolist(),
    #     'latitude': data['latitude'].tolist(),
    #     'longitude': data['longitude'].tolist()}


    # data = jsonify(incident_list)

    # Close session
    session.close()

    return msa_json
    # return response
    # return data_json
    # return jsonify(incident_list)

if __name__ == "__main__":
    app.run(debug=True)