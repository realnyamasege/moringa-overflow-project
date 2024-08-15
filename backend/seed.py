from app import app, db, User, Question, Answer, Badge, Vote, TokenBlocklist
from werkzeug.security import generate_password_hash
from datetime import datetime

# Sample data
users = [
    User(name='John Doe', email='john.doe@example.com', password=generate_password_hash('password'), profile_image='https://randomuser.me/api/portraits/men/1.jpg', phone_number='123-456-7890', admin=True, reputation_points=200),
    User(name='Jane Smith', email='jane.smith@example.com', password=generate_password_hash('password'), profile_image='https://randomuser.me/api/portraits/women/2.jpg', phone_number='987-654-3210', admin=False, reputation_points=150),
    User(name='Alice Johnson', email='alice.johnson@example.com', password=generate_password_hash('password'), profile_image='https://randomuser.me/api/portraits/women/3.jpg', phone_number='555-555-5555', admin=False, reputation_points=180),
    User(name='Robert Brown', email='robert.brown@example.com', password=generate_password_hash('password'), profile_image='https://randomuser.me/api/portraits/men/4.jpg', phone_number='222-333-4444', admin=False, reputation_points=300),
    User(name='Emily Davis', email='emily.davis@example.com', password=generate_password_hash('password'), profile_image='https://randomuser.me/api/portraits/women/5.jpg', phone_number='666-777-8888', admin=True, reputation_points=220),
    User(name='Michael Wilson', email='michael.wilson@example.com', password=generate_password_hash('password'), profile_image='https://randomuser.me/api/portraits/men/6.jpg', phone_number='999-000-1111', admin=False, reputation_points=130),
    User(name='Sarah Martinez', email='sarah.martinez@example.com', password=generate_password_hash('password'), profile_image='https://randomuser.me/api/portraits/women/6.jpg', phone_number='333-444-5555', admin=False, reputation_points=170)
]

questions = [
    Question(user_id=1, title='How to connect Flask with a PostgreSQL database?', content='I am setting up a Flask application and need to connect it to a PostgreSQL database. Can someone provide an example?', tags=['Flask', 'PostgreSQL', 'Python'], code_snippet='''from flask import Flask\nfrom flask_sqlalchemy import SQLAlchemy\n\napp = Flask(__name__)\napp.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost/mydatabase'\ndb = SQLAlchemy(app)\n\n# Define a model\nclass User(db.Model):\n    id = db.Column(db.Integer, primary_key=True)\n    username = db.Column(db.String(80), unique=True, nullable=False)\n    email = db.Column(db.String(120), unique=True, nullable=False)\n\n    def __repr__(self):\n        return f'<User {self.username}>'\n''', link='https://flask-sqlalchemy.palletsprojects.com/', upvotes=12, downvotes=3, resolved=False),
    Question(user_id=2, title='What are the best practices for designing REST APIs?', content='Can someone explain the best practices for designing RESTful APIs with examples?', tags=['API', 'REST', 'Best Practices'], code_snippet='''# Example of a REST API endpoint using Flask\nfrom flask import Flask, jsonify, request\n\napp = Flask(__name__)\n\n@app.route('/api/items', methods=['GET'])\ndef get_items():\n    items = [{'id': 1, 'name': 'Item 1'}, {'id': 2, 'name': 'Item 2'}]\n    return jsonify(items)\n\nif __name__ == '__main__':\n    app.run(debug=True)\n''', link='https://restfulapi.net/', upvotes=18, downvotes=1, resolved=True),
    Question(user_id=3, title='How to implement JWT authentication in Flask?', content='I want to add JWT authentication to my Flask app. Can someone provide a code example?', tags=['Flask', 'JWT', 'Authentication'], code_snippet='''from flask import Flask, request, jsonify\nfrom flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity\n\napp = Flask(__name__)\napp.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'\njwt = JWTManager(app)\n\n@app.route('/login', methods=['POST'])\ndef login():\n    username = request.json.get('username', None)\n    if username != 'user':\n        return jsonify({'msg': 'Invalid username'}), 401\n    access_token = create_access_token(identity=username)\n    return jsonify(access_token=access_token)\n\nif __name__ == '__main__':\n    app.run()\n''', link='https://flask-jwt-extended.readthedocs.io/en/stable/', upvotes=25, downvotes=2, resolved=False),
    Question(user_id=4, title='How to use SQLAlchemy with Flask?', content='What are the common practices for using SQLAlchemy in a Flask application?', tags=['Flask', 'SQLAlchemy', 'Database'], code_snippet='''from flask import Flask\nfrom flask_sqlalchemy import SQLAlchemy\n\napp = Flask(__name__)\napp.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'\ndb = SQLAlchemy(app)\n\nclass Post(db.Model):\n    id = db.Column(db.Integer, primary_key=True)\n    title = db.Column(db.String(100), nullable=False)\n    content = db.Column(db.Text, nullable=False)\n\n    def __repr__(self):\n        return f'<Post {self.title}>'\n\nif __name__ == '__main__':\n    app.run()\n''', link='https://docs.sqlalchemy.org/en/14/', upvotes=30, downvotes=5, resolved=False),
    Question(user_id=5, title='Best way to handle file uploads in Flask?', content='Can someone provide an example of handling file uploads in a Flask app?', tags=['Flask', 'File Uploads'], code_snippet='''from flask import Flask, request\nfrom werkzeug.utils import secure_filename\nimport os\n\napp = Flask(__name__)\napp.config['UPLOAD_FOLDER'] = 'uploads/'\n\n@app.route('/upload', methods=['POST'])\ndef upload_file():\n    if 'file' not in request.files:\n        return 'No file part', 400\n    file = request.files['file']\n    if file.filename == '':\n        return 'No selected file', 400\n    filename = secure_filename(file.filename)\n    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))\n    return 'File uploaded successfully', 200\n\nif __name__ == '__main__':\n    app.run()\n''', link='https://flask.palletsprojects.com/en/2.0.x/patterns/fileuploads/', upvotes=20, downvotes=1, resolved=True)
]

