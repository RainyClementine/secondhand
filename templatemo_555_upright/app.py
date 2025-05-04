from flask import Flask, request, jsonify, render_template
# from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/register')
def register():
    return render_template('register.html')
#前端调试用，不完整
@app.route('/register', methods=['POST'])
def register_try():
    if request.method == 'POST':
        data = request.get_json()

        # 这里添加你的注册逻辑，比如检查用户名是否已存在等
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        print(username)
        print(email)
        print(password)

        # 返回成功响应
        return jsonify({
            'success': True,
            'message': '大富大贵！！'
        })
@app.route('/login_email')
def login_email():
    return render_template('login_email.html')
#前端调试用，不完整
@app.route('/login_email', methods=['POST'])
def login_email_try():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        print(email)
        print(password)

        # 返回成功响应
        return jsonify({
            'success': True,
            'message': '大富贵！！'
        })
@app.route('/login_user')
def login_user():
    return render_template('login_user.html')
#前端调试用，不完整
@app.route('/login_user', methods=['POST'])
def login_user_try():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        print(username)
        print(password)

        # 返回成功响应
        return jsonify({
            'success': False,
            'message': '大大贵！！'
        })
@app.route('/api/post_item', methods=['POST'])
def post_item():
    data=request.form
    print(data)
    return "Successfully Added",200



if __name__ == '__main__':
    app.run(debug=True)