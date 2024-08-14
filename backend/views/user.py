from flask import Blueprint, request, jsonify
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity

user_bp = Blueprint('user_bp', __name__)

# Create a new user
@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    # Check if required fields are present
    required_fields = ['name', 'email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400

    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'User with this ID already exists'}), 400

    existing_user_by_email = User.query.filter_by(email=data['email']).first()
    if existing_user_by_email:
        return jsonify({'message': 'User with this email already exists'}), 400

    # Create and add new user
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        profile_image=data.get('profile_image'),
        phone_number=data.get('phone_number'),
        admin=data.get('admin', False),
        reputation_points=data.get('reputation_points', 0)
    )
    
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@user_bp.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        if not users:
            return jsonify({'message': 'No users found'}), 404
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        print(f"Error occurred: {e}")  # This logs the error to the console
        return jsonify({'message': 'Internal Server Error'}), 500
    
# Get a specific user by ID
@user_bp.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify(user.to_dict())
    return jsonify({'message': 'User not found'}), 404

@user_bp.route('/users/<user_id>', methods=['PATCH'])
@jwt_required()
def update_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = generate_password_hash(data['password'])
    if 'profile_image' in data:
        user.profile_image = data['profile_image']
    if 'phone_number' in data:
        user.phone_number = data['phone_number']
    if 'admin' in data:
        user.admin = data['admin']
    if 'reputation_points' in data:
        user.reputation_points = data['reputation_points']

    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

@user_bp.route('/users/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    try:
        user = User.query.get(user_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'})
    except Exception as e:
        print(f"Error occurred: {e}")  # Log the error to the console
        db.session.rollback()  # Rollback any changes if an error occurs
        return jsonify({'message': 'Internal Server Error'}), 500
