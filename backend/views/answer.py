from flask import Blueprint, jsonify, request
from models import Answer, db
from sqlalchemy.orm import joinedload
from flask_jwt_extended import  jwt_required, get_jwt_identity
from flask import current_app as app

answer_bp = Blueprint('answer_bp', __name__)

@answer_bp.route('/answers', methods=['POST'])
@jwt_required()
def create_answer():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()  # Extract user_id from JWT

        if not user_id:
            raise ValueError('User ID not found in JWT')

        new_answer = Answer(
            question_id=data.get('question_id'),
            user_id=user_id,  # Use the user_id from JWT
            answer=data.get('answer'),
            link=data.get('link'),
            codeSnippet=data.get('codeSnippet'),
            is_accepted=data.get('is_accepted', False),
        )

        db.session.add(new_answer)
        db.session.commit()

        return jsonify(new_answer.to_dict()), 201
    except Exception as e:
        app.logger.error(f'Error creating answer: {e}')
        return jsonify({'message': str(e)}), 500

# Get all answers
@answer_bp.route('/answers', methods=['GET'])
def get_answers():
    answers = Answer.query.options(joinedload(Answer.question), joinedload(Answer.user)).all()
    return jsonify([answer.to_dict() for answer in answers])

@answer_bp.route('/questions/<question_id>/answers', methods=['GET'])
def get_answers_for_question(question_id):
    try:
        # Query to get answers for the specific question
        answers = Answer.query.filter_by(question_id=question_id).options(joinedload(Answer.user)).all()

        if answers:
            # Convert each answer to a dictionary
            answers_list = [answer.to_dict() for answer in answers]
            return jsonify(answers_list)
        else:
            return jsonify({'message': 'No answers found for this question'}), 404
    except Exception as e:
        # Handle unexpected errors
        return jsonify({'message': str(e)}), 500


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
