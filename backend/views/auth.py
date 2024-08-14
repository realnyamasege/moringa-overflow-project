from models import db, User,TokenBlocklist
from flask import request, jsonify, Blueprint
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required!"}), 400

    user = User.query.filter_by(email=email).first()

    if user:
        if check_password_hash(user.password, password):
            access_token = create_access_token(identity=user.id)
            return jsonify(access_token=access_token)
        else:
            return jsonify({"error": "Wrong password!"}), 401
    else:
        return jsonify({"error": "User doesn't exist!"}), 404

# Get logged in user
@auth_bp.route("/authenticated_user", methods=["GET"])
@jwt_required()
def authenticated_user():
    current_user_id = get_jwt_identity() #geeting current user id
    user = User.query.get(current_user_id)

    if user:
        user_data = {
            'id': user.id,
            'name':user.name,
            'phone_number': user.phone_number,
            'email': user.email,
            'profile_image': user.profile_image,
            'reputation_points': user.reputation_points
        }
        return jsonify(user_data), 200
    else:
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
