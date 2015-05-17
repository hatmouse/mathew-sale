# -*- coding:utf-8 -*-
__author__ = 'Mouse'
import tornado.ioloop
import tornado.wsgi
import handlers
import settings as Settings

handlers = [
    (r'/', handlers.IndexHandler),
    (r'/qiniu', handlers.QiniuHandler),
    (r'/login', handlers.LoginHandler),
    (r'/resiger', handlers.ResigerHandler),
    (r'/salelistjson', handlers.SaleList_Json_Handler),
    (r'/mysetting', handlers.MySettingHandler),
    (r'/addsale', handlers.AddSaleHandler),
    (r'/comment', handlers.CommentHandler),
    (r'/detail', handlers.DetailHandler),
    (r'/help', handlers.HelpHandler)


]

class Application(tornado.web.Application):
    def __init__(self):
        settings = dict(
            template_path=Settings.TEMPLATE_PATH,
            static_path=Settings.STATIC_PATH,
        )
        tornado.web.Application.__init__(self, handlers, **settings)


if __name__ == '__main__':
    application = Application()
    print('Listening 8887...')
    application.listen(Settings.SERVER_PORT)
    #application.listen(8001)
    tornado.ioloop.IOLoop.instance().start()
