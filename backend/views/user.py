from flask import Blueprint, jsonify, request, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from models import db, User, Vote

user_bp = Blueprint('user_bp', __name__)

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
