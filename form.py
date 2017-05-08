from flask_wtf import Form
from wtforms import StringField,DateField,FileField,PasswordField,validators,BooleanField
from flask_wtf.file import FileAllowed

class userform(Form):
    username=StringField("用户名",[validators.required()])
    password=PasswordField("密码",[validators.required()])
    email=StringField("邮箱")
    address=StringField("地址")
    birthday=DateField("生日")
    # sign_in=BooleanField("sign_in",[validators.required()])
    touxiang=FileField("头像",validators=[FileAllowed(['jpg','png'],'Images only!')])
