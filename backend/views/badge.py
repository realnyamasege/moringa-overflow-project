from models import db, Badge, User
from flask import Blueprint, request, jsonify
from flask_jwt_extended import  jwt_required, get_jwt_identity

badge_bp = Blueprint('badge_bp', __name__)


# Create a new badge
@badge_bp.route('/badges', methods=['POST'])
def create_badge():
    data = request.get_json()
    
    # Check if required fields are present
    required_fields = ['admin_id', 'count', 'user_id', 'question_id']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400

    # Create and add new badge
    try:
        new_badge = Badge(
            admin_id=data['admin_id'],
            count=data['count'],
            user_id=data['user_id'],
            question_id=data['question_id']
        )
        
        db.session.add(new_badge)
        db.session.commit()
        return jsonify({'message': 'Badge created successfully'}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 422

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
