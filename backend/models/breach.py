from datetime import datetime
from database import db

class BreachHistory(db.Model):
    __tablename__ = 'breaches_history'
    id = db.Column(db.Integer, primary_key=True)
    password_hash = db.Column(db.String(64), nullable=False)
    breach_count = db.Column(db.Integer, default=0, nullable=False)
    last_checked = db.Column(db.DateTime, default=datetime.utcnow)

    @classmethod
    def get_by_password_hash(cls, password_hash):
        return cls.query.filter_by(password_hash=password_hash).first()

    @classmethod
    def create_breach(cls, password_hash, breach_count):
        breach = cls(password_hash=password_hash, breach_count=breach_count)
        db.session.add(breach)
        db.session.commit()
        return breach

    @classmethod
    def update_breach(cls, password_hash, breach_count):
        breach = cls.query.filter_by(password_hash=password_hash).first()
        if breach:
            breach.breach_count = breach_count
            breach.last_checked = datetime.utcnow()
            db.session.commit()
        return breach
