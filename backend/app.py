from datetime import timedelta
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db, User, Question, Answer, Vote, Badge, View, TokenBlocklist
from views import user_bp, auth_bp, question_bp, answer_bp, vote_bp, badge_bp, views_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///moringa_overflow.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
db.init_app(app)  # Initialize the SQLAlchemy instance
migrate = Migrate(app, db)
CORS(app)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/') 
app.register_blueprint(auth_bp, url_prefix='/')
app.register_blueprint(question_bp, url_prefix='/')
app.register_blueprint(answer_bp, url_prefix='/')
app.register_blueprint(vote_bp, url_prefix='/')
app.register_blueprint(badge_bp, url_prefix='/')
app.register_blueprint(views_bp, url_prefix='/')

# JWT token blocklist loader
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = TokenBlocklist.query.filter_by(jti=jti).first()
    return token is not None

if __name__ == '__main__':
    app.run(port=5000, debug=True)
