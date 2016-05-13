import json
from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("app.html")

@app.route("/test_json")
def return_json():
    return jsonify({"hello":"world"})

if __name__ == "__main__":
    app.run(debug = True)
