from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Byj20040720@localhost:3306/shb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
SHB = SQLAlchemy(app)  # 全局数据库对象
class Item(SHB.Model):
    __tablename__ = 'items'  # 指定表名（可选，默认自动推断）
    
    id = SHB.Column(SHB.Integer, primary_key=True, autoincrement=True)
    name = SHB.Column(SHB.String(100), nullable=False)
    kind = SHB.Column(SHB.String(50))
    price = SHB.Column(SHB.Float)
    message = SHB.Column(SHB.String(500))  # 注意字段名拼写需与表一致
    longitude = SHB.Column(SHB.Float)
    latitude = SHB.Column(SHB.Float)

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/login_email')
def login_email():
    return render_template('login_email.html')

@app.route('/login_user')
def login_user():
    return render_template('login_user.html')

@app.route('/api/post_item', methods=['POST'])
def post_item():
    data=request.form
    new_item = Item(
            name=data.get('name'),
            kind=data.get('kind'),
            price=data.get('price'),
            message=data.get('message'),
            longitude=data.get('longitude'),
            latitude=data.get('latitude')
        )
    SHB.session.add(new_item)
    SHB.session.commit()

    return render_template('index.html'),200



if __name__ == '__main__':
    app.run(debug=True)