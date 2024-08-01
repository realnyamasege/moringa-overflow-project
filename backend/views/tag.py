from flask import Blueprint, jsonify, request, make_response
from models import db, Tag

tag_bp = Blueprint('tag_bp', __name__)

@tag_bp.route('/tags', methods=['GET'])
def get_tags():
    try:
        tags = Tag.query.all()
        return jsonify([t.to_dict() for t in tags]), 200
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred while retrieving tags.", "error": str(e)}), 500)

@tag_bp.route('/tags/<int:tag_id>', methods=['GET'])
def get_tag(tag_id):
    try:
        tag = Tag.query.get_or_404(tag_id)
        return jsonify(tag.to_dict()), 200
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred while retrieving the tag.", "error": str(e)}), 500)

@tag_bp.route('/tags', methods=['POST'])
def create_tag():
    data = request.json
    if 'name' not in data:
        return make_response(jsonify({"message": "Tag name is required"}), 400)
    
    try:
        new_tag = Tag(name=data['name'])
        db.session.add(new_tag)
        db.session.commit()
        return jsonify({"message": "Tag created successfully"}), 201
    except Exception as e:
        db.session.rollback()  # Rollback on error
        return make_response(jsonify({"message": "An error occurred while creating the tag.", "error": str(e)}), 500)

@tag_bp.route('/tags/<int:tag_id>', methods=['PUT'])
def update_tag(tag_id):
    data = request.json
    try:
        tag = Tag.query.get_or_404(tag_id)
        tag.name = data.get('name', tag.name)
        db.session.commit()
        return jsonify({"message": "Tag updated successfully"}), 200
    except Exception as e:
        db.session.rollback()  # Rollback on error
        return make_response(jsonify({"message": "An error occurred while updating the tag.", "error": str(e)}), 500)

@tag_bp.route('/tags/<int:tag_id>', methods=['DELETE'])
def delete_tag(tag_id):
    try:
        tag = Tag.query.get_or_404(tag_id)
        db.session.delete(tag)
        db.session.commit()
        return jsonify({"message": "Tag deleted successfully"}), 201
    except Exception as e:
        db.session.rollback()  # Rollback on error
        return make_response(jsonify({"message": "An error occurred while deleting the tag.", "error": str(e)}), 500)
