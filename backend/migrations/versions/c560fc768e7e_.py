"""empty message

Revision ID: c560fc768e7e
Revises: 5e296d785e8c
Create Date: 2024-08-13 20:28:28.732885

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c560fc768e7e'
down_revision = '5e296d785e8c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('answers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('codeSnippet', sa.Text(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('answers', schema=None) as batch_op:
        batch_op.drop_column('codeSnippet')

    # ### end Alembic commands ###
