from app import app, db
from models import User, Question, Answer, Tag, Vote, Badge, Views, question_tag

def seed_data():
    with app.app_context():
        # Check if users already exist
        if not User.query.filter_by(username='user1').first():
            user1 = User(username='Cynthia', email='cynthia@gmail.com')
            user1.set_password('123')
            db.session.add(user1)

        if not User.query.filter_by(username='user2').first():
            user2 = User(username='Ezekiel', email='ezekiel@gmail.com')
            user2.set_password('1234')
            db.session.add(user2)

        db.session.commit()

        # Create Tags if they do not already exist
        tag_names = ['Python', 'Flask', 'SQLAlchemy']
        existing_tags = Tag.query.filter(Tag.name.in_(tag_names)).all()
        existing_tag_names = {tag.name for tag in existing_tags}
        
        new_tags = [Tag(name=name) for name in tag_names if name not in existing_tag_names]
        if new_tags:
            db.session.add_all(new_tags)
            db.session.commit()

        # Create Questions
        question1 = Question(title='How to use Flask?', body='I am having trouble using Flask with SQLAlchemy.', user_id=User.query.filter_by(username='user1').first().id)
        question2 = Question(title='Best practices for SQLAlchemy?', body='What are some best practices for using SQLAlchemy in a Flask app?', user_id=User.query.filter_by(username='user2').first().id)

        # Add Questions to the database
        db.session.add_all([question1, question2])
        db.session.commit()

        # Associate Tags with Questions
        tag1 = Tag.query.filter_by(name='Python').first()
        tag2 = Tag.query.filter_by(name='Flask').first()
        tag3 = Tag.query.filter_by(name='SQLAlchemy').first()

        if tag1 and tag2:
            question1.tags.extend([tag1, tag2])
        if tag2 and tag3:
            question2.tags.extend([tag2, tag3])

        db.session.commit()

        # Create Answers
        answer1 = Answer(body='You can use Flask-SQLAlchemy to integrate SQLAlchemy with Flask.', question_id=question1.id, user_id=User.query.filter_by(username='user2').first().id)
        answer2 = Answer(body='Follow the official SQLAlchemy documentation for best practices.', question_id=question2.id, user_id=User.query.filter_by(username='user1').first().id)

        # Add Answers to the database
        db.session.add_all([answer1, answer2])
        db.session.commit()

        # Create Votes
        vote1 = Vote(value=1, user_id=User.query.filter_by(username='user1').first().id, question_id=question1.id)
        vote2 = Vote(value=-1, user_id=User.query.filter_by(username='user2').first().id, answer_id=answer2.id)

        # Add Votes to the database
        db.session.add_all([vote1, vote2])
        db.session.commit()

        # Create Badges
        badge1 = Badge(name='Helpful Contributor', description='Awarded for providing helpful answers.', user_id=User.query.filter_by(username='user1').first().id)
        badge2 = Badge(name='Top Questioner', description='Awarded for asking popular questions.', user_id=User.query.filter_by(username='user2').first().id)

        # Add Badges to the database
        db.session.add_all([badge1, badge2])
        db.session.commit()

        # Create Views
        view1 = Views(question_id=question1.id)
        view2 = Views(question_id=question2.id)

        # Add Views to the database
        db.session.add_all([view1, view2])
        db.session.commit()

if __name__ == '__main__':
    print("Started Seeding")
    seed_data()
    print("Seeding Completed")
