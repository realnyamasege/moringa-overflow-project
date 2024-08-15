from flask import Blueprint, jsonify, request
from models import db, Badge, User
from flask_jwt_extended import jwt_required, get_jwt_identity

badge_bp = Blueprint('badge_bp', __name__)


@badge_bp.route('/badges', methods=['POST'])
@jwt_required()
def add_badge():
    current_user = get_jwt_identity()

    if current_user['role'] != 'admin':
        return jsonify({'message': 'You are not authorized to add a badge'}), 403

    data = request.get_json()
    badge_name = data.get('badge_name')
    user_id = data.get('user_id')

    if not badge_name or not user_id:
        return jsonify({'message': 'Badge name and user ID are required'}), 400

    # Check if the user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Create a new badge
    new_badge = Badge(badge_name=badge_name, user_id=user_id)
    db.session.add(new_badge)
    db.session.commit()

    return jsonify({'message': 'Badge added successfully'}), 201

# Get all badges
@badge_bp.route('/', methods=['GET'])
def get_badges():
    badges = Badge.query.all()
    return jsonify([b.to_dict() for b in badges]), 200

# Get a single badge
@badge_bp.route('/<int:badge_id>', methods=['GET'])
def get_badge(badge_id):
    badge = Badge.query.get_or_404(badge_id)
    return jsonify(badge.to_dict()), 200

# Create a new badge
@badge_bp.route('/', methods=['POST'])
def create_badge():
    data = request.json
    new_badge = Badge(
        name=data['name'],
        description=data['description'],
        user_id=data['user_id']
    )
    db.session.add(new_badge)
    db.session.commit()
    return jsonify(new_badge.to_dict()), 201

# Update an existing badge
@badge_bp.route('/<int:badge_id>', methods=['PUT'])
def update_badge(badge_id):
    data = request.json
    badge = Badge.query.get_or_404(badge_id)
    badge.name = data.get('name', badge.name)
    badge.description = data.get('description', badge.description)
    db.session.commit()
    return jsonify(badge.to_dict()), 200

# Delete an existing badge
@badge_bp.route('/<int:badge_id>', methods=['DELETE'])
def delete_badge(badge_id):
    badge = Badge.query.get_or_404(badge_id)
    db.session.delete(badge)
    db.session.commit()
    return '', 204

# Route to assign a badge to a user
@badge_bp.route('/assign', methods=['POST'])
@jwt_required()
def assign_badge():
    current_user = get_jwt_identity()

    # Check if the current user is an admin
    if current_user['role'] != 'admin':
        return jsonify({'message': 'You are not authorized to assign badges'}), 403

    data = request.get_json()
    badge_id = data.get('badge_id')
    user_id = data.get('user_id')

    if not badge_id or not user_id:
        return jsonify({'message': 'Badge ID and user ID are required'}), 400

    # Check if the badge exists
    badge = Badge.query.get(badge_id)
    if not badge:
        return jsonify({'message': 'Badge not found'}), 404

    # Check if the user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Assign the badge to the user
    user.badges.append(badge)
    db.session.commit()

    return jsonify({'message': 'Badge assigned successfully'}), 200