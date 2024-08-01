from flask import Blueprint, jsonify, request, make_response
from models import db, Vote

vote_bp = Blueprint('vote_bp', __name__)

@vote_bp.route('/votes', methods=['GET'])
def get_votes():
    try:
        votes = Vote.query.all()
        return jsonify([v.to_dict() for v in votes]), 200
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred while retrieving votes.", "error": str(e)}), 500)

@vote_bp.route('/votes/<int:vote_id>', methods=['GET'])
def get_vote(vote_id):
    try:
        vote = Vote.query.get_or_404(vote_id)
        return jsonify(vote.to_dict()), 200
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred while retrieving the vote.", "error": str(e)}), 500)

@vote_bp.route('/votes', methods=['POST'])
def create_vote():
    data = request.json
    try:
        # Ensure required fields are present
        if 'value' not in data or ('question_id' not in data and 'answer_id' not in data):
            return make_response(jsonify({"message": "Value, question_id or answer_id are required"}), 400)
        
        # For demonstration, assume user_id is passed in the request data
        user_id = data.get('user_id')
        if not user_id:
            return make_response(jsonify({"message": "User ID is required"}), 400)

        new_vote = Vote(
            value=data['value'],
            user_id=user_id,
            question_id=data.get('question_id'),
            answer_id=data.get('answer_id')
        )
        db.session.add(new_vote)
        db.session.commit()
        return jsonify({ "message": "Vote created successfully"}), 201
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred while creating the vote.", "error": str(e)}), 500)

@vote_bp.route('/votes/<int:vote_id>', methods=['PUT'])
def update_vote(vote_id):
    data = request.json
    try:
        vote = Vote.query.get_or_404(vote_id)
        # Allow updates regardless of the user
        vote.value = data.get('value', vote.value)
        db.session.commit()
        return jsonify({"message": "Vote updated successfully"}), 200
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred while updating the vote.", "error": str(e)}), 500)

@vote_bp.route('/votes/<int:vote_id>', methods=['DELETE'])
def delete_vote(vote_id):
    try:
        vote = Vote.query.get_or_404(vote_id)
        # Allow deletion regardless of the user
        db.session.delete(vote)
        db.session.commit()
        return jsonify({"message": "Vote deleted successfully"}), 200
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred while deleting the vote.", "error": str(e)}), 500)
