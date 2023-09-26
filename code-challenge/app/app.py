from flask import Flask, request, jsonify, make_response
from flask_migrate import Migrate
from hero import Hero
from power import Power
from hero_power import HeroPower
from config import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)

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
# Implement the GET /heroes/:id route
@app.route('/heroes/<int:id>', methods=['GET'])
def get_hero(id):
    hero = Hero.query.get(id)
    if not hero:
        return make_response(jsonify({'error': 'Hero not found'}), 404)
    
    hero_data = {
        'id': hero.id,
        'name': hero.name,
        'super_name': hero.super_name,
        'powers': [{'id': hero_power.power.id, 'name': hero_power.power.name, 'description': hero_power.power.description, 'strength': hero_power.strength} for hero_power in hero.hero_powers]
    }
    
    return jsonify(hero_data)




# Implement the GET /powers route
@app.route('/powers', methods=['GET'])
def get_powers():
    powers = Power.query.all()
    power_list = [{'id': power.id, 'name': power.name, 'description': power.description} for power in powers]
    return jsonify(power_list)

# Implement the GET /powers/:id route
@app.route('/powers/<int:id>', methods=['GET'])
def get_power(id):
    power = Power.query.get(id)
    if not power:
        return make_response(jsonify({'error': 'Power not found'}), 404)
    
    power_data = {
        'id': power.id,
        'name': power.name,
        'description': power.description,
    }
    
    return jsonify(power_data)

# Implement the PATCH /powers/:id route
@app.route('/powers/<int:id>', methods=['PATCH'])
def update_power(id):
    power = Power.query.get(id)
    if not power:
        return make_response(jsonify({'error': 'Power not found'}), 404)
    
    data = request.get_json()
    if 'description' not in data:
        return make_response(jsonify({'error': 'Description not provided'}), 400)

    power.description = data['description']
    
    try:
        db.session.commit()
        return jsonify({'id': power.id, 'name': power.name, 'description': power.description})
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'errors': ['Validation errors']}), 400)

# Implement the POST /hero_powers route
@app.route('/hero_powers', methods=['POST'])
def create_hero_power():
    data = request.get_json()
    if not all(key in data for key in ['strength', 'power_id', 'hero_id']):
        return make_response(jsonify({'error': 'Invalid request data'}), 400)

    try:
        hero_power = HeroPower(
            strength=data['strength'],
            power_id=data['power_id'],
            hero_id=data['hero_id']
        )
        db.session.add(hero_power)
        db.session.commit()
        
        hero = Hero.query.get(data['hero_id'])
        hero_data = {
            'id': hero.id,
            'name': hero.name,
            'super_name': hero.super_name,
            'powers': [{'id': power.id, 'name': power.name, 'description': power.description} for power in hero.powers]
        }
        
        return jsonify(hero_data)
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({'errors': ['Validation errors']}), 400)

if __name__ == '__main__':
    app.run(port=5500)
