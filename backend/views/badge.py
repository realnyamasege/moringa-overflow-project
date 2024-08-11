from flask import Blueprint, jsonify, request
from models import db, Badge

badge_bp = Blueprint('badge_bp', __name__)


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
