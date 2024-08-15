from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
db = SQLAlchemy()

# Define the association table
question_tag = db.Table('question_tag',
    db.Column('question_id', db.Integer, db.ForeignKey('question.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True)
)

class User(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    reputation = db.Column(db.Integer, default=0)
    is_admin = db.Column(db.Boolean, default=False)

    
    questions = db.relationship('Question', back_populates='user', cascade='all, delete-orphan')
    answers = db.relationship('Answer', back_populates='user')
    votes = db.relationship('Vote', back_populates='user')
    created_badges = db.relationship('Badge', foreign_keys='Badge.admin_id', back_populates='creator')
    received_badges = db.relationship('Badge', foreign_keys='Badge.user_id', back_populates='recipient')
    views = db.relationship('View', back_populates='user')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'reputation': self.reputation,
            'is_admin': self.is_admin
        }

    def __repr__(self):
        return f'<User {self.username}>'

class Question(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user = db.relationship('User', back_populates='questions')
    answers = db.relationship('Answer', back_populates='question')
    tags = db.relationship('Tag', secondary='question_tag', back_populates='questions')
    votes = db.relationship('Vote', back_populates='question')
    views = db.relationship('View', back_populates='question', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'body': self.body,
            'created_at': self.created_at.isoformat(),
            'user_id': self.user_id
        }

    def __repr__(self):
        return f'<Question {self.title}>'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Use Integer here
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)  # Ensure correct reference
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Ensure correct reference
    answer = db.Column(db.Text, nullable=False)
    link = db.Column(db.String)
    codeSnippet = db.Column(db.Text, nullable=True)
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    is_accepted = db.Column(db.Boolean, default=False)

    question = db.relationship('Question', back_populates='answers')
    user = db.relationship('User', back_populates='answers')
    votes = db.relationship('Vote', back_populates='answer')

    def to_dict(self):
        return {
            'id': self.id,
            'body': self.body,
            'created_at': self.created_at.isoformat(),
            'status': self.status,
            'question_id': self.question_id,
            'user_id': self.user_id,
            'answer': self.answer,
            'link': self.link,
            'codeSnippet': self.codeSnippet,
            'upvotes': self.upvotes,
            'downvotes': self.downvotes,
            'is_accepted': self.is_accepted,
            'question': {'id': self.question.id, 'title': self.question.title} if self.question else None,
            'user': {'id': self.user.id, 'name': self.user.name} if self.user else None,
            'votes': [{'id': v.id, 'vote_type': v.vote_type} for v in self.votes]
        }

    def __repr__(self):
        return f'<Answer {self.id}>'

class Tag(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    questions = db.relationship('Question', secondary=question_tag, back_populates='tags')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

    def __repr__(self):
        return f'<Tag {self.name}>'
    
class Vote(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=True)
    answer_id = db.Column(db.Integer, db.ForeignKey('answer.id'), nullable=True)

    user = db.relationship('User', back_populates='votes')
    question = db.relationship('Question', back_populates='votes')
    answer = db.relationship('Answer', back_populates='votes')

    def to_dict(self):
        return {
            'id': self.id,
            'value': self.value,
            'user_id': self.user_id,
            'question_id': self.question_id,
            'answer_id': self.answer_id
        }

    def __repr__(self):
        return f'<Vote {self.id}>'

class Badge(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='SET NULL'), nullable=False)

    user = db.relationship('User', back_populates='badges')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'user_id': self.user_id
        }

    def __repr__(self):
        return f'<Badge {self.name}>'

class Views(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    viewed_at = db.Column(db.DateTime, default=datetime.utcnow)

    question = db.relationship('Question', back_populates='views')

    def to_dict(self):
        return {
            'id': self.id,
            'question_id': self.question_id,
            'viewed_at': self.viewed_at.isoformat()
        }

class View(db.Model):
    __tablename__ = 'views'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    view_count = db.Column(db.Integer, default=0, nullable=False)
    
    # Define relationships
    user = db.relationship('User', back_populates='views')
    question = db.relationship('Question', back_populates='views')
    
    def __init__(self, user_id, question_id):
        self.user_id = user_id
        self.question_id = question_id
        self.view_count = 1

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'question_id': self.question_id,
            'view_count': self.view_count
        }
    
class TokenBlocklist(db.Model):
    __tablename__ = 'token_blocklist'

class TokenBlocklist(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'jti': self.jti,
            'created_at': self.created_at.isoformat()
        }

    def __repr__(self):
        return f'<TokenBlocklist {self.jti}>'

