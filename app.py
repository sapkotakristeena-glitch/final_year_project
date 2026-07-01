# app.py
from flask import Flask, request, jsonify
from contextlib import contextmanager
import pickle
import mysql.connector
import bcrypt
import jwt
import datetime
from functools import wraps
from preprocessing import preprocess
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ── Secret key for JWT tokens ─────────────────
JWT_SECRET = "solveit_secret_key_change_this"

# ── Load trained ML model ─────────────────────
with open("trained_model.pkl", "rb") as f:
    saved = pickle.load(f)
model = saved["model"]
vocab = saved["vocab"]

# ── Database connection ───────────────────────
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="complaint_system"
    )

# ── Database context manager ──────────────────
@contextmanager
def get_db():
    conn   = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        yield cursor
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

# ── JWT auth decorator ────────────────────────
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.user_id   = data["user_id"]
            request.user_role = data["role"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            if data["role"] != "admin":
                return jsonify({"error": "Admin access required"}), 403
            request.user_id   = data["user_id"]
            request.user_role = data["role"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated


# ════════════════════════════════════════════════
# AUTH ENDPOINTS
# ════════════════════════════════════════════════

@app.route("/api/auth/register", methods=["POST"])
def register():
    data      = request.get_json()
    full_name = data.get("fullName", "").strip()
    email     = data.get("email", "").strip()
    phone     = data.get("phone", "").strip()
    password  = data.get("password", "").strip()

    if not all([full_name, email, phone, password]):
        return jsonify({"error": "All fields are required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    try:
        with get_db() as cursor:
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                return jsonify({"error": "Email already registered"}), 409
            cursor.execute(
                "INSERT INTO users (full_name, email, phone, password) VALUES (%s, %s, %s, %s)",
                (full_name, email, phone, hashed)
            )
            user_id = cursor.lastrowid
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({
        "message": "Account created successfully",
        "user": { "id": user_id, "fullName": full_name, "email": email, "phone": phone }
    }), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data     = request.get_json()
    email    = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not all([email, password]):
        return jsonify({"error": "Email and password are required"}), 400

    try:
        with get_db() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    if not user:
        return jsonify({"error": "Account not found"}), 404
    if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        return jsonify({"error": "Invalid email or password"}), 401

    token = jwt.encode({
        "user_id": user["id"],
        "role":    user["role"],
        "exp":     datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, JWT_SECRET, algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {
            "id":       user["id"],
            "fullName": user["full_name"],
            "email":    user["email"],
            "phone":    user["phone"],
            "role":     user["role"]
        }
    }), 200


@app.route("/api/auth/logout", methods=["POST"])
@token_required
def logout():
    return jsonify({"message": "Logged out successfully"}), 200


@app.route("/api/auth/change-password", methods=["POST"])
@token_required
def change_password():
    data             = request.get_json()
    current_password = data.get("currentPassword", "").strip()
    new_password     = data.get("newPassword", "").strip()

    if not all([current_password, new_password]):
        return jsonify({"error": "Both fields are required"}), 400
    if len(new_password) < 6:
        return jsonify({"error": "New password must be at least 6 characters"}), 400

    try:
        with get_db() as cursor:
            cursor.execute("SELECT * FROM users WHERE id = %s", (request.user_id,))
            user = cursor.fetchone()
            if not bcrypt.checkpw(current_password.encode("utf-8"), user["password"].encode("utf-8")):
                return jsonify({"error": "Current password is incorrect"}), 401
            new_hashed = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            cursor.execute("UPDATE users SET password = %s WHERE id = %s", (new_hashed, request.user_id))
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({"message": "Password updated successfully"}), 200


# ════════════════════════════════════════════════
# USER ENDPOINTS
# ════════════════════════════════════════════════

@app.route("/api/user/profile", methods=["GET"])
@token_required
def get_profile():
    try:
        with get_db() as cursor:
            cursor.execute(
                "SELECT id, full_name, email, phone, created_at FROM users WHERE id = %s",
                (request.user_id,)
            )
            user = cursor.fetchone()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id":        user["id"],
        "fullName":  user["full_name"],
        "email":     user["email"],
        "phone":     user["phone"],
        "createdAt": str(user["created_at"])
    }), 200


@app.route("/api/user/stats", methods=["GET"])
@token_required
def get_user_stats():
    try:
        with get_db() as cursor:
            cursor.execute("SELECT COUNT(*) as count FROM complaints WHERE user_id = %s AND status = 'Pending'",    (request.user_id,))
            pending     = cursor.fetchone()["count"]
            cursor.execute("SELECT COUNT(*) as count FROM complaints WHERE user_id = %s AND status = 'In Review'", (request.user_id,))
            in_progress = cursor.fetchone()["count"]
            cursor.execute("SELECT COUNT(*) as count FROM complaints WHERE user_id = %s AND status = 'Resolved'",  (request.user_id,))
            resolved    = cursor.fetchone()["count"]
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({ "pending": pending, "inProgress": in_progress, "resolved": resolved }), 200


# ════════════════════════════════════════════════
# COMPLAINT ENDPOINTS
# ════════════════════════════════════════════════

@app.route("/api/complaints", methods=["POST"])
@token_required
def submit_complaint():
    data        = request.get_json()
    title       = data.get("title", "").strip()
    description = data.get("description", "").strip()

    if not all([title, description]):
        return jsonify({"error": "Title and description are required"}), 400
    if len(description) < 5:
        return jsonify({"error": "Description is too short"}), 400

    tokens   = preprocess(description)
    counts   = [tokens.count(w) for w in vocab]
    category = model.predict([counts])[0]

    try:
        with get_db() as cursor:
            cursor.execute(
                "INSERT INTO complaints (user_id, title, complaint_text, category) VALUES (%s, %s, %s, %s)",
                (request.user_id, title, description, category)
            )
            complaint_id = cursor.lastrowid
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({
        "message": "Complaint submitted successfully",
        "complaint": { "id": complaint_id, "title": title, "category": category, "status": "Pending" }
    }), 201


@app.route("/api/complaints", methods=["GET"])
@token_required
def get_user_complaints():
    try:
        with get_db() as cursor:
            cursor.execute(
                "SELECT id, title, complaint_text, category, status, submitted_at FROM complaints WHERE user_id = %s ORDER BY submitted_at DESC",
                (request.user_id,)
            )
            complaints = cursor.fetchall()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({
        "complaints": [
            {
                "id":       str(c["id"]),
                "title":    c["title"],
                "description": c["complaint_text"],
                "category": c["category"],
                "status":   c["status"],
                "date":     str(c["submitted_at"])[:10].replace("-", "/")
            }
            for c in complaints
        ]
    }), 200


@app.route("/api/complaints/<int:complaint_id>", methods=["GET"])
@token_required
def get_complaint(complaint_id):
    try:
        with get_db() as cursor:
            cursor.execute(
                "SELECT * FROM complaints WHERE id = %s AND user_id = %s",
                (complaint_id, request.user_id)
            )
            complaint = cursor.fetchone()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404

    return jsonify({
        "id":          str(complaint["id"]),
        "title":       complaint["title"],
        "description": complaint["complaint_text"],
        "category":    complaint["category"],
        "status":      complaint["status"],
        "date":        str(complaint["submitted_at"])[:10].replace("-", "/")
    }), 200


@app.route("/api/complaints/recent", methods=["GET"])
@admin_required
def get_recent_complaints():
    try:
        with get_db() as cursor:
            cursor.execute(
                """SELECT c.id, c.title, c.category, c.status, c.submitted_at, u.full_name as userName
                   FROM complaints c JOIN users u ON c.user_id = u.id
                   ORDER BY c.submitted_at DESC LIMIT 10"""
            )
            complaints = cursor.fetchall()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({
        "complaints": [
            {
                "id":       str(c["id"]),
                "title":    c["title"],
                "category": c["category"],
                "status":   c["status"],
                "date":     str(c["submitted_at"])[:10].replace("-", "/"),
                "userName": c["userName"]
            }
            for c in complaints
        ]
    }), 200


@app.route("/api/complaints/<int:complaint_id>/status", methods=["PATCH"])
@admin_required
def update_status(complaint_id):
    data       = request.get_json()
    new_status = data.get("status", "").strip()

    if new_status not in ["Pending", "In Review", "Resolved"]:
        return jsonify({"error": "Invalid status value"}), 400

    try:
        with get_db() as cursor:
            cursor.execute("SELECT user_id FROM complaints WHERE id = %s", (complaint_id,))
            complaint = cursor.fetchone()
            if not complaint:
                return jsonify({"error": "Complaint not found"}), 404

            cursor.execute("UPDATE complaints SET status = %s WHERE id = %s", (new_status, complaint_id))

            if new_status == "In Review":
                message = f"Your complaint #{complaint_id} is now being reviewed. We will work on resolving it shortly."
            elif new_status == "Resolved":
                message = f"Your complaint #{complaint_id} has been resolved. Thank you for your patience."
            else:
                message = f"Your complaint #{complaint_id} status has been updated to {new_status}."

            cursor.execute(
                "INSERT INTO notifications (user_id, message) VALUES (%s, %s)",
                (complaint["user_id"], message)
            )
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({ "message": "Status updated successfully", "complaint": { "id": complaint_id, "status": new_status } }), 200


@app.route("/api/admin/complaints", methods=["GET"])
@admin_required
def get_all_complaints():
    try:
        with get_db() as cursor:
            cursor.execute(
                """SELECT c.id, c.title, c.category, c.status, c.submitted_at, u.full_name as userName
                   FROM complaints c JOIN users u ON c.user_id = u.id
                   ORDER BY c.submitted_at DESC"""
            )
            complaints = cursor.fetchall()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({
        "complaints": [
            {
                "id":       str(c["id"]),
                "title":    c["title"],
                "category": c["category"],
                "status":   c["status"],
                "date":     str(c["submitted_at"])[:10].replace("-", "/"),
                "userName": c["userName"]
            }
            for c in complaints
        ]
    }), 200


@app.route("/api/admin/stats", methods=["GET"])
@admin_required
def get_admin_stats():
    try:
        with get_db() as cursor:
            cursor.execute("SELECT COUNT(*) as count FROM complaints")
            total       = cursor.fetchone()["count"]
            cursor.execute("SELECT COUNT(*) as count FROM complaints WHERE status = 'Pending'")
            pending     = cursor.fetchone()["count"]
            cursor.execute("SELECT COUNT(*) as count FROM complaints WHERE status = 'In Review'")
            in_progress = cursor.fetchone()["count"]
            cursor.execute("SELECT COUNT(*) as count FROM complaints WHERE status = 'Resolved'")
            resolved    = cursor.fetchone()["count"]
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({ "total": total, "pending": pending, "inProgress": in_progress, "resolved": resolved }), 200


# ════════════════════════════════════════════════
# NOTIFICATION ENDPOINTS
# ════════════════════════════════════════════════

@app.route("/api/notifications", methods=["GET"])
@token_required
def get_notifications():
    try:
        with get_db() as cursor:
            cursor.execute(
                "SELECT id, message, is_read, created_at FROM notifications WHERE user_id = %s ORDER BY created_at DESC",
                (request.user_id,)
            )
            notifications = cursor.fetchall()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({
        "notifications": [
            {
                "id":        n["id"],
                "message":   n["message"],
                "read":      bool(n["is_read"]),
                "createdAt": str(n["created_at"])[:10]
            }
            for n in notifications
        ]
    }), 200


@app.route("/api/notifications/<int:notification_id>/read", methods=["PATCH"])
@token_required
def mark_notification_read(notification_id):
    try:
        with get_db() as cursor:
            cursor.execute(
                "UPDATE notifications SET is_read = TRUE WHERE id = %s AND user_id = %s",
                (notification_id, request.user_id)
            )
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({"message": "Notification marked as read"}), 200


# ── Keep original classify endpoint ──────────
@app.route("/classify", methods=["POST"])
def classify():
    data = request.get_json()
    if not data or "complaint" not in data:
        return jsonify({"error": "No complaint provided"}), 400

    text = data["complaint"].strip()
    if len(text) < 5:
        return jsonify({"error": "Complaint is too short"}), 400

    tokens   = preprocess(text)
    counts   = [tokens.count(w) for w in vocab]
    category = model.predict([counts])[0]

    return jsonify({"category": category}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)