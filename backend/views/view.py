from flask import Blueprint, jsonify, request, make_response
from models import db, Views
from datetime import datetime

view_bp = Blueprint('view_bp', __name__)

@view_bp.route('/views', methods=['GET'])
def get_views():
    try:
        views = Views.query.all()
        return jsonify([v.to_dict() for v in views]), 200
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred while retrieving views.", "error": str(e)}), 500)

@view_bp.route('/views/<int:view_id>', methods=['GET'])
def get_view(view_id):
    try:
        view = Views.query.get_or_404(view_id)
        return jsonify(view.to_dict()), 200
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred while retrieving the view.", "error": str(e)}), 500)

@view_bp.route('/views', methods=['POST'])
def create_view():
    data = request.json
    try:
        if 'question_id' not in data:
            return make_response(jsonify({"message": "Question ID is required"}), 400)

        # Convert viewed_at string to datetime object if present
        viewed_at = data.get('viewed_at')
        if viewed_at:
            try:
                viewed_at = datetime.fromisoformat(viewed_at)
            except ValueError:
                return make_response(jsonify({"message": "Invalid date format for viewed_at"}), 400)

        new_view = Views(
            question_id=data['question_id'],
            viewed_at=viewed_at
        )
        db.session.add(new_view)
        db.session.commit()
        return jsonify({ "message": "View created successfully"}), 201
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred while creating the view.", "error": str(e)}), 500)
    
@view_bp.route('/views/<int:view_id>', methods=['PUT'])
def update_view(view_id):
    data = request.json
    try:
        # Fetch the existing view record
        view = Views.query.get_or_404(view_id)

        # Update the view with provided data
        view.question_id = data.get('question_id', view.question_id)

        # Convert viewed_at string to datetime object if present
        viewed_at = data.get('viewed_at')
        if viewed_at:
            try:
                viewed_at = datetime.fromisoformat(viewed_at)
            except ValueError:
                return make_response(jsonify({"message": "Invalid date format for viewed_at"}), 400)
        view.viewed_at = viewed_at

        # Commit the changes
        db.session.commit()
        return jsonify({"message": "View updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({"message": "An error occurred while updating the view.", "error": str(e)}), 500)
    
@view_bp.route('/views/<int:view_id>', methods=['DELETE'])
def delete_view(view_id):
    try:
        view = Views.query.get_or_404(view_id)
        db.session.delete(view)
        db.session.commit()
        return jsonify({ "message": "View deleted successfully"}), 201
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred while deleting the view.", "error": str(e)}), 500)
