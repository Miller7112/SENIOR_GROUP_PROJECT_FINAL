from flask import Blueprint, request, jsonify
from database import db
from models.password_vault import PasswordVault

vault_bp = Blueprint('vault', __name__, url_prefix='/vault')

@vault_bp.route('/add', methods=['POST'])
def add_password():
    data = request.get_json()
    website = data.get('website')
    username = data.get('username')
    password = data.get('password')

    if not website or not username or not password:
        return jsonify({'error': 'Missing fields'}), 400

    new_entry = PasswordVault(
        website=website,
        username=username,
        password=password
    )
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({'message': 'Password added successfully!'}), 201

@vault_bp.route('/list', methods=['GET'])
def list_passwords():
    passwords = PasswordVault.query.all()
    return jsonify([
        {
            'id': p.id,
            'website': p.website,
            'username': p.username,
            'password': p.password
        } for p in passwords
    ])

@vault_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_password(id):
    password_entry = PasswordVault.query.get(id)

    if not password_entry:
        return jsonify({'error': 'Password entry not found'}), 404

    db.session.delete(password_entry)
    db.session.commit()

    return jsonify({'message': 'Password entry deleted successfully!'}), 200
