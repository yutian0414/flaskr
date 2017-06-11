from flask import Flask, request,g,redirect,jsonify,url_for
from flask import session as se
from flask import render_template
from flask import flash
from database import session_scope
from models import User,Good_Judge,Bad_Judge
from models import Image
from datetime import datetime,timedelta,date
from werkzeug import secure_filename
import os
from form import userform
from sqlalchemy import  and_
from PIL import Image as Im
import time

app=Flask(__name__)
app.secret_key="my frist flask app"
app.permanent_session_lifetime=timedelta(days=1)
@app.route('/',methods=['GET','POST'])
def homepage():
    form=userform(request.form)
    username=se.get("username", None)
    if username:
        with session_scope() as session:
            try:
                touxiang=session.query(User).filter(User.username==username).first().touxiang
                touxiang="static"+touxiang.split('static')[-1]
                user=session.query(User).filter(User.username==username).first()
                print(user)
                print(user.images.all())
            except:
                touxiang=""
            imgs = []
            try:
                for img in user.images:
                    imgs.append(imagetodict(img))
            except Exception as e:
                print(e)
                imgs=[]
        return render_template("index.html",user=username,touxiang=touxiang,images=imgs) #返回用户化的页面
    else:
        #返回通用界面
        return render_template("index.html",form=form)

@app.route("/sign_in",methods=["POST"])
def sign_in():
    print(request.form)
    form_username=request.form.get("username_sign_in",None)
    form_password=request.form.get("password_sign_in",None)
    if  form_username and form_password:
        try:
            with session_scope() as session:
                password = session.query(User).filter(User.username==form_username).first().password
            if password == form_password:
                se["username"]=form_username     #将用户名写入道session中
                return redirect("/")
            else:
                return u"用户名或密码错误"
        except Exception as e:
            print(e)
            return u"用户名或密码错误"
    else:
        return u"输入错误"
@app.route("/sign_up",methods=["POST"])
def sign_up():

    form_username=request.form.get("username",None)
    form_password = request.form.get("password", None)
    form_email = request.form.get("email", None)
    form_address = request.form.get("address", None)
    form_birthday = request.form.get("birthday", None)
    flag=request.form.get("modify_flag")
    #将日期字符串转化维日期
    if form_birthday:
        form_birthday = datetime.strptime(form_birthday,"%Y-%m-%d").date()
        print(type(form_birthday))

    #头像文件存储
    file=request.files["touxiang"]
    if file:
        filename=secure_filename(file.filename)
        filepath=os.path.join(os.path.dirname(__file__), "static/upload/touxiang",filename)
        image_flag = image_reshape_circle( file, filepath )
        if image_flag:
            form_touxiang = filepath
        else:
            form_touxiang=''
    else:
        form_touxiang=None
    print(form_username,form_password,form_email,form_address,form_birthday,form_touxiang,type(form_birthday))
    if flag=="original":
        if form_username and form_password and form_email:
            try:
                user = User(username=form_username, password=form_password, \
                    email=form_email, address=form_address, birthday=form_birthday,touxiang=form_touxiang) #注册用户
                print(user)
                with session_scope() as session:
                    session.add(user)
                se["username"]=form_username
                return redirect("/")
            except Exception as e:
                print(e)
                return u"数据库保存信息失败"
        else:
            return u'存在数据不符合规范'
    else:
        old_username=se["username"]
        with session_scope() as session:
            user=session.query(User).filter(User.username==old_username).first()
            if form_password==user.password:
                if user.username!=form_username:
                    try:
                        user_exit=session.query(User).filter(User.username==form_username)
                    except Exception as e:
                        print(e)
                        user_exit=False
                    if user_exit:
                        return "用户名已经存在"
                    else:
                        user.username=form_username
                user.email=form_email
                user.address=form_address
                user.birthday=form_birthday
                if form_touxiang!=None:
                    user.touxiang=form_touxiang
                else:
                    pass
                se["username"]=user.username
                return redirect("/")
            else:
                return "密码错误"

@app.route("/sign_out",methods=["GET"])
def sign_out():
    try:
        del se["username"]
    except:
        pass

    return redirect("/")

@app.route("/comment",methods=["GET","POST"])
def comment():
    pass

@app.route("/add",methods=["GET","POST"])
def add():
    username = se.get("username",None)
    if username!=None:
        if request.method=="POST":
            name=request.form.get("image_name",None)
            date=request.form.get("take_date",None)
            altitude=request.form.get("altitude",None)
            longitude=request.form.get("longitude",None)
            text=request.form.get("image_comment",None)
            file=request.files["photo"]
            image_id=request.form.get("image_id_hidden",None)
            print(image_id)
        if date:
            date = datetime.strptime(date,"%Y-%m-%d").date()
            print(type(date))
    #照片存储
        if file:
            filename=secure_filename(file.filename)
            filepath=os.path.join(os.path.dirname(__file__),"static/upload/image/",username)
            if not os.path.exists(filepath):
                os.mkdir(filepath)
            filepath=os.path.join(filepath,filename)
            file.save(filepath)
            path = filepath
        else:
            path=None
        if not name:
            name=filename.split(".")[0]
            # 保存进数据库
        try:
            with session_scope() as session:
                if image_id==None:
                    user_id=session.query(User).filter_by(username=username).first().username
                    print(user_id,type(user_id))
                    print(user_id)
                    image = Image(name=name, date=date, altitude=altitude, longitude=longitude, text=text, path=path, user_id=user_id)  # 注册照片
                    print(image)
                    session.add(image)
                else:
                    image=session.query(Image).filter_by(id=image_id).first()
                    if image.user_id==username:
                        image.name=name
                        image.date=date
                        image.altitude=altitude
                        image.longitude=longitude
                        image.text=text
                        if path:
                            image.path=path
                        else:
                            pass
                        print("success")
                    else:
                        return '你没有权限更改此图片信息！'
            return redirect("/")  #返回首页，显示照片
        except Exception as e:
            print(e)
            return "数据库保存信息失败"
    else:
        #用户没有登录
        return "用户请先登录"

