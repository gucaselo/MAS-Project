# import necessary libraries
from flask import Flask, render_template, jsonify
import sqlalchemy
from sqlalchemy import create_engine, inspect
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

# create instance of Flask app
app = Flask(__name__)

# create route that renders index.html template
@app.route("/jsonified")

def jsonified():

    # Create Engine
    engine = create_engine("sqlite:///data/shootings.sqlite")

    # Connect to the engine
    conn = engine.connect()

    # Start a session
    session = Session(bind=engine)

    # Declare a Base using `automap_base()`
    Base = automap_base()

    # Use the Base class to reflect the database tables
    Base.prepare(engine, reflect=True)

    print(Base.classes.keys())

    # Assign class to variable data
    data = Base.classes.shooting_data
    guns = Base.classes.ownership_data
    poverty = Base.classes.poverty_data

    # Create variables for the shooting incident dictionary
    lng = session.query(data.longitude).all()
    lat = session.query(data.latitude).all()
    killed = session.query(data.number_killed).all()
    injured = session.query(data.number_injured).all
    date = session.query(data.incident_date).all()
    state = session.query(data.state).all()
    locale = session.query(data.city_county).all()

    # Create variables for the gun ownership dictionary
    gun_states = session.query(guns.state).all()
    gun_capita = session.query(guns.number_per_capita).all()

    # Create variables for the poverty rate dictionary
    poverty_states = session.query(poverty.state).all()
    poverty_rates = session.query(poverty.poverty_rate).all()

    # Create shooting data dictionary to be returned
    incident_list = {'date': date,
                'state': state,
                'city_county': locale,
                'killed': killed,
                'injured': injured,
                'latitude': lat,
                'longitude': lng}
    
    # Create gun ownership dictionary to be returned
    gun_list = {'state': gun_states,
                'num_guns': gun_capita}
    
    # Create poverty rate dictionary to be returned
    poverty_list = {'state' : poverty_states,
               'poverty_rates': poverty_rates}

    # Close session
    session.close()

    return render_template("index.html", shootingdata=jsonify(incident_list),
    gundata = jsonify(gun_list), povertydata = jsonify(poverty_list))

if __name__ == "__main__":
    app.run(debug=True)