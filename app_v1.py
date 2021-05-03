# import necessary libraries
from flask import Flask, render_template, jsonify
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

# create instance of Flask app
app = Flask(__name__)

# create route that renders index.html template
@app.route("/jsonified")

def jsonified():

    # Create Engine
    engine = create_engine(f"sqlite:///data/shootings.sqlite")

    # Connect to the engine
    conn = engine.connect()

    # Start a session
    session = Session(bind=engine)

    # Declare a Base using `automap_base()`
    Base = automap_base()

    # Use the Base class to reflect the database tables
    Base.prepare(engine, reflect=False)

    # Assign class to variable data
    data = Base.classes.shooting_data

    # Create variables for the dictionary
    lng = session.query(data.longitude).all()
    lat = session.query(data.latitude).all()
    killed = session.query(data.number_killed).all()
    injured = session.query(data.number_injured).all
    date = session.query(data.incident_date).all()
    state = session.query(data.state).all()
    locale = session.query(data.city_county).all()

    # Create dictionary to be returned
    incident_list = {'date': date,
                'state': state,
                'city_county': locale,
                'killed': killed,
                'injured': injured,
                'latitude': lat,
                'longitude': lng}
    
    # Close session
    session.close()

return render_template("index.html", data=jsonify(incident_list))

if __name__ == "__main__":
    app.run(debug=True)