"""Fix foreign key relationships in views model

Revision ID: 72942716f9da
Revises: 6569255eb9a7
Create Date: 2024-08-13 08:52:01.474676

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '72942716f9da'
down_revision = '6569255eb9a7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('views',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('question_id', sa.Integer(), nullable=False),
    sa.Column('view_count', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('views')
    # ### end Alembic commands ###
