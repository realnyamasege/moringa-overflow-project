from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
import os

from models import db, User
from flask_jwt_extended import jwt_required, get_jwt_identity

user_bp = Blueprint('user_bp', __name__)

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Create a new user
@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    # Check if required fields are present
    required_fields = ['name', 'email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400

    # Check if user already exists
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

# Get all users
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
@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify(user.to_dict())
    return jsonify({'message': 'User not found'}), 404

# Update a user's profile
@user_bp.route('/users/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    if 'profile_image' in request.files:
        file = request.files['profile_image']
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join('path/to/upload/folder', filename)
            file.save(file_path)
            user.profile_image = file_path
    
    user.name = request.form.get('name', user.name)
    user.phone_number = request.form.get('phone_number', user.phone_number)
    
    db.session.commit()
    return jsonify(user.to_dict())

# Delete a user
@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
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
