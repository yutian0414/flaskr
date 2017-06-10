from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session,sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
file_path=os.path.dirname(os.path.abspath(__file__))
if file_path[0]=='\\':
    db_path = r'sqlite://' + file_path + r'/data.db'
else:
    db_path=r'sqlite:///' + file_path + r'/data.db'
print(db_path)
engine=create_engine(db_path,convert_unicode=True)
db_session=scoped_session(sessionmaker(autocommit=False,
                                       autoflush=False,
                                       expire_on_commit=False,
                                       bind=engine))
Base=declarative_base()
Base.query=db_session.query_property()
def init_db():
    from models import User,Image,Good_Judge,Bad_Judge
    Base.metadata.create_all(bind=engine)


def getsession():
    return db_session

from contextlib import contextmanager
@contextmanager
def session_scope():
    session=getsession()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()