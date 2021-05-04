# import necessary libraries
from flask import Flask, render_template, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, Column, Integer, String, Float, DateTime 

# create instance of Flask app
app = Flask(__name__)

# create route that renders index.html template
@app.route("/jsonified")

def jsonified():

    # Create Engine
    engine = create_engine(f"sqlite:///data/mass_shooting.sqlite")

    # Sets an object to utilize the default declarative base in SQL Alchemy
    Base = declarative_base()

    # Creates Classes which will serve as the anchor points for our table
    class Shooting(Base):
    __tablename__ = 'Mass_Shooting_Data_USA'
    IncidentID = Column(Integer, primary_key = True)
    IncidentDate = Column(String(255))
    State = Column(String(255))
    CityOrCounty = Column(String(255))
    Address = Column(String(255))
    NumKilled = Column(Integer)
    NumInjured = Column(Integer)
    latitude = Column(Float)
    longitude = Column(Float)

    # Connect to the engine
    conn = engine.connect()

    # Create (if not already in existence) the tables associated with our classes.
    Base.metadata.create_all(engine)

    # Start a session
    session = Session(bind=engine)

    # Create an instance of the Shooting Class
    test = Shooting(IncidentID = 1111111, IncidentDate = '01/01/2022', State = 'test',
            CityOrCounty = 'test', Address = 'test', NumKilled = 0, NumInjured = 0,
            latitude = 0.0, longitude = 0.0)

    # Create (if not already in existence) the tables associated with our classes.
    Base.metadata.create_all(engine)

    # Add and commit instance to the database
    session.add(test)
    session.commit()

    # Create variables for the dictionary
    lng = session.query(Shooting.longitude).all()
    lat = session.query(Shooting.latitude).all()
    killed = session.query(Shooting.NumKilled).all()
    injured = session.query(Shooting.NumInjured).all()
    incident_date = session.query(Shooting.IncidentDate).all()
    state = session.query(Shooting.State).all()
    locale = session.query(Shooting.CityOrCounty).all()

    # Create dictionary to be returned
    incident_list = {'Date': incident_date,
                'Location': state,
                'Locale': locale,
                'Killed': killed,
                'Injured': injured,
                'Latitude': lat,
                'Longitude': lng}
    
    # Close session
    session.close()

return render_template("index.html", data=jsonify(incident_list))

if __name__ == "__main__":
    app.run(debug=True)