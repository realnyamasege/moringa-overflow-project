from models import db, User, TokenBlocklist
from flask import request, jsonify, Blueprint, make_response
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
import logging

auth_bp = Blueprint('auth_bp', __name__)

# User registration
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    is_admin = data.get('is_admin', False)

    if not username or not email or not password:
        return make_response(jsonify({"message": "Username, email, and password are required"}), 400)

    if User.query.filter_by(username=username).first():
        return make_response(jsonify({"message": "Username already exists"}), 400)

    if User.query.filter_by(email=email).first():
        return make_response(jsonify({"message": "Email already exists"}), 400)

    new_user = User(username=username, email=email, is_admin=is_admin)
    new_user.set_password(password)  # Ensure password is hashed here

    db.session.add(new_user)
    db.session.commit()

    return make_response(jsonify({"message": "User created successfully"}), 201)
    
# User login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200

    if not user:
        return jsonify({"error": "User doesn't exist!"}), 404

    return jsonify({"error": "Wrong password!"}), 401

# Get logged-in user
@auth_bp.route("/authenticated_user", methods=["GET"])
@jwt_required()
def authenticated_user():
    current_user_id = get_jwt_identity()  # Getting current user id
    user = User.query.get(current_user_id)

    if user:
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
        return jsonify(user_data), 200
    
    return jsonify({"error": "User not found"}), 404

# Logout user
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jwt = get_jwt()
    jti = jwt['jti']

    token_b = TokenBlocklist(jti=jti)
    db.session.add(token_b)
    db.session.commit()

    return jsonify({"success": "Logged out successfully!"}), 200
