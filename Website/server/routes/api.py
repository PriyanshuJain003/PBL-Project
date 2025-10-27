from flask import Blueprint, request, jsonify
import sqlite3
import os

api = Blueprint('api', __name__)

DB_PATH = 'data.db'

# Ensure database and table exist
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Call on import to initialize
init_db()

@api.route('/submit-data', methods=['POST'])
def submit_data():
    try:
        req_json = request.get_json(force=True, silent=True)
        if not req_json or 'data' not in req_json:
            return jsonify({'status': 'error', 'message': 'Missing "data" field in JSON body'}), 400

        data = req_json['data']

        if not isinstance(data, str):
            return jsonify({'status': 'error', 'message': '"data" must be a string'}), 400

        # Insert data into the database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO data (content) VALUES (?)', (data,))
        conn.commit()
        conn.close()

        return jsonify({'status': 'success', 'message': 'Data submitted successfully'}), 200

    except sqlite3.Error as e:
        return jsonify({'status': 'error', 'message': f'Database error: {e}'}), 500
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
