from flask import Flask, request, jsonify, render_template,session
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta


app = Flask(__name__, static_folder='static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:qq;200301161517@localhost:3306/shb'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'My_secret_key'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=3)  # 设置 session 有效期
app.config['SESSION_REFRESH_EACH_REQUEST'] = True
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    username = db.Column(db.String(50), primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    items = db.relationship('Item', backref='owner', lazy=True)  # 一对多关系

class Item(db.Model):
    __tablename__ = 'items'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    kind = db.Column(db.String(50))
    price = db.Column(db.Float)
    message = db.Column(db.String(500))
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    user = db.Column(db.String(50), db.ForeignKey('users.username', ondelete='CASCADE'))

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/infinity')
def infinity():
    return render_template('infinity.html')

@app.route('/details')
def details():
    return render_template('details.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/register_try', methods=['POST'])
def register_try():
    # 获取前端发送的JSON数据
    data = request.get_json()
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    # 检查用户名是否已存在
    if User.query.filter_by(username=username).first():
        return jsonify({
            'success': False,
            'message': '用户名已存在'
        }), 400
    
    # 检查邮箱是否已存在
    if User.query.filter_by(email=email).first():
        return jsonify({
            'success': False,
            'message': '邮箱已被注册'
        }), 400
    
    # 添加到数据库
    new_user=User(
        username=username,
        email=email,
        password=password
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': '欢迎新成员！！大富大贵！！'
    })

@app.route('/login_email')
def login_email():
    return render_template('login_email.html')

@app.route('/login_email_try',methods=['POST'])
def login_email_try():
    # 获取前端发送的JSON数据
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    
    # 查询用户
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({
            'success': False,
            'message': '邮箱不存在'
        }), 401
    
    # 登录成功，设置session
    session['username'] = user.username
    
    return jsonify({
        'success': True,
        'message': '登录成功！!六六大顺！！'
    })

@app.route('/login_user')
def login_user():
    return render_template('login_user.html')

@app.route('/login_user_try', methods=['POST'])
def login_user_try():
    # 获取前端发送的JSON数据
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    
    # 查询用户
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({
            'success': False,
            'message': '用户名不存在'
        }), 401
    
    # 登录成功，设置session
    session['username'] = username
    
    return jsonify({
        'success': True,
        'message': '登录成功！!六六大顺！！'
    })

@app.route('/post_item', methods=['POST'])
def post_item():
    username=session.get('username')
    if username:
        data=request.form
        new_item = Item(
                name=data.get('name'),
                kind=data.get('kind'),
                price=data.get('price'),
                message=data.get('message'),
                longitude=data.get('longitude'),
                latitude=data.get('latitude'),
                user=username
            )
        db.session.add(new_item)
        db.session.commit()

        return render_template('index.html'),200
    else:
        return render_template('login_user.html'),403

@app.route('/get_items',methods=['GET','POST'])
def get_items():
    # 获取前端发送的筛选条件（JSON格式）
    filters = request.get_json()
    
    # 初始化查询
    query = Item.query
    
    # 价格范围筛选
    min_price = filters.get('minprice')
    if min_price is not None:
        query = query.filter(Item.price >= float(min_price))
        
    max_price = filters.get('maxprice')
    if max_price is not None:
        query = query.filter(Item.price <= float(max_price))
    
    # 类别筛选
    kind_list = filters.get('kindlist', [])
    if kind_list:  # 如果类别列表不为空
        query = query.filter(Item.kind.in_(kind_list))
    
    # 执行查询
    items = query.all()
    
    # 构建响应数据
    items_list = [{
        'name': item.name,
        'price': item.price,
        'longitude': item.longitude,
        'latitude': item.latitude
    } for item in items]
    
    return jsonify({
        'success': True,
        'items': items_list
    })


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)