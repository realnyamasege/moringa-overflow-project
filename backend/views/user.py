from flask import Blueprint, jsonify, request, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from models import db, User, Vote

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    # Extract data from request
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    profile_image = data.get('profile_image')
    phone_number = data.get('phone_number')
    admin = data.get('admin', False)  # Default to False if not provided

    # Validate input
    if not name or not email or not password:
        return make_response(jsonify({"message": "Name, email, and password are required"}), 400)

    if User.query.filter_by(email=email).first():
        return make_response(jsonify({"message": "Email already exists"}), 400)

    # Create new user instance
    new_user = User(
        name=name,
        email=email,
        profile_image=profile_image,
        phone_number=phone_number,
        admin=admin
    )
    new_user.password = generate_password_hash(password)  # Hash the password

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({"message": "An error occurred while creating the user.", "error": str(e)}), 500)
# Get all users
@user_bp.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred while retrieving users."}), 500

# Get a single user
@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        if user:
            return jsonify(user.to_dict()), 200
        else:
            return jsonify({"message": "User not found."}), 404
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred while retrieving the user."}), 500

@user_bp.route('/users/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()  # Get the ID of the logged-in user
    
    if current_user_id != user_id:
        return jsonify({"message": "You are not allowed to update this user"}), 403
    
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()

    if 'password' in data:
        hashed_password = generate_password_hash(data['password'])
        user.password = hashed_password
    if 'email' in data:
        user.email = data['email']
    if 'profile_image' in data:
        user.profile_image = data['profile_image']    
    if 'name' in data:
        user.name = data['name']
    if 'phone_number' in data:
        user.phone_number = data['phone_number']
    if 'admin' in data:
        user.admin = data['admin']    
    
    db.session.commit()
    
    return jsonify({
        "id": user.id,
        "name": user.name,
        "phone_number": user.phone_number
    })

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()  # Get the ID of the logged-in user
    
    if current_user_id != user_id:
        return jsonify({"message": "You are not allowed to delete this user"}), 403

    user = User.query.get(user_id)
    
    if user:
        try:
            # Remove associations from the `question_tag` table
            for question in user.questions:
                question.tags = []  # This will remove the association from the question_tag table
            
            # Clean up related votes
            Vote.query.filter_by(user_id=user.id).delete()

            # Remove the user
            db.session.delete(user)
            db.session.commit()
            
            return jsonify({"success": "User deleted successfully"}), 200

        except IntegrityError as e:
            db.session.rollback()
            return jsonify({"error": "Integrity error occurred", "details": str(e)}), 500

        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": "Database error occurred", "details": str(e)}), 500

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

    else:
        return jsonify({"error": "User you are trying to delete is not found!"}), 404