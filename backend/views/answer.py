from flask import Blueprint, jsonify, request
from models import Answer, db, Vote
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
    
@answer_bp.route('/answers/<int:answer_id>/vote', methods=['PATCH'])
def update_answer_vote(answer_id):
    data = request.get_json()
    vote_type = data.get('voteType')

    # Log received vote_type
    app.logger.info(f"Received vote_type: {vote_type}")

    # Validate vote_type
    if vote_type not in ['upvote', 'downvote']:
        app.logger.error(f"Invalid vote_type: {vote_type}")
        return jsonify({'message': 'Invalid vote type'}), 422

    # Fetch the answer
    answer = Answer.query.get(answer_id)
    if not answer:
        return jsonify({'message': 'Answer not found'}), 404

    # Update votes based on vote_type
    if vote_type == 'upvote':
        answer.upvotes += 1
    elif vote_type == 'downvote':
        answer.downvotes += 1

    # Commit changes
    db.session.commit()
    return jsonify({'id': answer.id, 'upvotes': answer.upvotes, 'downvotes': answer.downvotes}), 200

@answer_bp.route('/answers/<answer_id>', methods=['PATCH'])
@jwt_required()
def update_answer(answer_id):
    # Get the current user's ID from the JWT
    current_user_id = get_jwt_identity()

    # Retrieve the answer from the database
    answer = Answer.query.get(answer_id)

    # Check if the answer exists
    if not answer:
        return jsonify({"error": "Answer not found!"}), 404

    # Check if the current user is authorized to update the answer
    if answer.user_id != get_jwt_identity():
        return jsonify({"error": "Unauthorized action!"}), 403

    # Check if the current user is the author of the answer
    if answer.user_id != current_user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    # Get the data from the request
    data = request.get_json()

    # Update the answer fields if present in the request
    if 'answer' in data:
        answer.answer = data['answer']
    if 'link' in data:
        answer.link = data['link']
    if 'accepted' in data:
        answer.accepted = data['accepted']

    # Commit the changes to the database
    db.session.commit()

    return jsonify({'message': 'Answer updated successfully'})

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