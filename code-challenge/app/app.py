from flask import Flask, request, jsonify, make_response
from flask_migrate import Migrate
from hero import Hero
from power import Power
from hero_power import HeroPower
from config import db
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)
CORS(app)
db.init_app(app)

@app.route('/')
def home():
    return 'Home'

# Implement the GET /heroes route
@app.route('/heroes', methods=['GET'])
def get_heroes():
    heroes = Hero.query.all()
    hero_list = [{'id': hero.id, 'name': hero.name, 'super_name': hero.super_name} for hero in heroes]
    return jsonify(hero_list)

# Implement the GET /heroes/:id route
@app.route('/heroes/<int:id>', methods=['GET'])
def get_hero(id):
    hero = db.session.get(Hero, id)

    if not hero:
        return make_response(jsonify({'error': 'Hero not found'}), 404)
    
    hero_data = {
        'id': hero.id,
        'name': hero.name,
        'super_name': hero.super_name,
        'powers': [{'id': hero_power.power.id, 'name': hero_power.power.name, 'description': hero_power.power.description, 'strength': hero_power.strength} for hero_power in hero.hero_powers]
    }
    
    return jsonify(hero_data)

# Implement the POST /heroes route to create a new hero
@app.route('/heroes', methods=['POST'])
def create_hero():
    data = request.get_json()
    if not all(key in data for key in ['name', 'super_name']):
        return make_response(jsonify({'error': 'Invalid request data'}), 400)

    try:
        hero = Hero(name=data['name'], super_name=data['super_name'])
        db.session.add(hero)
        db.session.commit()
        response_data = {'id': hero.id, 'name': hero.name, 'super_name': hero.super_name}
        return jsonify(response_data)
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'errors': ['Validation errors']}), 400)

@app.route('/powers', methods=['GET'])
def get_all_powers():
    powers = Power.query.all()
    power_list = [{'id': power.id, 'name': power.name, 'description': power.description} for power in powers]
    return jsonify(power_list)

@app.route('/heroes/<int:id>/powers', methods=['GET'])
def get_hero_powers(id):
    hero = db.session.get(Hero, id)

    if not hero:
        return make_response(jsonify({'error': 'Hero not found'}), 404)

    hero_powers = hero.hero_powers
    powers_data = [{
        'id': hero_power.power.id,
        'name': hero_power.power.name,
        'description': hero_power.power.description,
        'strength': hero_power.strength
    } for hero_power in hero_powers]

    return jsonify(powers_data)

@app.route('/heroes/<int:id>', methods=['PATCH'])
def update_hero(id):
    hero = Hero.query.get(id)

    if not hero:
        return make_response(jsonify({'error': 'Hero not found'}), 404)

    data = request.get_json()

    if 'name' in data:
        hero.name = data['name']

    if 'super_name' in data:
        hero.super_name = data['super_name']

    try:
        db.session.commit()
        return jsonify({
            'id': hero.id,
            'name': hero.name,
            'super_name': hero.super_name,
        })
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'errors': ['Validation errors']}), 400)

@app.route('/powers/<int:id>', methods=['PUT'])
def update_power(id):
    power = db.session.get(Power, id)

    if not power:
        return make_response(jsonify({'error': 'Power not found'}), 404)
    
    data = request.get_json()

    # Update the power's description, strength, or any other attributes as needed
    if 'description' in data:
        power.description = data['description']
    if 'strength' in data:
        power.strength = data['strength']
    
    try:
        db.session.commit()
        return jsonify({
            'id': power.id,
            'name': power.name,
            'description': power.description,
            'strength': power.strength
        })
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'errors': ['Validation errors']}), 400)
    
@app.route('/hero_powers', methods=['POST'])
def create_hero_power():
    data = request.get_json()

    # Ensure that the request contains necessary data
    if not all(key in data for key in ['hero_id', 'power_id', 'strength']):
        return make_response(jsonify({'error': 'Invalid request data'}), 400)

    try:
        # Retrieve the hero and power based on IDs
        hero = Hero.query.get(data['hero_id'])
        power = Power.query.get(data['power_id'])

        # Check if hero and power exist
        if hero is None or power is None:
            return make_response(jsonify({'error': 'Hero or Power not found'}), 404)

        # Create a new HeroPower instance
        hero_power = HeroPower(hero=hero, power=power, strength=data['strength'])

        # Add to the database and commit the transaction
        db.session.add(hero_power)
        db.session.commit()

        # Return a response indicating success
        response_data = {
            'id': hero_power.id,
            'hero_id': hero_power.hero.id,
            'power_id': hero_power.power.id,
            'strength': hero_power.strength,
        }
        return jsonify(response_data)

    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'errors': ['Validation errors']}), 400)

# Implement the DELETE /heroes/:id route to delete a hero
@app.route('/heroes/<int:id>', methods=['DELETE'])
def delete_hero(id):
    hero = db.session.get(Hero, id)

    if not hero:
        return make_response(jsonify({'error': 'Hero not found'}), 404)

    # Delete related hero_power records associated with this hero
    hero_powers = HeroPower.query.filter_by(hero_id=id).all()
    for hero_power in hero_powers:
        db.session.delete(hero_power)

    try:
        # Now, delete the hero
        db.session.delete(hero)
        db.session.commit()
        return make_response(jsonify({}), 204)
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'error': 'Failed to delete hero'}), 500)


if __name__ == '__main__':
    app.run(debug=True, port=5500)
