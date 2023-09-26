# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy.orm import relationship, validates

# db = SQLAlchemy()

# class Hero(db.Model):
#     __tablename__ = 'hero'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(255), nullable=False)
#     super_name = db.Column(db.String(255), nullable=False)

#     # Define the many-to-many relationship with HeroPower
#     powers = relationship('Power', secondary='hero_power', back_populates='heroes')

# class Power(db.Model):
#     __tablename__ = 'power'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(255), nullable=False)
#     description = db.Column(db.String(255), nullable=False)

#     # Define the many-to-many relationship with HeroPower
#     heroes = relationship('Hero', secondary='hero_power', back_populates='powers')

# class HeroPower(db.Model):
#     __tablename__ = 'hero_power'

#     id = db.Column(db.Integer, primary_key=True)
#     hero_id = db.Column(db.Integer, db.ForeignKey('hero.id'), nullable=False)
#     power_id = db.Column(db.Integer, db.ForeignKey('power.id'), nullable=False)
#     strength = db.Column(db.String(255), nullable=False)

#     # Define the many-to-one relationship with Hero
#     hero = relationship('Hero', backref='powers')

#     # Define the many-to-one relationship with Power
#     power = relationship('Power', backref='heroes')

#     @validates('strength')
#     def validate_strength(self, key, value):
#         allowed_strengths = ['Strong', 'Weak', 'Average']
#         if value not in allowed_strengths:
#             raise ValueError("Invalid strength value")
#         return value

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates

db = SQLAlchemy()

class Hero(db.Model):
    __tablename__ = 'hero'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    super_name = db.Column(db.String(255), nullable=False)

    powers = db.relationship('Power', secondary='hero_power', back_populates='heroes')

class Power(db.Model):
    __tablename__ = 'power'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)

    heroes = db.relationship('Hero', secondary='hero_power', back_populates='powers')

class HeroPower(db.Model):
    __tablename__ = 'hero_power'

    id = db.Column(db.Integer, primary_key=True)
    hero_id = db.Column(db.Integer, db.ForeignKey('hero.id'), nullable=False)
    power_id = db.Column(db.Integer, db.ForeignKey('power.id'), nullable=False)
    strength = db.Column(db.String(255), nullable=False)

    @validates('strength')
    def validate_strength(self, key, value):
        allowed_strengths = ['Strong', 'Weak', 'Average']
        if value not in allowed_strengths:
            raise ValueError("Invalid strength value")
        return value
