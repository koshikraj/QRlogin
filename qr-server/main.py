from handlers import qr_session
from tornado import web, ioloop


class Application(web.Application):

    def __init__(self):
        web_handlers = [(r"/web/about", qr_session.QRSessionWeb),
                        (r"/web/qr", qr_session.QRSessionWeb)]

        ws_handlers = [(r"/ws/qr", qr_session.QRSessionWS)]
        super().__init__(web_handlers + ws_handlers)

app = Application()

if __name__ == '__main__':
    app.listen(8080)
ioloop.IOLoop.current().start()
