# app.py
from flask import Flask, request, jsonify
import pickle
import mysql.connector
from preprocessing import preprocess
from flask_cors import CORS        

app = Flask(__name__)
CORS(app)                         


with open("trained_model.pkl", "rb") as f:
    saved = pickle.load(f)

model = saved["model"]
vocab = saved["vocab"]

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",        
        database="complaint_system"
    )


@app.route("/classify", methods=["POST"])
def classify():

    data = request.get_json()

    
    if not data or "complaint" not in data:
        return jsonify({"error": "No complaint provided"}), 400

    text = data["complaint"].strip()

    if len(text) < 5:
        return jsonify({"error": "Complaint is too short"}), 400

  
    tokens = preprocess(text)
    counts = [tokens.count(w) for w in vocab]
    category = model.predict([counts])[0]

   
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO complaints (complaint_text, category) VALUES (%s, %s)",
            (text, category)
        )
        conn.commit()
        complaint_id = cursor.lastrowid
        cursor.close()
        conn.close()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({
        "id": complaint_id,
        "complaint": text,
        "category": category,
        "message": "Complaint submitted successfully"
    }), 201



@app.route("/complaints", methods=["GET"])
def get_complaints():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM complaints ORDER BY submitted_at DESC")
        complaints = cursor.fetchall()
        cursor.close()
        conn.close()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify(complaints), 200



@app.route("/complaints/<int:complaint_id>", methods=["GET"])
def get_complaint(complaint_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM complaints WHERE id = %s", (complaint_id,))
        complaint = cursor.fetchone()
        cursor.close()
        conn.close()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404

    return jsonify(complaint), 200



@app.route("/complaints/category/<string:category>", methods=["GET"])
def get_by_category(category):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM complaints WHERE category = %s ORDER BY submitted_at DESC",
            (category,)
        )
        complaints = cursor.fetchall()
        cursor.close()
        conn.close()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify(complaints), 200



@app.route("/complaints/<int:complaint_id>", methods=["DELETE"])
def delete_complaint(complaint_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM complaints WHERE id = %s", (complaint_id,))
        conn.commit()
        affected = cursor.rowcount
        cursor.close()
        conn.close()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    if affected == 0:
        return jsonify({"error": "Complaint not found"}), 404

    return jsonify({"message": f"Complaint {complaint_id} deleted"}), 200



if __name__ == "__main__":
    app.run(debug=True)