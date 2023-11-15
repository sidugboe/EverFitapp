import os

from flask import Flask, jsonify, make_response


app = Flask(__name__)


@app.route('/')
def home():
    return make_response(
        jsonify(
            {"message": "Hello from the Server!"}
        ),
        200,
    )


if __name__ == "__main__":
    app.run(host='0.0.0.0',
            port=os.environ.get("FLASK_SERVER_PORT"),
            debug=True)
