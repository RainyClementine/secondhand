from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Byj20040720@localhost:3306/shb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
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
    image_data = db.Column(db.LargeBinary)  # 存储图片二进制
    user = db.Column(db.String(50), db.ForeignKey('users.username', ondelete='CASCADE'))


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/infinity')
def infinity():
    return render_template('infinity.html')

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
    db.session.add(new_item)
    db.session.commit()

    return render_template('index.html'),200



if __name__ == '__main__':
    app.run(debug=True)