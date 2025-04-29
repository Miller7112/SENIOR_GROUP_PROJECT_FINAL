from database import db


class PasswordVault(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    website = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
