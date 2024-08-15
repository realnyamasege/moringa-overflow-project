from flask import Blueprint, request, jsonify
from models import db, View
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity

views_bp = Blueprint('views_bp', __name__)


@views_bp.route('/views', methods=['PATCH'])
def update_view_count():
    try:
        data = request.get_json()
        question_id = data.get('question_id')

        if not question_id:
            return jsonify({'message': 'Question ID is required'}), 400

        # Create or update the view record
        view = View.query.filter_by(question_id=question_id).first()
        
        if not view:
            # Create new view record if none exists
            view = View(question_id=question_id, view_count=1)
            db.session.add(view)
        else:
            # Increment the view count
            view.view_count += 1

        db.session.commit()
        return jsonify({'message': 'View recorded successfully', 'view_count': view.view_count}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error occurred: {e}")
        return jsonify({'message': 'Internal Server Error'}), 500



@views_bp.route('/views/<int:question_id>', methods=['GET'])
def get_view_count(question_id):
    view_count = db.session.query(db.func.sum(View.view_count)).filter_by(question_id=question_id).scalar() or 0
    
    return jsonify({'question_id': question_id, 'view_count': view_count}), 200

@views_bp.route('/users/<int:user_id>/views', methods=['GET'])
def get_user_views(user_id):
    views = View.query.filter_by(user_id=user_id).all()
    views_list = [view.to_dict() for view in views]
    
    return jsonify({'user_id': user_id, 'views': views_list}), 200