def imagetodict(img):
    try:
        good_judge_count=len( img.good_judge.all())
    except:
        good_judge_count=0
    try:
        bad_judge_count=len( img.good_judge.all())
    except:
        bad_judge_count=0
    return {
            'id':img.id,
            "name": img.name,
            'date': datetime.strftime(img.date,"%Y-%m-%d"),
            'location': [img.altitude,img.longitude],
            'path': "static"+img.path.split("static")[-1],
            'text': img.text,
            'user_id': img.user_id,
            'good_judge':good_judge_count,
            'bad_judge':bad_judge_count,
    }
@app.route('/judge',methods=["post"])
def judge():
    date=datetime.now()
    username=se.get("username",None)
    if username!=None:
        judge=request.form.get("judge",None)
        image_id=request.form.get("image",None)
        if image_id:
            with session_scope() as session:
                image = session.query( Image ).filter( Image.id == image_id ).first().name
                username=session.query(User).filter(User.username==username).first().username
                judge_1=session.query(Good_Judge).filter(and_(Good_Judge.image==image, Good_Judge.username==username)).first()
                judge_2=session.query(Bad_Judge).filter(and_(Bad_Judge.image==image, Good_Judge.username==username)).first()
                if judge_1 or judge_2 :
                    return jsonify(judge="exist")
                else:
                    if judge=="good":
                        judge_obj=Good_Judge(image=image,username=username,date=date)
                    elif judge=="bad":
                        judge_obj=Bad_Judge(image=image,username=username,date=date)
                    else:
                        return "未传入正确评价数据"
                print(judge_obj)
                session.add( judge_obj )
                return jsonify( judge=judge )
        else:
            return "未传入照片id"
    else:
        return "请先登录, 再评论！谢谢！"

@app.route("/get_user_info")
def get_user_info():
    username=se.get("username",None)
    if username:
        with session_scope() as session:
            user=session.query(User).filter(User.username==username).first()
            if user:
                user_dict=user_to_dict(user)
                if user_dict:
                    return jsonify(user_dict)
                else:
                    return u"内部用户信息查询失败"
            else:
                return u"没有查到相关用户！"
    else:
        return u"用户未登录！请先登录！"


@app.route("/change_password", methods=['post'])
def change_password():
    username=se["username"]
    old_password=request.form.get("password_change_old",None)
    new_password=request.form.get("password_change_new",None)
    with session_scope() as session:
        user=session.query(User).filter(User.username==username).first()
        print(user.password,old_password)
        if user.password==old_password:
            user.password=new_password
            del se["username"]
            return redirect("/")
        else:
            return "原密码输入错误，请重新输入"
@app.route('/edit_img',methods=['POST',])
def edit_img():
    username=se["username"]
    if username:
        id=request.values.get("id")
        with session_scope() as session:
            image=session.query(Image).filter(Image.id==id).first()

            user=image.user_id
        image_dict=image_to_dict(image)
        print( image_dict)
        if user==username:
            return jsonify(image_dict)
        else:
            return "你没有权限进行修改！"
    else:
        return "请先登录！"

def image_to_dict(image):
    if image:
        return {
            "name":image.name,
            "altitude":image.altitude,
            "longitude":image.longitude,
            "text":image.text,
            "date":(image.date).strftime("%Y-%m-%d"),
        }
def user_to_dict(user):
    if user:
        return {
            "username":user.username,
            "email":user.email,
            "birthday":(user.birthday).strftime("%Y-%m-%d"),
            "address":user.address,
            "touxiang":user.touxiang,
            "images":[].append(i.name for i in user.images),
            "comment":[].append(i.id for i in user.comment),
            "good_judge":[].append(i.id for i in user.good_judge),
            "bad_judge":[].append(i.id for i in user.good_judge),
        }
    else:
        return False

def image_reshape_circle(image,image_save_path):
        size=(500,500)
        try:
            im=Im.open(image)
            x,y=im.size
            if x>y:
                x,y=y,x
            box=(int(y/2-x/2),0,int(y/2+x/2),x)
            print(int(y/2-x/2),0,int(y/2+x/2),x)
            region=im.crop(box)
            im_new=Im.new('RGB',(x,x),(255,255,255))
            im_new.paste(region,box)
            im_new.show()
            im_new.save(image_save_path)
            return True
        except Exception as e:
            print(e)
            return False


if __name__=="__main__":
    app.run(host="127.0.0.1",port=8031,debug=True)