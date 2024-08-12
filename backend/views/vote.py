from flask import Blueprint, request, jsonify
from models import Vote
from models import db, Vote, Question, Answer, User
from flask_jwt_extended import  jwt_required, get_jwt_identity

vote_bp = Blueprint('vote_bp', __name__)

# Create a new vote
@vote_bp.route('/votes', methods=['POST'])
@jwt_required()
def create_vote():
    data = request.get_json()
    
    # Check if required fields are present
    required_fields = ['vote_type', 'question_id', 'answer_id']
    if not any(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Ensure vote_type is valid
    if data['vote_type'] not in ['upvote', 'downvote']:
        return jsonify({'message': 'Invalid vote type'}), 400

    # Get current user
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Check if the question or answer exists
    question = Question.query.get(data.get('question_id'))
    answer = Answer.query.get(data.get('answer_id'))
    if not (question or answer):
        return jsonify({'message': 'Question or answer not found'}), 404

    # Check if the user has already voted on this question or answer
    existing_vote = Vote.query.filter_by(
        user_id=user_id,
        question_id=data.get('question_id'),
        answer_id=data.get('answer_id')
    ).first()
    
    if existing_vote:
        return jsonify({'message': 'User has already voted on this question or answer'}), 400

    # Create and add new vote
    new_vote = Vote(
        user_id=user_id,
        question_id=data.get('question_id'),
        answer_id=data.get('answer_id'),
        vote_type=data['vote_type']
    )
    
    db.session.add(new_vote)
    db.session.commit()

    return jsonify({'message': 'Vote created successfully'}), 201

# Get all votes
@vote_bp.route('/votes', methods=['GET'])
def get_votes():
    votes = Vote.query.all()
    return jsonify([vote.to_dict() for vote in votes])

# Get votes for a specific question or answer
@vote_bp.route('/votes/<int:item_id>', methods=['GET'])
def get_votes_by_item(item_id):
    question_votes = Vote.query.filter_by(question_id=item_id).all()
    answer_votes = Vote.query.filter_by(answer_id=item_id).all()
    return jsonify({
        'question_votes': [vote.to_dict() for vote in question_votes],
        'answer_votes': [vote.to_dict() for vote in answer_votes]
    })


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

# Delete a vote
@vote_bp.route('/votes/<int:vote_id>', methods=['DELETE'])
@jwt_required()
def delete_vote(vote_id):
    vote = Vote.query.get(vote_id)

    if not vote:
        return jsonify({'message': 'Vote not found'}), 404

    db.session.delete(vote)
    db.session.commit()
    return jsonify({'message': 'Vote deleted successfully'})
