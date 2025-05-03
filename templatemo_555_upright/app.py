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

@app.route('/login_email')
def login_email():
    return render_template('login_email.html')

@app.route('/login_user')
def login_user():
    return render_template('login_user.html')

@app.route('/api/post_item', methods=['POST'])
def post_item():
    data=request.form
    print(data)
    return render_template('index.html'),200



if __name__ == '__main__':
    app.run(debug=True)