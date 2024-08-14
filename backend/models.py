from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates, relationship
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    profile_image = db.Column(db.String)
    phone_number = db.Column(db.String)
    admin = db.Column(db.Boolean, default=False)
    reputation_points = db.Column(db.Integer, default=0)

    # Relationships
    questions = db.relationship('Question', back_populates='author', cascade='all, delete-orphan')
    answers = db.relationship('Answer', back_populates='user')
    votes = db.relationship('Vote', back_populates='user')
    created_badges = db.relationship('Badge', foreign_keys='Badge.admin_id', back_populates='creator')
    received_badges = db.relationship('Badge', foreign_keys='Badge.user_id', back_populates='recipient')
    views = db.relationship('View', back_populates='user')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'profile_image': self.profile_image,
            'phone_number': self.phone_number,
            'admin': self.admin,
            'reputation_points': self.reputation_points,
            'questions': [{'id': q.id, 'title': q.title} for q in self.questions],
            'answers': [{'id': a.id, 'answer': a.answer} for a in self.answers],
            'votes': [{'id': v.id, 'vote_type': v.vote_type} for v in self.votes],
            'created_badges': [{'id': b.id, 'count': b.count} for b in self.created_badges],
            'received_badges': [{'id': b.id, 'count': b.count} for b in self.received_badges]
        }

class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String, nullable=False)
    content = db.Column(db.Text, nullable=False)
    tags = db.Column(db.JSON)
    code_snippet = db.Column(db.Text)
    link = db.Column(db.String)
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    resolved = db.Column(db.Boolean, default=False)

    # Relationships
    author = db.relationship('User', back_populates='questions')
    answers = db.relationship('Answer', back_populates='question', cascade='all, delete-orphan')
    badges = db.relationship('Badge', back_populates='question')
    votes = db.relationship('Vote', back_populates='question')
    views = db.relationship('View', back_populates='question', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'content': self.content,
            'tags': self.tags,
            'code_snippet': self.code_snippet,
            'link': self.link,
            'upvotes': self.upvotes,
            'downvotes': self.downvotes,
            'resolved': self.resolved,
            'author': {'id': self.author.id, 'name': self.author.name} if self.author else None,
            'answers': [{'id': a.id, 'answer': a.answer} for a in self.answers],
            'badges': [{'id': b.id, 'count': b.count} for b in self.badges],
            'votes': [{'id': v.id, 'vote_type': v.vote_type} for v in self.votes]
        }

class Answer(db.Model):
    __tablename__ = 'answers'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Use Integer here
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)  # Ensure correct reference
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Ensure correct reference
    answer = db.Column(db.Text, nullable=False)
    link = db.Column(db.String)
    codeSnippet = db.Column(db.Text, nullable=True)
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    is_accepted = db.Column(db.Boolean, default=False)

    # Relationships
    question = db.relationship('Question', back_populates='answers')
    user = db.relationship('User', back_populates='answers')
    votes = db.relationship('Vote', back_populates='answer')

    def to_dict(self):
        return {
             'id': self.id,
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

class Badge(db.Model):
    __tablename__ = 'badges'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    count = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'))

    # Relationships
    creator = relationship('User', foreign_keys=[admin_id], back_populates='created_badges')
    recipient = relationship('User', foreign_keys=[user_id], back_populates='received_badges')
    question = relationship('Question', back_populates='badges')

    def to_dict(self):
        return {
             'id': self.id,
            'admin_id': self.admin_id,
            'count': self.count,
            'user_id': self.user_id,
            'question_id': self.question_id,
            'creator': {'id': self.creator.id, 'name': self.creator.name} if self.creator else None,
            'recipient': {'id': self.recipient.id, 'name': self.recipient.name} if self.recipient else None,
            'question': {'id': self.question.id, 'title': self.question.title} if self.question else None
        }
    
class Vote(db.Model):
    __tablename__ = 'votes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'))
    answer_id = db.Column(db.Integer, db.ForeignKey('answers.id'))
    vote_type = db.Column(db.String)  # 'upvote' or 'downvote'

    # Relationships
    user = relationship('User', back_populates='votes')
    question = relationship('Question', back_populates='votes')
    answer = relationship('Answer', back_populates='votes')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'question_id': self.question_id,
            'answer_id': self.answer_id,
            'vote_type': self.vote_type,
            'user': {'id': self.user.id, 'name': self.user.name} if self.user else None,
            'question': {'id': self.question.id, 'title': self.question.title} if self.question else None,
            'answer': {'id': self.answer.id, 'answer': self.answer.answer} if self.answer else None
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

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    jti = db.Column(db.String, unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'jti': self.jti,
            'created_at': self.created_at.isoformat()
        }
