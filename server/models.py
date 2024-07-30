from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    reputation = db.Column(db.Integer, default=0)
    is_admin = db.Column(db.Boolean, default=False)

    questions = db.relationship('Question', back_populates='user')
    answers = db.relationship('Answer', back_populates='user')
    votes = db.relationship('Vote', back_populates='user')
    badges = db.relationship('Badge', back_populates='user')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

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
    views = db.relationship('Views', back_populates='question')

    def __repr__(self):
        return f'<Question {self.title}>'

class Answer(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    question = db.relationship('Question', back_populates='answers')
    user = db.relationship('User', back_populates='answers')
    votes = db.relationship('Vote', back_populates='answer')

    def __repr__(self):
        return f'<Answer {self.id}>'

class Tag(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    questions = db.relationship('Question', secondary='question_tag', back_populates='tags')

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

    def __repr__(self):
        return f'<Vote {self.id}>'

class Badge(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user = db.relationship('User', back_populates='badges')

    def __repr__(self):
        return f'<Badge {self.name}>'

class Views(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    viewed_at = db.Column(db.DateTime, default=datetime.utcnow)

    question = db.relationship('Question', back_populates='views')

    def __repr__(self):
        return f'<Views {self.id}>'        
   