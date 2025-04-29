from flask import Flask
from flask_cors import CORS
from config import Config
from database import db


# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
CORS(app, resources={r"/monitoring/*": {"origins": "*"}}, supports_credentials=True)

# ⬇️⛔ IMPORTANT: Models must be imported AFTER db.init_app(app)
from models.user import User
from models.password_vault import PasswordVault
from models.breach import BreachHistory
from models.monitored_account import MonitoredAccount

# ⬇️ Now create tables
with app.app_context():
    db.create_all()

# Register Blueprints
from routes.auth import auth_bp
from routes.password_check import password_check_bp
from routes.breach_check import breach_check_bp
from routes.monitoring import monitoring_bp
from routes.password_vault import vault_bp


app.register_blueprint(auth_bp)
app.register_blueprint(password_check_bp)
app.register_blueprint(breach_check_bp)
app.register_blueprint(monitoring_bp)
app.register_blueprint(vault_bp)


# Root route
@app.route('/', methods=['GET'])
def home():
    return {"message": "🚀 Welcome to Security Dashboard API!"}


# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
