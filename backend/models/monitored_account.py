# backend/models/monitored_account.py

from datetime import datetime
from database import db


class MonitoredAccount(db.Model):
    __tablename__ = 'monitored_accounts'

    id = db.Column(db.Integer, primary_key=True)
    # Allow null user_id now that you’ve dropped JWT auth
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),
        nullable=True,
        default=None
    )
    service_name = db.Column(db.String(100), nullable=False)
    identifier = db.Column(db.String(200), nullable=False)
    last_checked = db.Column(db.DateTime, default=None)
    alert_flag = db.Column(db.Boolean, default=False)
    details = db.Column(db.JSON, default={})
