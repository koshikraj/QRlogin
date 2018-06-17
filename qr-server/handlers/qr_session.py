import json

from base64 import b64decode
from tornado import websocket, web, escape

open_sessions = {}
session_string = 201800


class QRSessionWS(websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):

        self.session_string = None

        if self not in open_sessions:
            global session_string
            session_string = session_string + 1
            open_sessions[session_string] = self
            self.session_string = session_string

        self.write_message({'type': 'qr', 'value': session_string})

    def on_close(self):
        """ Remove session from dict on close"""

        try:
            open_sessions.pop(self.session_string)
        except Exception as e:

            pass


class QRSessionWeb(web.RequestHandler):
    """Middleware to communicate with frontend session"""

    def get(self):
        self.write({"status": False,
                    "message": "Invoke a POST request instead"})

    def post(self, *args):
        try:
            # expecting body as json
            json_data = escape.json_decode(b64decode(self.request.body))
            print(json_data)
        except json.decoder.JSONDecodeError as e:
            print('Error while paring the body :{}'.format(str(e)))
            return

        try:
            session_id = json_data["session_id"]
            session_obj = open_sessions.get(int(session_id), None)
            if session_obj:
                session_obj.write_message({'type': 'auth',
                                           'status': True})
        except Exception as e:

            self.set_status(501)
            self.write({"status": False,
                        "message": "Session not found"})
            print('Error while writing message to session :{}'.format(str(e)))
            return
