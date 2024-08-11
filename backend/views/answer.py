from flask import Blueprint, jsonify, request
from models import Answer, db
from flask_jwt_extended import  jwt_required, get_jwt_identity

answer_bp = Blueprint('answer_bp', __name__)


# Create an answer
@answer_bp.route('/answers', methods=['POST'])
@jwt_required()
def create_answer():
    data = request.json 

    new_answer = Answer(body=data['body'], question_id=data['question_id'], user_id=get_jwt_identity())

    db.session.add(new_answer)
    db.session.commit()

    return jsonify({'message': 'Answer created successfully'})

# Get all answers for a specific question
@answer_bp.route('/answers/<int:question_id>', methods=['GET'])
def get_answers_for_question(question_id):
    answers = Answer.query.filter_by(question_id=question_id).all()

    if not answers:
        return jsonify({'message': 'No answers found for the specified question'})

    answer_list = [{'id': answer.id, 'body': answer.body, 'user_id': answer.user_id} for answer in answers]

    return jsonify({'answers': answer_list})

# Update an answer
@answer_bp.route('/answers/<int:answer_id>', methods=['PUT'])
@jwt_required()
def update_answer(answer_id):
    data = request.json  # Use request.json to parse JSON data

    # Check if the answer exists
    answer = Answer.query.get(answer_id)
    if not answer:
        return jsonify({"error": "Answer not found!"}), 404

    # Check if the current user is authorized to update the answer
    if answer.user_id != get_jwt_identity():
        return jsonify({"error": "Unauthorized action!"}), 403

    # Update the answer's body
    answer.body = data.get('body', answer.body)  # Default to current body if 'body' not provided

    # Commit changes to the database
    db.session.commit()
    return jsonify({'message': 'Answer updated successfully'}), 200

# Delete an answer
@answer_bp.route('/answers/<int:answer_id>', methods=['DELETE'])
@jwt_required()
def delete_answer(answer_id):
    answer = Answer.query.get(answer_id)

    if answer:
        if answer.user_id == get_jwt_identity():
            db.session.delete(answer)
            db.session.commit()

            return jsonify({'message': 'Answer deleted successfully'})
        else:
            return jsonify({"error": "You are trying to delete someone's answer!"}), 404

    else:
        return jsonify({"error": "Answer you are trying to delete is not found!"}), 404