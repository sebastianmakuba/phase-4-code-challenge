# import random
# from hero import Hero
# from power import Power
# from hero_power import HeroPower
# from app import app
# from config import db

# app.app_context().push()

# # Create some powers
# powers = [
#     {'name': 'super strength', 'description': 'gives the wielder super-human strengths'},
#     {'name': 'flight', 'description': 'gives the wielder the ability to fly through the skies at supersonic speed'},
#     {'name': 'super human senses', 'description': 'allows the wielder to use her senses at a super-human level'},
#     {'name': 'elasticity', 'description': 'can stretch the human body to extreme lengths'}
# ]

# for power_data in powers:
#     power = Power(**power_data)
#     db.session.add(power)

# # Create some heroes
# heroes = [
#     {'name': 'Kamala Khan', 'super_name': 'Ms. Marvel'},
#     {'name': 'Doreen Green', 'super_name': 'Squirrel Girl'},
#     {'name': 'Gwen Stacy', 'super_name': 'Spider-Gwen'},
#     {'name': 'Janet Van Dyne', 'super_name': 'The Wasp'},
#     {'name': 'Wanda Maximoff', 'super_name': 'Scarlet Witch'},
#     {'name': 'Carol Danvers', 'super_name': 'Captain Marvel'},
#     {'name': 'Jean Grey', 'super_name': 'Dark Phoenix'},
#     {'name': 'Ororo Munroe', 'super_name': 'Storm'},
#     {'name': 'Kitty Pryde', 'super_name': 'Shadowcat'},
#     {'name': 'Elektra Natchios', 'super_name': 'Elektra'}
# ]

# for hero_data in heroes:
#     hero = Hero(**hero_data)
#     db.session.add(hero)

# # Commit the changes for powers and heroes to the database
# db.session.commit()

# # Create associations between heroes and powers
# strengths = ['Strong', 'Weak', 'Average']

# for hero in Hero.query.all():
#     for _ in range(1, 4):  # Randomly associate heroes with powers (1 to 3 powers)
#         power = random.choice(powers)  # Choose a random power from the list
#         strength = random.choice(strengths)
        
#         # Query for the Hero and Power objects
#         hero = Hero.query.filter_by(name=hero.name).first()
#         power = Power.query.filter_by(name=power['name']).first()
        
#         # Create HeroPower instances using the queried objects
#         hero_power = HeroPower(strength=strength, hero=hero, power=power)
#         db.session.add(hero_power)

# # Commit the changes for hero powers to the database
# db.session.commit()

# print('🦸‍♀️ Seeding complete!')
import random
from hero import Hero
from power import Power
from hero_power import HeroPower
from app import app
from config import db

app.app_context().push()

# Create some powers
powers = [
    {'name': 'super strength', 'description': 'gives the wielder super-human strengths'},
    {'name': 'flight', 'description': 'gives the wielder the ability to fly through the skies at supersonic speed'},
    {'name': 'super human senses', 'description': 'allows the wielder to use her senses at a super-human level'},
    {'name': 'elasticity', 'description': 'can stretch the human body to extreme lengths'}
]

for power_data in powers:
    power = Power(**power_data)
    db.session.add(power)

# Create some heroes
heroes = [
    {'name': 'Kamala Khan', 'super_name': 'Ms. Marvel'},
    {'name': 'Doreen Green', 'super_name': 'Squirrel Girl'},
    {'name': 'Gwen Stacy', 'super_name': 'Spider-Gwen'},
    {'name': 'Janet Van Dyne', 'super_name': 'The Wasp'},
    {'name': 'Wanda Maximoff', 'super_name': 'Scarlet Witch'},
    {'name': 'Carol Danvers', 'super_name': 'Captain Marvel'},
    {'name': 'Jean Grey', 'super_name': 'Dark Phoenix'},
    {'name': 'Ororo Munroe', 'super_name': 'Storm'},
    {'name': 'Kitty Pryde', 'super_name': 'Shadowcat'},
    {'name': 'Elektra Natchios', 'super_name': 'Elektra'}
]

for hero_data in heroes:
    hero = Hero(**hero_data)
    db.session.add(hero)

# Commit the changes for powers and heroes to the database
db.session.commit()

# Create associations between heroes and powers with strengths
strengths = ['Strong', 'Weak', 'Average']

for hero in Hero.query.all():
    for _ in range(1, 4):  # Randomly associate heroes with powers (1 to 3 powers)
        power = random.choice(Power.query.all())  # Choose a random power from the list
        strength = random.choice(strengths)

        # Create HeroPower instances using relationship attributes
        hero_power = HeroPower(hero=hero, power=power, strength=strength)
        db.session.add(hero_power)

# Commit the changes for hero powers to the database
db.session.commit()

print('🦸‍♀️ Seeding complete!')
