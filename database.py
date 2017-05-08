from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session,sessionmaker
from sqlalchemy.ext.declarative import declarative_base
engine=create_engine("sqlite:////home/jerry/flaskr/data.db",convert_unicode=True)
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