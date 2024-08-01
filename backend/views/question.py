from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Question, Tag, User

question_bp = Blueprint('question_bp', __name__)

@question_bp.route('/questions', methods=['POST'])
@jwt_required()
def ask_question():
    try:
        data = request.get_json()
        title = data.get('title')
        body = data.get('body')
        tags = data.get('tags', [])

        # Debugging prints
        print(f"Request Data: {data}")
        print(f"Title: {title}, Body: {body}, Tags: {tags}")

        # Validate data
        if not title or not body:
            return make_response(jsonify({"message": "Title and body are required"}), 400)

        # Check JWT identity
        current_user = get_jwt_identity()
        print(f"JWT Identity: {current_user}")  # Debugging line
        if not isinstance(current_user, int):
            return make_response(jsonify({"message": "Invalid JWT identity format"}), 400)

        user_id = current_user
        user = User.query.get(user_id)

        if not user:
            return make_response(jsonify({"message": "User not found"}), 404)

        new_question = Question(title=title, body=body, user_id=user.id)

        # Handle tags
        for tag_name in tags:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            new_question.tags.append(tag)

        db.session.add(new_question)
        db.session.commit()

        return make_response(jsonify({"message": "Question created successfully"}), 201)

    except Exception as e:
        # Log error and return detailed message
        print(f"Error in ask_question: {e}")
        return make_response(jsonify({"message": "An error occurred", "error": str(e)}), 500)


@question_bp.route('/questions', methods=['GET'])
def get_questions():
    try:
        questions = Question.query.all()
        questions_list = [question.to_dict() for question in questions]
        return jsonify(questions_list)
    except Exception as e:
        print(f"Error while retrieving questions: {e}")
        return make_response(jsonify({"message": "An error occurred while retrieving questions."}), 500)

@question_bp.route('/questions/<int:id>', methods=['GET'])
def get_question(id):
    try:
        question = Question.query.get_or_404(id)
        return jsonify(question.to_dict())
    except Exception as e:
        print(f"Error while retrieving question {id}: {e}")
        return make_response(jsonify({"message": "An error occurred while retrieving the question."}), 500)

@question_bp.route('/questions/<int:id>', methods=['PUT'])
@jwt_required()
def update_question(id):
    try:
        question = Question.query.get_or_404(id)
        data = request.get_json()
        title = data.get('title')
        body = data.get('body')
        tags = data.get('tags', [])

        if title:
            question.title = title
        if body:
            question.body = body

        if tags is not None:
            question.tags = []
            for tag_name in tags:
                tag = Tag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = Tag(name=tag_name)
                    db.session.add(tag)
                question.tags.append(tag)

        db.session.commit()
        return jsonify({"message": "Question updated successfully"})
    except Exception as e:
        print(f"Error while updating question {id}: {e}")
        return make_response(jsonify({"message": "An error occurred while updating the question."}), 500)

@question_bp.route('/questions/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_question(id):
    try:
        question = Question.query.get_or_404(id)
        db.session.delete(question)
        db.session.commit()
        return jsonify({"message": "Question deleted successfully"})
    except Exception as e:
        print(f"Error while deleting question {id}: {e}")
        return make_response(jsonify({"message": "An error occurred while deleting the question."}), 500)
