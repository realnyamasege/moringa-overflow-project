from flask import Blueprint, jsonify, request
from models import Question, db, User, Answer, View
from sqlalchemy.orm import joinedload
from flask_jwt_extended import  jwt_required, get_jwt_identity

question_bp = Blueprint('question_bp', __name__)


@question_bp.route('/questions', methods=['POST'])
@jwt_required()  # Ensure the user is authenticated
def create_question():
    data = request.json
    try:
        # Extract user ID from JWT token
        current_user_id = get_jwt_identity()
        
        # Ensure the data matches the expected model structure
        new_question = Question(
            user_id=current_user_id,  # Use the logged-in user's ID
            title=data.get('title'),
            content=data.get('content'),
            tags=data.get('tags', []),  # Provide default empty list if not present
            code_snippet=data.get('codeSnippet', ''),
            link=data.get('link', ''),
            upvotes=data.get('upvotes', 0),
            downvotes=data.get('downvotes', 0),
            resolved=data.get('resolved', False),
            answers=data.get('answers', []),
            badges=data.get('badges', [])
        )
        
        # Add to the session and commit
        db.session.add(new_question)
        db.session.commit()
        return jsonify({'message': 'Question created successfully!'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@question_bp.route('/questions', methods=['GET'])
def get_questions():
    try:
        questions = Question.query.options(joinedload(Question.author)).all()
        return jsonify([question.to_dict() for question in questions])
    except Exception as e:
        print(f"Error fetching questions: {e}")
        return jsonify({'error': 'An error occurred while fetching questions'}), 500

@question_bp.route('/questions/<question_id>', methods=['GET'])
def get_question(question_id):
    question = Question.query.options(joinedload(Question.author)).get(question_id)
    if question:
        return jsonify(question.to_dict())
    return jsonify({'message': 'Question not found'}), 404

# Update a question
@question_bp.route('/questions/<question_id>', methods=['PATCH'])
@jwt_required()
def update_question(question_id):
    data = request.get_json()
    question = Question.query.get(question_id)

    if not question:
        return jsonify({'message': 'Question not found'}), 404

    if 'title' in data:
        question.title = data['title']
    if 'content' in data:
        question.content = data['content']
    if 'tags' in data:
        question.tags = data['tags']
    if 'code_snippet' in data:
        question.code_snippet = data['code_snippet']
    if 'link' in data:
        question.link = data['link']
    if 'upvotes' in data:
        question.upvotes = data['upvotes']
    if 'downvotes' in data:
        question.downvotes = data['downvotes']
    if 'resolved' in data:
        question.resolved = data['resolved']

    db.session.commit()
    return jsonify({'message': 'Question updated successfully'})

@question_bp.route('/questions/<int:question_id>/accept/<int:answer_id>', methods=['PATCH'])
@jwt_required()
def accept_answer(question_id, answer_id):
    try:
        # Ensure the user is authorized to mark the answer as accepted
        current_user = get_jwt_identity()
        question = Question.query.get_or_404(question_id)

        if question.user_id != current_user['id']:
            return jsonify({'message': 'Unauthorized'}), 403

        # Ensure the answer exists and is associated with the question
        answer = Answer.query.filter_by(id=answer_id, question_id=question_id).first_or_404()

        # Set the answer as accepted
        question.accepted_answer_id = answer_id
        db.session.commit()

        return jsonify(question.to_dict()), 200
    except Exception as e:
        print(f'Error accepting answer: {e}')
        return jsonify({'message': 'An error occurred'}), 500



@question_bp.route('/questions/<question_id>', methods=['DELETE'])
@jwt_required()
def delete_question(question_id):
    try:
        # Get the current user's identity from the JWT
        current_user_id = get_jwt_identity()

        # Fetch the question
        question = Question.query.get(question_id)

        if not question:
            return jsonify({'message': 'Question not found'}), 404

        # Check if the current user is the owner of the question
        if question.user_id != current_user_id:
            return jsonify({'message': 'Permission denied'}), 403

        # Delete related views
        View.query.filter_by(question_id=question_id).delete()

        # Delete the question
        db.session.delete(question)
        db.session.commit()
        return jsonify({'message': 'Question deleted successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"Error occurred: {e}")  # Logs the error message to the console
        return jsonify({'message': 'Internal Server Error'}), 500

