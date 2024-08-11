from flask import Blueprint, jsonify, request
from models import Question, db, User
from sqlalchemy.orm import joinedload
from flask_jwt_extended import  jwt_required, get_jwt_identity

question_bp = Blueprint('question_bp', __name__)


@question_bp.route('/questions', methods=['POST'])
@jwt_required()
def create_question():
    data = request.get_json()
    
    # Validate the data
    if not all(key in data for key in ['title', 'content', 'author', 'tags']):
        return jsonify({"error": "Missing required fields"}), 422

    try:
        new_question = Question(
            title=data['title'],
            content=data['content'],
            author=data['author'],
            tags=data['tags'],
            code_snippet=data.get('codeSnippet'),
            link=data.get('link'),
            upvotes=data.get('upvotes', 0),
            downvotes=data.get('downvotes', 0),
            awards=data.get('awards', 0),
            resolved=data.get('resolved', False),
            answers=data.get('answers', [])
        )
        db.session.add(new_question)
        db.session.commit()
        return jsonify({"message": "Question submitted successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


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

@question_bp.route('/questions/<question_id>', methods=['DELETE'])
@jwt_required()
def delete_question(question_id):
    try:
        question = Question.query.get(question_id)

        if not question:
            return jsonify({'message': 'Question not found'}), 404

        db.session.delete(question)
        db.session.commit()
        return jsonify({'message': 'Question deleted successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"Error occurred: {e}")  # Logs the error message to the console
        return jsonify({'message': 'Internal Server Error'}), 500
