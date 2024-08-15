from flask import Blueprint, jsonify, request, make_response, current_app as app
from models import Question, db, User, Answer, View
from sqlalchemy.orm import joinedload
from flask_jwt_extended import jwt_required, get_jwt_identity

question_bp = Blueprint('question_bp', __name__)

# Create a new question
@question_bp.route('/questions', methods=['POST'])
@jwt_required()  # Ensure the user is authenticated
def create_question():
    data = request.json
    try:
        current_user_id = get_jwt_identity()
        new_question = Question(
            user_id=current_user_id,
            title=data.get('title'),
            content=data.get('content'),
            tags=data.get('tags', []),
            code_snippet=data.get('codeSnippet', ''),
            link=data.get('link', ''),
            upvotes=data.get('upvotes', 0),
            downvotes=data.get('downvotes', 0),
            resolved=data.get('resolved', False),
            answers=data.get('answers', []),
            badges=data.get('badges', [])
        )
        db.session.add(new_question)
        db.session.commit()
        return jsonify({'message': 'Question created successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all questions
@question_bp.route('/questions', methods=['GET'])
def get_questions():
    try:
        questions = Question.query.all()
        questions_list = [question.to_dict() for question in questions]
        return jsonify(questions_list)
    except Exception as e:
        print(f"Error while retrieving questions: {e}")
        return make_response(jsonify({"message": "An error occurred while retrieving questions."}), 500)

# Get a single question
@question_bp.route('/questions/<int:id>', methods=['GET'])
def get_question(id):
    try:
        question = Question.query.get_or_404(id)
        return jsonify(question.to_dict())
    except Exception as e:
        print(f"Error while retrieving question {id}: {e}")
        return make_response(jsonify({"message": "An error occurred while retrieving the question."}), 500)


# Accept an answer for a question
@question_bp.route('/questions/<int:question_id>/accept/<int:answer_id>', methods=['PATCH'])
@jwt_required()
def accept_answer(question_id, answer_id):
    try:
        current_user = get_jwt_identity()
        question = Question.query.get_or_404(question_id)
        if question.user_id != current_user['id']:
            return jsonify({'message': 'Unauthorized'}), 403

        answer = Answer.query.filter_by(id=answer_id, question_id=question_id).first_or_404()
        question.accepted_answer_id = answer_id
        db.session.commit()

        return jsonify(question.to_dict()), 200
    except Exception as e:
        print(f'Error accepting answer: {e}')
        return jsonify({'message': 'An error occurred'}), 500
        

# Delete a question
@question_bp.route('/questions/<int:question_id>', methods=['DELETE'])
@jwt_required()
def delete_question(question_id):
    try:
        current_user_id = get_jwt_identity()
        question = Question.query.get(question_id)
        if not question:
            return jsonify({'message': 'Question not found'}), 404

        if question.user_id != current_user_id:
            return jsonify({'message': 'Permission denied'}), 403

        View.query.filter_by(question_id=question_id).delete()
        db.session.delete(question)
        db.session.commit()
        return jsonify({"message": "Question deleted successfully"})
    except Exception as e:
        db.session.rollback()
        print(f"Error occurred: {e}")
        return jsonify({'message': 'Internal Server Error'}), 500

# Update vote counts for a question
@question_bp.route('/questions/<int:question_id>', methods=['PATCH'])
@jwt_required()
def update_question_votes(question_id):
    data = request.get_json()

    app.logger.info(f"Received data: {data}")  # Log the received data

    if 'upvotes' not in data or 'downvotes' not in data:
        return jsonify({"error": "Upvotes and downvotes are required"}), 400

    try:
        upvotes = int(data['upvotes'])
        downvotes = int(data['downvotes'])
    except ValueError:
        return jsonify({"error": "Invalid data format"}), 400

    question = Question.query.get(question_id)
    if not question:
        return jsonify({"error": "Question not found"}), 404

    question.upvotes = upvotes
    question.downvotes = downvotes

    try:
        db.session.commit()
        return jsonify({
            "id": question.id,
            "upvotes": question.upvotes,
            "downvotes": question.downvotes
        }), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating votes: {e}")
        return jsonify({"error": "An error occurred while updating the votes", "details": str(e)}), 500