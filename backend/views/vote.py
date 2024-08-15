from flask import Blueprint, jsonify, request, make_response
from models import db, Vote

vote_bp = Blueprint('vote_bp', __name__)

# Get all votes
@vote_bp.route('/votes', methods=['GET'])
def get_votes():
    try:
        votes = Vote.query.all()
        return jsonify([v.to_dict() for v in votes]), 200
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred while retrieving votes.", "error": str(e)}), 500)

# Get a single vote
@vote_bp.route('/votes/<int:vote_id>', methods=['GET'])
def get_vote(vote_id):
    try:
        vote = Vote.query.get_or_404(vote_id)
        return jsonify(vote.to_dict()), 200
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred while retrieving the vote.", "error": str(e)}), 500)


@vote_bp.route('/votes/<int:vote_id>', methods=['PATCH'])
def update_vote(vote_id):
    data = request.get_json()
    vote = Vote.query.get(vote_id)
    
    if not vote:
        return jsonify({'message': 'Vote not found'}), 404
    
    # Check if required fields are present and valid
    if 'vote_type' in data:
        if data['vote_type'] not in ['upvote', 'downvote']:
            return jsonify({'message': 'Invalid vote type'}), 400
        vote.vote_type = data['vote_type']
    
    # Commit the changes to the database
    db.session.commit()
    return jsonify({'message': 'Vote updated successfully'})


# Delete an existing vote
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