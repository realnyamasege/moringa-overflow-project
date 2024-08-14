"""Initial migration

Revision ID: 6569255eb9a7
Revises: 
Create Date: 2024-08-12 02:30:11.349348

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6569255eb9a7'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('token_blocklist',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('jti', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('jti')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('profile_image', sa.String(), nullable=True),
    sa.Column('phone_number', sa.String(), nullable=True),
    sa.Column('admin', sa.Boolean(), nullable=True),
    sa.Column('reputation_points', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('name')
    )
    op.create_table('questions',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('tags', sa.JSON(), nullable=True),
    sa.Column('code_snippet', sa.Text(), nullable=True),
    sa.Column('link', sa.String(), nullable=True),
    sa.Column('upvotes', sa.Integer(), nullable=True),
    sa.Column('downvotes', sa.Integer(), nullable=True),
    sa.Column('resolved', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('answers',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('question_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('answer', sa.Text(), nullable=False),
    sa.Column('link', sa.String(), nullable=True),
    sa.Column('upvotes', sa.Integer(), nullable=True),
    sa.Column('downvotes', sa.Integer(), nullable=True),
    sa.Column('accepted', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('badges',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('admin_id', sa.Integer(), nullable=True),
    sa.Column('count', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('question_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admin_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('votes',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('question_id', sa.Integer(), nullable=True),
    sa.Column('answer_id', sa.Integer(), nullable=True),
    sa.Column('vote_type', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['answer_id'], ['answers.id'], ),
    sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('votes')
    op.drop_table('badges')
    op.drop_table('answers')
    op.drop_table('questions')
    op.drop_table('users')
    op.drop_table('token_blocklist')
    # ### end Alembic commands ###
