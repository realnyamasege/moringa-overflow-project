from flask import Blueprint, jsonify, request
from models import Answer, db
from sqlalchemy.orm import joinedload
from flask_jwt_extended import  jwt_required, get_jwt_identity

answer_bp = Blueprint('answer_bp', __name__)

# Create a new answer
@answer_bp.route('/answers', methods=['POST'])
@jwt_required()
def create_answer():
    data = request.get_json()
    
    # Check if required fields are present
    required_fields = ['question_id', 'answer']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400

    # Get current user
    user_id = get_jwt_identity()

    # Create and add new answer
    new_answer = Answer(
        question_id=data['question_id'],
        user_id=user_id,
        answer=data['answer'],
        link=data.get('link'),
        accepted=data.get('accepted', False)
    )
    
    db.session.add(new_answer)
    db.session.commit()
    return jsonify({'message': 'Answer created successfully'}), 201

# Get all answers
@answer_bp.route('/answers', methods=['GET'])
def get_answers():
    answers = Answer.query.options(joinedload(Answer.question), joinedload(Answer.user)).all()
    return jsonify([answer.to_dict() for answer in answers])

# Get a specific answer by ID
@answer_bp.route('/answers/<answer_id>', methods=['GET'])
def get_answer(answer_id):
    answer = Answer.query.options(joinedload(Answer.question), joinedload(Answer.user)).get(answer_id)
    if answer:
        return jsonify(answer.to_dict())
    return jsonify({'message': 'Answer not found'}), 404

# Update an answer
@answer_bp.route('/answers/<answer_id>', methods=['PATCH'])
@jwt_required()
def update_answer(answer_id):
    data = request.get_json()
    answer = Answer.query.get(answer_id)

    if not answer:
        return jsonify({'message': 'Answer not found'}), 404

    if 'answer' in data:
        answer.answer = data['answer']
    if 'link' in data:
        answer.link = data['link']
    if 'accepted' in data:
        answer.accepted = data['accepted']

    db.session.commit()
    return jsonify({'message': 'Answer updated successfully'})

# Delete an answer
@answer_bp.route('/answers/<answer_id>', methods=['DELETE'])
@jwt_required()
def delete_answer(answer_id):
    answer = Answer.query.get(answer_id)

    if not answer:
        return jsonify({'message': 'Answer not found'}), 404

    db.session.delete(answer)
    db.session.commit()
    return jsonify({'message': 'Answer deleted successfully'})