answers = [
    Answer(question_id=1, user_id=2, answer='You can use Flask-SQLAlchemy to connect Flask with PostgreSQL. Here is a basic setup example:', link='https://flask-sqlalchemy.palletsprojects.com/', upvotes=7, downvotes=0, accepted=True),
    Answer(question_id=2, user_id=3, answer='Best practices for REST APIs include using HTTP methods correctly, structuring URLs properly, and providing meaningful responses. Here is a comprehensive guide:', link='https://www.restapitutorial.com/', upvotes=10, downvotes=2, accepted=False),
    Answer(question_id=3, user_id=1, answer='To implement JWT authentication in Flask, you can use the Flask-JWT-Extended library. Here is a code example:', link='https://flask-jwt-extended.readthedocs.io/en/stable/', upvotes=15, downvotes=1, accepted=True),
    Answer(question_id=4, user_id=5, answer='Using SQLAlchemy with Flask involves configuring the SQLAlchemy instance and creating models. Refer to the documentation for a detailed guide:', link='https://docs.sqlalchemy.org/en/14/', upvotes=12, downvotes=3, accepted=False),
    Answer(question_id=5, user_id=4, answer='Flask provides support for file uploads using the `request` object. You can save the uploaded files to a specified folder as shown in the example:', link='https://flask.palletsprojects.com/en/2.0.x/patterns/fileuploads/', upvotes=9, downvotes=0, accepted=True)
]

badges = [
    Badge(user_id=1, admin_id=2, name='Flask Expert', count=10, question_id=None),
    Badge(user_id=2, admin_id=2, name='Database Guru', count=5, question_id=None),
    Badge(user_id=3, admin_id=3, name='JWT Master', count=8, question_id=1),
    Badge(user_id=4, admin_id=1, name='Code Contributor', count=12, question_id=2),
    Badge(user_id=5, admin_id=1, name='File Upload Specialist', count=6, question_id=3)
]

votes = [
    Vote(user_id=1, question_id=1, vote_type='upvote'),
    Vote(user_id=2, question_id=2, vote_type='upvote'),
    Vote(user_id=3, question_id=3, vote_type='downvote'),
    Vote(user_id=4, question_id=4, vote_type='upvote'),
    Vote(user_id=5, question_id=5, vote_type='upvote'),
]

with app.app_context():
    # Drop all existing tables
    db.drop_all()
    # Create all tables
    db.create_all()

    # Insert sample data into the database
    for user in users:
        db.session.add(user)
    for question in questions:
        db.session.add(question)
    for answer in answers:
        db.session.add(answer)
    for badge in badges:
        db.session.add(badge)
    for vote in votes:
        db.session.add(vote)

    # Commit all changes to the database
    db.session.commit()
    print("Database seeded successfully.")
