from flask import Blueprint, request, jsonify
from utils.api_calls import check_pwned_password

breach_check_bp = Blueprint('breach_check', __name__, url_prefix='/breach_check')

@breach_check_bp.route('/check', methods=['POST'])
def check_breach():
    data = request.get_json()
    password = data.get('password')

    if not password:
        return jsonify({"error": "Password is required"}), 400

    breach_count = check_pwned_password(password)

    return jsonify({
        "password": password,
        "breach_count": breach_count,
        "safe": breach_count == 0,
        "message": "✅ Password is safe!" if breach_count == 0 else f"⚠️ Password found in {breach_count} breaches!"
    })
