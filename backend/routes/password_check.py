from flask import Blueprint, request, jsonify
from utils.api_calls import check_pwned_password
from utils.security import check_password_strength

password_check_bp = Blueprint('password_check', __name__, url_prefix='/password_check')

@password_check_bp.route('/check', methods=['POST'])
def check_password():
    data = request.get_json()
    password = data.get('password')

    if not password:
        return jsonify({"error": "Password is required"}), 400

    breach_count = check_pwned_password(password)
    strength_score, feedback = check_password_strength(password)

    return jsonify({
        "password": password,
        "breach_count": breach_count,
        "strength_score": strength_score,
        "feedback": feedback,
        "safe": breach_count == 0,
        "message": "✅ Password is strong and not found in breaches." if breach_count == 0 else f"⚠️ Password weak or breached!"
    })
