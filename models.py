from sqlalchemy import Column, Integer, String, Date, DateTime,Boolean
from database import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, backref


class User( Base ):
    __tablename__ = "user"
    id = Column( Integer, primary_key=True, autoincrement=True )
    username = Column( String( 50 ), unique=True, nullable=False )
    password = Column( String( 50 ), nullable=False )
    email = Column( String( 100 ) )
    address = Column( String( 100 ) )
    birthday = Column( Date() )
    touxiang = Column( String( 100 ), nullable=True )
    images = relationship( 'Image', backref='user', lazy='dynamic' )
    comment = relationship( "Comment", backref="user", lazy='dynamic' )
    good_judge=relationship('Good_Judge',backref="user",lazy='dynamic')
    bad_judge = relationship( 'Bad_Judge', backref="user", lazy='dynamic' )

    def __str__(self):
        return self.username


class Image( Base ):
    __tablename__ = "images"
    id = Column( Integer, primary_key=True, autoincrement=True )
    name = Column( String( 100 ), nullable=False )
    altitude = Column( String( 10 ), nullable=False )
    longitude = Column( String( 10 ), nullable=False )
    text = Column( String( 1000 ) )
    date = Column( Date() )
    user_id = Column( String(50), ForeignKey( 'user.username' ) )
    path = Column( String( 100 ), nullable=False )
    good_judge=relationship('Good_Judge',backref="images",lazy='dynamic')
    bad_judge = relationship( 'Bad_Judge', backref="images", lazy='dynamic' )

    def location(self):
        return self.longitude, self.altitude

    def __str__(self):
        return self.name
class Comment( Base ):
    __tablename__ = "comments"
    id = Column( Integer, primary_key=True, autoincrement=True )
    from_user = Column( String( 50 ), ForeignKey( 'user.username' ) )
    content = Column( String( 200 ), nullable=False )
    pubtime = Column( DateTime )

    def __str__(self):
        return self.from_user + ":" + self.content

class Good_Judge( Base ):
    __tablename__="goodjudge"
    id = Column( Integer, primary_key=True, autoincrement=True )
    image=Column(String,ForeignKey('images.name'))
    username=Column(String,ForeignKey('user.username'))
    date=Column(DateTime)
class Bad_Judge( Base ):
    __tablename__="badjudge"
    id = Column( Integer, primary_key=True, autoincrement=True )
    image=Column(String,ForeignKey('images.name'))
    username=Column(String,ForeignKey('user.username'))
    date=Column(DateTime)

