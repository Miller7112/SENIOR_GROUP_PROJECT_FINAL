# backend/routes/monitoring.py

from flask import Blueprint, request, jsonify
from models.monitored_account import MonitoredAccount
from database import db
from datetime import datetime
import requests
from config import Config

monitoring_bp = Blueprint('monitoring', __name__, url_prefix='/monitoring')


# Health-check (optional)
@monitoring_bp.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "OK"}), 200


# 1) List all monitored accounts
@monitoring_bp.route('/accounts', methods=['GET'])
def list_accounts():
    raw = MonitoredAccount.query.all()
    accounts = [{
        "id":           a.id,
        "service_name": a.service_name,
        "identifier":   a.identifier,
        "last_checked": a.last_checked.isoformat() if a.last_checked else None,
        "alert_flag":   a.alert_flag,
        "details":      a.details
    } for a in raw]
    return jsonify(accounts), 200


# 2) Add a new account to monitor
@monitoring_bp.route('/accounts', methods=['POST'])
def add_account():
    data = request.get_json() or {}
    if 'service_name' not in data or 'identifier' not in data:
        return jsonify({"message": "service_name and identifier required"}), 400

    new_acc = MonitoredAccount(
        service_name=data['service_name'],
        identifier=data['identifier']
    )
    db.session.add(new_acc)
    db.session.commit()
    return jsonify({"message": "Added", "id": new_acc.id}), 201


# 3) Trigger an on-demand breach check for all accounts
@monitoring_bp.route('/check', methods=['POST'])
def run_check():
    accounts = MonitoredAccount.query.all()
    results = []

    headers = {
        'hibp-api-key': Config.HIBP_API_KEY,
        'User-Agent':   'PersonalSecurityDashboard',
        'Accept':       'application/json'
    }
    params = {
        'truncateResponse': False,
        'includeUnverified': True
    }

    for a in accounts:
        print(f"🔍 Checking HIBP for '{a.identifier}'…")
        url = f'https://haveibeenpwned.com/api/v3/breachedaccount/{a.identifier}'
        resp = requests.get(url, headers=headers, params=params)
        print("   → HIBP status:", resp.status_code)

        if resp.status_code == 200:
            breaches = resp.json()
            breached = True
            breach_count = len(breaches)
        elif resp.status_code == 404:
            breaches = []
            breached = False
            breach_count = 0
        else:
            print(f"   ⚠️ Unexpected HIBP status {resp.status_code}, skipping")
            continue

        a.last_checked = datetime.utcnow()
        a.alert_flag = breached
        a.details = breaches
        db.session.commit()

        results.append({
            'id':           a.id,
            'service_name': a.service_name,
            'identifier':   a.identifier,
            'breached':     breached,
            'breach_count': breach_count,
            'last_checked': a.last_checked.isoformat()
        })

    print("✅ run_check results:", results)
    return jsonify(results), 200


# 4) Delete a monitored account by its ID
@monitoring_bp.route('/accounts/<int:acct_id>', methods=['DELETE'])
def delete_account(acct_id):
    acct = MonitoredAccount.query.get_or_404(acct_id)
    db.session.delete(acct)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200
