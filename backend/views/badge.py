from models import db, Badge, User
from flask import Blueprint, request, jsonify
from flask_jwt_extended import  jwt_required, get_jwt_identity

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
@badge_bp.route('/badges', methods=['GET'])
def get_badges():
    badges = Badge.query.all()
    return jsonify([badge.to_dict() for badge in badges])

# Get a specific badge by ID
@badge_bp.route('/badges/<int:badge_id>', methods=['GET'])
def get_badge(badge_id):
    badge = Badge.query.get(badge_id)
    if badge:
        return jsonify(badge.to_dict())
    return jsonify({'message': 'Badge not found'}), 404

# Update a badge
@badge_bp.route('/badges/<int:badge_id>', methods=['PATCH'])
def update_badge(badge_id):
    data = request.get_json()
    badge = Badge.query.get(badge_id)

    if not badge:
        return jsonify({'message': 'Badge not found'}), 404

    if 'admin_id' in data:
        badge.admin_id = data['admin_id']
    if 'count' in data:
        badge.count = data['count']
    if 'user_id' in data:
        badge.user_id = data['user_id']
    if 'question_id' in data:
        badge.question_id = data['question_id']

    db.session.commit()
    return jsonify({'message': 'Badge updated successfully'})

# Delete a badge
@badge_bp.route('/badges/<int:badge_id>', methods=['DELETE'])
def delete_badge(badge_id):
    badge = Badge.query.get(badge_id)

    if not badge:
        return jsonify({'message': 'Badge not found'}), 404

    db.session.delete(badge)
    db.session.commit()
    return jsonify({'message': 'Badge deleted successfully'})
