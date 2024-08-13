from flask import Blueprint, request, jsonify
from models import db, View
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity

views_bp = Blueprint('views_bp', __name__)


@views_bp.route('/views', methods=['POST'])
@jwt_required()
def create_or_update_view():
    user_id = get_jwt_identity()
    data = request.get_json()
    question_id = data.get('question_id')
    
    view = View.query.filter_by(user_id=user_id, question_id=question_id).first()
    
    if view:
        view.view_count += 1
    else:
        view = View(user_id=user_id, question_id=question_id)
    
    db.session.add(view)
    db.session.commit()
    
    return jsonify({'message': 'View recorded successfully', 'view_count': view.view_count}), 200

@views_bp.route('/views/<int:question_id>', methods=['GET'])
def get_view_count(question_id):
    view_count = db.session.query(db.func.sum(View.view_count)).filter_by(question_id=question_id).scalar() or 0
    
    return jsonify({'question_id': question_id, 'view_count': view_count}), 200

@views_bp.route('/users/<int:user_id>/views', methods=['GET'])
def get_user_views(user_id):
    views = View.query.filter_by(user_id=user_id).all()
    views_list = [view.to_dict() for view in views]
    
    return jsonify({'user_id': user_id, 'views': views_list}), 200