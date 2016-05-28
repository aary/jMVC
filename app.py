import json
from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("app.html")

@app.route("/one")
def one():
    return "Page one"

@app.route("/one/two")
def two():
    return "Page two"

@app.route("/one/two/three")
def three():
    return "Page three"

@app.route("/test_json")
def return_json():
    return jsonify({"hello":"world"})

if __name__ == "__main__":
    app.run(debug = True)
